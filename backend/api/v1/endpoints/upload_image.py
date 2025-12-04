from fastapi import status, UploadFile, File, Form
from typing import Optional
from starlette.requests import Request
import os
import re
import uuid
import logging
from datetime import datetime
from io import BytesIO
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

import crud
from api.base_resource import BaseResource
from core.storage import get_storage
from db.dependency import get_db
from instance.config import config
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from ..schemas.upload_image import UploadImageResponse

logger = logging.getLogger("app")


class UploadImage(BaseResource):
    """
    Upload image endpoint
    Supports product images, category images, etc.
    """
    response_schema = UploadImageResponse
    authentication_required = True

    api_name = "upload_image"
    api_url = "upload_image"

    async def post(
        self, 
        request: Request, 
        file: UploadFile = File(...),
        folder: str = Form(default="products"),
        db: AsyncSession = Depends(get_db)
    ):
        """Handle file upload"""
        try:
            logger.info(f"Upload endpoint called - received request for upload_image")
            self.db = db
            self.request = request

            # Validate file exists and has a filename
            if not file:
                error_msg = "No file provided in request"
                logger.warning(error_msg)
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        "success": False,
                        "message": "No file provided in request",
                        "data": {},
                    }
                )
            
            if not file.filename:
                error_msg = "No file provided or filename missing"
                logger.warning(error_msg)
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        "success": False,
                        "message": "No file provided or filename missing",
                        "data": {},
                    }
                )

            logger.info(f"Image upload request - filename: {file.filename}, folder: {folder}, content_type: {file.content_type}")
        
            # Validate file type
            allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
            if file.content_type not in allowed_types:
                error_msg = f"Invalid file type rejected - filename: {file.filename}, content_type: {file.content_type}, allowed: {allowed_types}"
                logger.warning(error_msg)
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        "success": False,
                        "message": f"Invalid file type. Allowed types: {', '.join(allowed_types)}",
                        "data": {},
                    }
                )

            # Validate file size (max 10MB)
            file_content = await file.read()
            file_size = len(file_content)
            logger.debug(f"File size: {file_size} bytes ({file_size / 1024 / 1024:.2f} MB)")
            if file_size > 10 * 1024 * 1024:
                error_msg = f"File size exceeded limit - filename: {file.filename}, size: {file_size} bytes"
                logger.warning(error_msg)
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        "success": False,
                        "message": "File size exceeds 10MB limit",
                        "data": {},
                    }
                )

            # Normalize folder name to avoid path traversal and enforce predictable paths
            # Allow alphanumeric, underscore, forward slash, and hyphen (hyphen at end to avoid range interpretation)
            safe_folder = re.sub(r"[^a-zA-Z0-9_/-]", "", folder).strip("/") or "products"

            # Generate unique filename
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
            safe_filename = (
                file.filename.replace(" ", "_")
                .replace("(", "")
                .replace(")", "")
                .replace("..", "")
            )
            unique_suffix = uuid.uuid4().hex[:8]
            object_name = f"{safe_folder}/{timestamp}_{unique_suffix}_{safe_filename}"

            # Get bucket name from config
            bucket_name = config.STORAGE_BUCKET_NAME

            # Upload to storage
            storage = get_storage()
            file_obj = BytesIO(file_content)

            # Determine content type
            content_type = file.content_type or f"image/{file_extension}"

            # Upload file
            file_url = await storage.upload_file(
                file_obj=file_obj,
                bucket_name=bucket_name,
                object_name=object_name,
                content_type=content_type,
            )

            response_data = {
                "url": file_url,
                "filename": file.filename,
                "size": len(file_content),
                "content_type": content_type,
                "object_name": object_name,
            }

            logger.info(f"Image uploaded successfully - filename: {file.filename}, url: {file_url}, size: {len(file_content)} bytes")
            
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "message": "Image uploaded successfully",
                    "data": response_data,
                }
            )

        except Exception as e:
            import traceback
            filename = file.filename if file and hasattr(file, 'filename') else 'unknown'
            folder_val = folder if 'folder' in locals() else 'unknown'
            error_msg = f"Exception occurred in upload_image - filename: {filename}, folder: {folder_val}, error: {str(e)}"
            logger.exception(error_msg)
            logger.error(f"Full traceback:\n{''.join(traceback.format_exc())}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": False,
                    "message": f"Failed to upload image: {str(e)}",
                    "data": {"error": str(e)},
                }
            )
