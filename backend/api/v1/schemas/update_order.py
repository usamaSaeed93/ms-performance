from pydantic import BaseModel, Field
from typing import Optional


class UpdateOrderRequest(BaseModel):
    order_id: int = Field(..., gt=0)
    order_status: Optional[str] = Field(None, pattern="^(pending|processing|shipped|delivered|cancelled)$")
    payment_status: Optional[str] = Field(None, pattern="^(pending|paid|failed|refunded)$")
    payment_method: Optional[str] = None
    shipping_address: Optional[str] = None
    shipping_cost: Optional[float] = None
    tax: Optional[float] = None


class UpdateOrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: str
    order_number: str | None
    order_status: str
    payment_status: str
    payment_method: str | None
    shipping_address: str | None
    shipping_cost: str | None
    tax: str | None
    created_at: str
    updated_at: str

