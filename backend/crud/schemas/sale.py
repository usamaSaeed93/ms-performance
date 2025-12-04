from pydantic import BaseModel, Field
from decimal import Decimal

from common.types import TzDateTime


class SaleBase(BaseModel):
    user_id: int
    subtotal: Decimal = Field(..., decimal_places=2)  # Amount before tax
    tax: Decimal = Field(default=0, decimal_places=2)  # Total tax amount
    shipping_cost: Decimal = Field(default=0, decimal_places=2)
    shipping_tax: Decimal = Field(default=0, decimal_places=2)  # Tax on shipping
    total_amount: Decimal = Field(..., decimal_places=2)  # Total (subtotal + tax + shipping + shipping_tax)


class SaleCreate(SaleBase):
    ...


class SaleUpdate(SaleBase):
    ...


class SaleInDB(SaleBase):
    id: int
    created_at: TzDateTime

    class Config:
        from_attributes = True


class Sale(SaleInDB):
    ...
