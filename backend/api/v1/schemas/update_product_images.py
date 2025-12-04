from pydantic import BaseModel, Field
from typing import List, Optional


class ProductImageItem(BaseModel):
    image_url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    sort_order: int = Field(default=0, ge=0)
    is_primary: bool = Field(default=False)


class UpdateProductImagesRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    images: List[ProductImageItem] = Field(default_factory=list)


class ProductImageResponse(BaseModel):
    id: int
    product_id: int
    image_url: str
    alt_text: Optional[str]
    sort_order: int
    is_primary: bool


class UpdateProductImagesResponse(BaseModel):
    images: List[ProductImageResponse]

