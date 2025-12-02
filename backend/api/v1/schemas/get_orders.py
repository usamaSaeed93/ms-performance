from pydantic import BaseModel
from common.schemas import PaginatedRequest


class GetOrdersRequest(PaginatedRequest):
    pass


class OrderResponse(BaseModel):
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


class GetOrdersResponse(BaseModel):
    orders: list[OrderResponse]

