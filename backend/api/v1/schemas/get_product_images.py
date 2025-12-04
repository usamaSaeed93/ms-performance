from pydantic import BaseModel, Field
from typing import List, Optional


class ProductImageResponse(BaseModel):
    id: int
    product_id: int
    image_url: str
    alt_text: Optional[str]
    sort_order: int
    is_primary: bool


class GetProductImagesRequest(BaseModel):
    product_id: int = Field(..., gt=0)


class GetProductImagesResponse(BaseModel):
    images: List[ProductImageResponse]

