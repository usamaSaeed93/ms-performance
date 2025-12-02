from pydantic import BaseModel, Field
from typing import Optional

from common.types import TzDateTime


class ProductImageBase(BaseModel):
    product_id: int = Field(..., gt=0)
    image_url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    sort_order: int = Field(default=0, ge=0)
    is_primary: bool = Field(default=False)


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageUpdate(BaseModel):
    image_url: Optional[str] = Field(None, max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    sort_order: Optional[int] = Field(None, ge=0)
    is_primary: Optional[bool] = None


class ProductImageInDB(ProductImageBase):
    id: int
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class ProductImage(ProductImageInDB):
    pass

