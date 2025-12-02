from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional

from common.types import TzDateTime


class ProductVariantBase(BaseModel):
    product_id: int = Field(..., gt=0)
    sku: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    sale_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    quantity: int = Field(default=0, ge=0)
    stock_status: str = Field(default="in_stock", pattern="^(in_stock|out_of_stock|on_backorder)$")
    manage_stock: bool = Field(default=True)
    stock_threshold: Optional[int] = Field(None, ge=0)
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    length: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    width: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    height: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    image_url: Optional[str] = Field(None, max_length=500)
    is_active: bool = Field(default=True)


class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantUpdate(BaseModel):
    sku: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    sale_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    quantity: Optional[int] = Field(None, ge=0)
    stock_status: Optional[str] = Field(None, pattern="^(in_stock|out_of_stock|on_backorder)$")
    manage_stock: Optional[bool] = None
    stock_threshold: Optional[int] = Field(None, ge=0)
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    length: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    width: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    height: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    image_url: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None


class ProductVariantInDB(ProductVariantBase):
    id: int
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class ProductVariant(ProductVariantInDB):
    pass

