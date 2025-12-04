"""
Flexible storage service for handling file uploads
Supports AWS S3 (and compatible providers) as well as local filesystem storage.
"""
import logging
import os
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from pathlib import Path
from typing import BinaryIO, Optional

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from instance.config import config

logger = logging.getLogger("storage")


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
        # Lower the timeout so a misconfigured or firewalled endpoint fails fast
        self._client_timeout = Config(
            signature_version="s3v4",
            connect_timeout=5,
            read_timeout=15,
            retries={"max_attempts": 2},
        )
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name=self.region,
            endpoint_url=self.endpoint_url,
            config=self._client_timeout,
        )

    async def upload_file(
        self, file_obj: BinaryIO, bucket_name: str, object_name: str, content_type: Optional[str] = None
    ) -> str:
        """Upload file to S3/Spaces"""
        try:
            # Get file size for logging
            file_obj.seek(0, 2)  # Seek to end
            file_size = file_obj.tell()
            file_obj.seek(0)  # Reset to beginning
            
            logger.debug(f"Uploading file to S3 - object_name: {object_name}, size: {file_size} bytes, bucket: {bucket_name}, content_type: {content_type}")
            
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
                file_url = f"{self.endpoint_url}/{bucket_name}/{object_name}"
            else:
                # AWS S3
                file_url = f"https://{bucket_name}.s3.{self.region}.amazonaws.com/{object_name}"
            
            logger.info(f"Successfully uploaded file to S3: {file_url} (size: {file_size} bytes)")
            return file_url
        except ClientError as e:
            logger.exception(f"Failed to upload file to S3 - object_name: {object_name}, bucket: {bucket_name}, error: {str(e)}")
            raise Exception(f"Failed to upload file: {str(e)}")
        except Exception as e:
            logger.exception(f"Unexpected error during S3 upload - object_name: {object_name}, bucket: {bucket_name}, error: {str(e)}")
            raise

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


class LocalStorage(StorageInterface):
    """Local filesystem storage implementation (useful for dev/test environments)"""

    def __init__(self):
        # Where files are stored on disk
        self.root_path = Path(
            os.getenv("LOCAL_STORAGE_PATH", getattr(config, "LOCAL_STORAGE_PATH", "uploads"))
        )
        self.root_path.mkdir(parents=True, exist_ok=True)
        # Public base URL that maps to the mounted static route
        self.base_url = os.getenv(
            "LOCAL_STORAGE_BASE_URL", getattr(config, "LOCAL_STORAGE_BASE_URL", "/uploads")
        ).rstrip("/")

    async def upload_file(
        self, file_obj: BinaryIO, bucket_name: str, object_name: str, content_type: Optional[str] = None
    ) -> str:
        # Bucket name is ignored for local storage but kept for API parity
        safe_object = object_name.lstrip("/").replace("..", "")
        dest_path = self.root_path / safe_object
        
        try:
            # Get file size for logging
            file_obj.seek(0, 2)  # Seek to end
            file_size = file_obj.tell()
            file_obj.seek(0)  # Reset to beginning
            
            logger.debug(f"Uploading file to local storage - object_name: {object_name}, size: {file_size} bytes, path: {dest_path}")
            
            dest_path.parent.mkdir(parents=True, exist_ok=True)

            file_obj.seek(0)
            with open(dest_path, "wb") as f:
                f.write(file_obj.read())

            # Return a URL that matches the mounted static route
            file_url = f"{self.base_url.rstrip('/')}/{safe_object.lstrip('/')}"
            logger.info(f"Successfully uploaded file to local storage: {file_url} (size: {file_size} bytes, path: {dest_path})")
            return file_url
        except Exception as e:
            logger.exception(f"Failed to upload file to local storage - object_name: {object_name}, path: {dest_path}, error: {str(e)}")
            raise

    async def delete_file(self, bucket_name: str, object_name: str) -> bool:
        safe_object = object_name.lstrip("/").replace("..", "")
        dest_path = self.root_path / safe_object
        if dest_path.exists():
            dest_path.unlink()
            return True
        return False

    async def get_presigned_url(
        self, bucket_name: str, object_name: str, expiration: int = 3600
    ) -> str:
        # For local storage the file is already publicly available via static mount
        safe_object = object_name.lstrip("/").replace("..", "")
        return f"{self.base_url.rstrip('/')}/{safe_object.lstrip('/')}"

    async def file_exists(self, bucket_name: str, object_name: str) -> bool:
        safe_object = object_name.lstrip("/").replace("..", "")
        return (self.root_path / safe_object).exists()


class StorageService:
    """Storage service factory"""

    _instance: Optional[StorageInterface] = None

    @classmethod
    def get_storage(cls) -> StorageInterface:
        """Get storage instance (singleton)"""
        if cls._instance is None:
            storage_type = os.getenv(
                "STORAGE_TYPE", getattr(config, "STORAGE_TYPE", "local")
            ).lower()

            if storage_type == "s3":
                cls._instance = S3Storage()
            elif storage_type == "local":
                cls._instance = LocalStorage()
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
