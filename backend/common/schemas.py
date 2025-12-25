from pydantic import BaseModel, Field
from enum import StrEnum


class OrderType(StrEnum):
    asc = "asc"
    desc = "desc"


class PaginatedRequest(BaseModel):
    page: int = Field(1, ge=1)
    per_page: int = Field(10, ge=1, le=100)  # Allow 1-100, default 10
    order_by: str = "id"
    order: OrderType = OrderType.asc
