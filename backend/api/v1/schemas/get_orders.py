from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from common.schemas import PaginatedRequest


class GetOrdersRequest(PaginatedRequest):
    order_status: Optional[str] = None  # pending, processing, shipped, delivered, cancelled
    payment_status: Optional[str] = None  # pending, paid, failed, refunded
    payment_method: Optional[str] = None  # stripe, paypal, etc.
    start_date: Optional[str] = None  # ISO format date string
    end_date: Optional[str] = None  # ISO format date string
    search: Optional[str] = None  # Search by order number or payment intent ID
    user_id: Optional[int] = None  # Filter by user (admin only)


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
    total: int | None = None
    page: int | None = None
    per_page: int | None = None
    total_pages: int | None = None

