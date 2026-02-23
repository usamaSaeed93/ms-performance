from fastapi import status, UploadFile, File
from starlette.requests import Request
from fastapi.responses import JSONResponse
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime
from io import BytesIO
import uuid
import re
import logging

from api.base_resource import BaseResource
from core.storage import get_storage
from db.dependency import get_db
from instance.config import config

logger = logging.getLogger("app")


class UploadMailingAttachment(BaseResource):
    response_schema = None
    authentication_required = True

    api_name = "upload_mailing_attachment"
    api_url = "mailing-attachments"

    async def post(
        self,
        request: Request,
        file: UploadFile = File(...),
        db: AsyncSession = Depends(get_db)
    ):
        try:
            logger.info("Upload mailing attachment request received")
            self.db = db
            self.request = request

            if not file or not file.filename:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"success": False, "message": "No file provided", "data": {}}
                )

            allowed_types: List[str] = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain",
                "text/csv",
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ]

            if file.content_type not in allowed_types:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        "success": False,
                        "message": f"Invalid file type. Allowed types: {', '.join(allowed_types)}",
                        "data": {},
                    },
                )

            file_content = await file.read()
            file_size = len(file_content)
            if file_size > 15 * 1024 * 1024:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"success": False, "message": "File size exceeds 15MB limit", "data": {}},
                )

            safe_folder = "mailing-attachments"
            safe_filename = re.sub(r"[^a-zA-Z0-9_\.-]", "_", file.filename)
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            unique_suffix = uuid.uuid4().hex[:8]
            object_name = f"{safe_folder}/{timestamp}_{unique_suffix}_{safe_filename}"

            storage = get_storage()
            file_obj = BytesIO(file_content)
            content_type = file.content_type or "application/octet-stream"
            file_url = await storage.upload_file(
                file_obj=file_obj,
                bucket_name=config.STORAGE_BUCKET_NAME,
                object_name=object_name,
                content_type=content_type,
            )

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "message": "Attachment uploaded successfully",
                    "data": {
                        "url": file_url,
                        "filename": file.filename,
                        "size": file_size,
                        "content_type": content_type,
                        "object_name": object_name,
                    },
                },
            )
        except Exception as exc:
            logger.exception(f"Failed to upload mailing attachment: {exc}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"success": False, "message": "Failed to upload attachment", "data": {"error": str(exc)}},
            )
