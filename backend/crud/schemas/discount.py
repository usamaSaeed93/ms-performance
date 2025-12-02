from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime

from common.types import TzDateTime


class DiscountBase(BaseModel):
    code: str = Field(..., max_length=50, min_length=3)
    name: str = Field(..., max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    discount_type: str = Field("percentage", pattern="^(percentage|fixed)$")
    discount_value: Decimal = Field(..., gt=0, decimal_places=2)
    minimum_order_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    maximum_discount_amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    usage_limit: Optional[int] = Field(None, gt=0)
    per_user_limit: Optional[int] = Field(1, gt=0)
    product_id: Optional[int] = Field(None, gt=0)
    category_id: Optional[int] = Field(None, gt=0)
    valid_from: datetime
    valid_until: Optional[datetime] = None
    is_active: bool = True


class DiscountCreate(DiscountBase):
    pass


class DiscountUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    discount_type: Optional[str] = Field(None, pattern="^(percentage|fixed)$")
    discount_value: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    minimum_order_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    maximum_discount_amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    usage_limit: Optional[int] = Field(None, gt=0)
    per_user_limit: Optional[int] = Field(None, gt=0)
    product_id: Optional[int] = Field(None, gt=0)
    category_id: Optional[int] = Field(None, gt=0)
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: Optional[bool] = None


class DiscountInDB(DiscountBase):
    id: int
    usage_count: int
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class Discount(DiscountInDB):
    pass

