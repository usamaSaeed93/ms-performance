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
    payment_intent_id: str | None = Field(None, max_length=255)  # Stripe Payment Intent ID
    order_status: str | None = Field(None, max_length=20)  # pending, processing, shipped, delivered, cancelled
    payment_status: str | None = Field(None, max_length=20)  # pending, paid, failed, refunded
    payment_method: str | None = Field(None, max_length=50)  # stripe, paypal, etc.
    shipping_address: str | None = Field(None)  # Shipping address
    order_number: str | None = Field(None, max_length=50)  # Order number


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
