"""
Flexible storage service for handling file uploads
Supports Cloudflare R2 and local filesystem storage.
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


class R2Storage(StorageInterface):
    """Cloudflare R2 storage implementation"""

    def __init__(self):
        self.access_key_id = os.getenv("R2_ACCESS_KEY_ID", "")
        self.secret_access_key = os.getenv("R2_SECRET_ACCESS_KEY", "")
        self.account_id = os.getenv("R2_ACCOUNT_ID", "")
        self.bucket_name = os.getenv("R2_BUCKET_NAME", "")
        # R2 endpoint URL format: https://<account-id>.r2.cloudflarestorage.com
        self.endpoint_url = os.getenv("R2_ENDPOINT_URL") or f"https://{self.account_id}.r2.cloudflarestorage.com"
        # Public URL for accessing files (custom domain or R2 public URL)
        # If using custom domain, set this to your custom domain (e.g., https://cdn.example.com)
        # If using R2 public bucket, this will be auto-generated from endpoint_url
        self.public_url = os.getenv("R2_PUBLIC_URL")
        
        if not self.access_key_id or not self.secret_access_key:
            raise ValueError("R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be set")
        if not self.account_id:
            raise ValueError("R2_ACCOUNT_ID must be set")
        if not self.bucket_name:
            raise ValueError("R2_BUCKET_NAME must be set")
        
        # Lower the timeout so a misconfigured or firewalled endpoint fails fast
        self._client_timeout = Config(
            signature_version="s3v4",
            connect_timeout=5,
            read_timeout=15,
            retries={"max_attempts": 2},
        )
        self.r2_client = boto3.client(
            "s3",
            aws_access_key_id=self.access_key_id,
            aws_secret_access_key=self.secret_access_key,
            endpoint_url=self.endpoint_url,
            region_name="auto",  # R2 uses "auto" as region
            config=self._client_timeout,
        )

    async def upload_file(
        self, file_obj: BinaryIO, bucket_name: str, object_name: str, content_type: Optional[str] = None
    ) -> str:
        """Upload file to Cloudflare R2"""
        try:
            # Use the configured bucket name, ignore the parameter for consistency
            bucket = self.bucket_name
            
            # Get file size for logging
            file_obj.seek(0, 2)  # Seek to end
            file_size = file_obj.tell()
            file_obj.seek(0)  # Reset to beginning
            
            logger.debug(f"Uploading file to R2 - object_name: {object_name}, size: {file_size} bytes, bucket: {bucket}, content_type: {content_type}")
            
            extra_args = {}
            if content_type:
                extra_args["ContentType"] = content_type
            
            self.r2_client.upload_fileobj(
                file_obj,
                bucket,
                object_name,
                ExtraArgs=extra_args,
            )
            
            # Return public URL or presigned URL
            if self.public_url:
                # Custom domain or public URL configured
                # Remove trailing slash and ensure object_name doesn't start with /
                base_url = self.public_url.rstrip("/")
                object_path = object_name.lstrip("/")
                file_url = f"{base_url}/{object_path}"
            else:
                # Generate presigned URL for private buckets
                # Presigned URLs are valid for 7 days (604800 seconds)
                # This ensures images are accessible even if bucket is not public
                try:
                    file_url = self.r2_client.generate_presigned_url(
                        "get_object",
                        Params={"Bucket": bucket, "Key": object_name},
                        ExpiresIn=604800,  # 7 days
                    )
                    logger.debug(f"Generated presigned URL for R2 object: {object_name}")
                except Exception as e:
                    logger.warning(f"Failed to generate presigned URL, falling back to direct URL: {str(e)}")
                    # Fallback to direct URL (will only work if bucket is public)
                    file_url = f"{self.endpoint_url}/{bucket}/{object_name}"
            
            logger.info(f"Successfully uploaded file to R2: {file_url} (size: {file_size} bytes)")
            return file_url
        except ClientError as e:
            logger.exception(f"Failed to upload file to R2 - object_name: {object_name}, bucket: {bucket}, error: {str(e)}")
            raise Exception(f"Failed to upload file: {str(e)}")
        except Exception as e:
            logger.exception(f"Unexpected error during R2 upload - object_name: {object_name}, bucket: {bucket}, error: {str(e)}")
            raise

    async def delete_file(self, bucket_name: str, object_name: str) -> bool:
        """Delete file from R2"""
        try:
            bucket = self.bucket_name
            self.r2_client.delete_object(Bucket=bucket, Key=object_name)
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete file: {str(e)}")

    async def get_presigned_url(
        self, bucket_name: str, object_name: str, expiration: int = 3600
    ) -> str:
        """Generate presigned URL for R2"""
        try:
            bucket = self.bucket_name
            url = self.r2_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket, "Key": object_name},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    async def file_exists(self, bucket_name: str, object_name: str) -> bool:
        """Check if file exists in R2"""
        try:
            bucket = self.bucket_name
            self.r2_client.head_object(Bucket=bucket, Key=object_name)
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

            if storage_type == "r2":
                cls._instance = R2Storage()
            elif storage_type == "local":
                cls._instance = LocalStorage()
            else:
                raise ValueError(f"Unsupported storage type: {storage_type}. Use 'r2' or 'local'")

        return cls._instance

    @classmethod
    def reset(cls):
        """Reset storage instance (useful for testing)"""
        cls._instance = None


# Convenience function
def get_storage() -> StorageInterface:
    """Get storage service instance"""
    return StorageService.get_storage()
