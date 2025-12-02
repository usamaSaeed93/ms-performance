from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional


class UpdateProductRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    product_name: Optional[str] = Field(None, max_length=200, min_length=3)
    description: Optional[str] = None
    category_id: Optional[int] = Field(None, gt=0)
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    sku: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    is_active: Optional[bool] = None


class UpdateProductResponse(BaseModel):
    id: int
    product_name: str
    description: str | None
    category_id: int
    price: str
    quantity: int
    sku: str | None
    image_url: str | None
    weight: str | None
    is_active: int
    created_at: str
    updated_at: str

