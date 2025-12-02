from pydantic import BaseModel, Field
from typing import Optional


class UploadImageRequest(BaseModel):
    folder: str = Field(default="products", description="Folder to upload image to (products, categories, etc.)")


class UploadImageResponse(BaseModel):
    url: str
    filename: str
    size: int
    content_type: str

