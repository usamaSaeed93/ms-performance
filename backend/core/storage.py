"""
Flexible storage service for handling file uploads
Supports AWS S3 and DigitalOcean Spaces (S3-compatible)
"""
import os
from abc import ABC, abstractmethod
from typing import Optional, BinaryIO
from datetime import datetime, timedelta
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from instance.config import config


class StorageInterface(ABC):
    """Abstract base class for storage implementations"""

    @abstractmethod
    async def upload_file(
        self, file_obj: BinaryIO, bucket_name: str, object_name: str, content_type: Optional[str] = None
    ) -> str:
        """Upload a file and return the URL"""
        pass

    @abstractmethod
    async def delete_file(self, bucket_name: str, object_name: str) -> bool:
        """Delete a file from storage"""
        pass

    @abstractmethod
    async def get_presigned_url(
        self, bucket_name: str, object_name: str, expiration: int = 3600
    ) -> str:
        """Generate a presigned URL for temporary access"""
        pass

    @abstractmethod
    async def file_exists(self, bucket_name: str, object_name: str) -> bool:
        """Check if a file exists"""
        pass


class S3Storage(StorageInterface):
    """AWS S3 storage implementation"""

    def __init__(self):
        self.access_key = os.getenv("AWS_ACCESS_KEY_ID", "")
        self.secret_key = os.getenv("AWS_SECRET_ACCESS_KEY", "")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.endpoint_url = os.getenv("AWS_ENDPOINT_URL")  # None for AWS, URL for DigitalOcean
        
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name=self.region,
            endpoint_url=self.endpoint_url,
            config=Config(signature_version="s3v4"),
        )

    async def upload_file(
        self, file_obj: BinaryIO, bucket_name: str, object_name: str, content_type: Optional[str] = None
    ) -> str:
        """Upload file to S3/Spaces"""
        try:
            extra_args = {}
            if content_type:
                extra_args["ContentType"] = content_type
            
            self.s3_client.upload_fileobj(
                file_obj,
                bucket_name,
                object_name,
                ExtraArgs=extra_args,
            )
            
            # Return public URL
            if self.endpoint_url:
                # DigitalOcean Spaces
                return f"{self.endpoint_url}/{bucket_name}/{object_name}"
            else:
                # AWS S3
                return f"https://{bucket_name}.s3.{self.region}.amazonaws.com/{object_name}"
        except ClientError as e:
            raise Exception(f"Failed to upload file: {str(e)}")

    async def delete_file(self, bucket_name: str, object_name: str) -> bool:
        """Delete file from S3/Spaces"""
        try:
            self.s3_client.delete_object(Bucket=bucket_name, Key=object_name)
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete file: {str(e)}")

    async def get_presigned_url(
        self, bucket_name: str, object_name: str, expiration: int = 3600
    ) -> str:
        """Generate presigned URL"""
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": object_name},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    async def file_exists(self, bucket_name: str, object_name: str) -> bool:
        """Check if file exists"""
        try:
            self.s3_client.head_object(Bucket=bucket_name, Key=object_name)
            return True
        except ClientError:
            return False


class StorageService:
    """Storage service factory"""

    _instance: Optional[StorageInterface] = None

    @classmethod
    def get_storage(cls) -> StorageInterface:
        """Get storage instance (singleton)"""
        if cls._instance is None:
            storage_type = os.getenv("STORAGE_TYPE", "s3").lower()
            
            if storage_type == "s3":
                cls._instance = S3Storage()
            else:
                raise ValueError(f"Unsupported storage type: {storage_type}")
        
        return cls._instance

    @classmethod
    def reset(cls):
        """Reset storage instance (useful for testing)"""
        cls._instance = None


# Convenience function
def get_storage() -> StorageInterface:
    """Get storage service instance"""
    return StorageService.get_storage()

