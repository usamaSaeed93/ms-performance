from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal


class ItemRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class CreateCheckoutSessionRequest(BaseModel):
    items: List[ItemRequest]
    shipping_cost: Decimal = Field(default=0, ge=0)
    country_code: str = Field(default="GB", max_length=2)
    state_code: Optional[str] = Field(None, max_length=10)
    postcode: Optional[str] = Field(None, max_length=20)
    city: Optional[str] = Field(None, max_length=100)
    shipping_address: Optional[str] = None


class CreateCheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str
