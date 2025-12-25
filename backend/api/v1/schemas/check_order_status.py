from pydantic import BaseModel, Field


class CheckOrderStatusRequest(BaseModel):
    payment_intent_id: str = Field(..., description="Stripe Payment Intent ID")


class CheckOrderStatusResponse(BaseModel):
    order_exists: bool
    order_id: int | None = None
    order_number: str | None = None

