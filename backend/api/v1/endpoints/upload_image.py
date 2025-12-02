from fastapi import status, UploadFile, File, Form
from typing import Optional
from starlette.requests import Request

import crud
from api.base_resource import BaseResource
from core.storage import get_storage
from ..schemas.upload_image import UploadImageResponse
from db.dependency import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
import os
from datetime import datetime
from io import BytesIO


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
        self.db = db
        self.request = request
        
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
        if file.content_type not in allowed_types:
            return {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "success": False,
                "message": f"Invalid file type. Allowed types: {', '.join(allowed_types)}",
                "data": {},
            }

        # Validate file size (max 10MB)
        file_content = await file.read()
        if len(file_content) > 10 * 1024 * 1024:
            return {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "success": False,
                "message": "File size exceeds 10MB limit",
                "data": {},
            }

        try:
            # Generate unique filename
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
            safe_filename = file.filename.replace(" ", "_").replace("(", "").replace(")", "")
            object_name = f"{folder}/{timestamp}_{safe_filename}"
            
            # Get bucket name from config
            bucket_name = os.getenv("STORAGE_BUCKET_NAME", "ecommerce-images")
            
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
            }
            
            return {
                "status_code": status.HTTP_200_OK,
                "success": True,
                "message": "Image uploaded successfully",
                "data": response_data,
            }
            
        except Exception as e:
            return {
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "success": False,
                "message": f"Failed to upload image: {str(e)}",
                "data": {},
            }

