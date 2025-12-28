from pydantic import BaseModel, Field
from typing import Optional


class CheckOrderStatusRequest(BaseModel):
    payment_intent_id: Optional[str] = Field(None, description="Stripe Payment Intent ID")
    session_id: Optional[str] = Field(None, description="Stripe Checkout Session ID")


class CheckOrderStatusResponse(BaseModel):
    order_exists: bool
    order_id: int | None = None
    order_number: str | None = None

