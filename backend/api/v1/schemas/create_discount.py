from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime

from crud.schemas.discount import Discount


class CreateDiscountRequest(BaseModel):
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


class CreateDiscountResponse(Discount):
    pass

