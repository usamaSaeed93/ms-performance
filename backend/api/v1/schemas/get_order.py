from pydantic import BaseModel
from decimal import Decimal


class SaleItemResponse(BaseModel):
    id: int
    sale_id: int
    product_id: int
    quantity: int
    price_per_unit: str
    tax_rate: str | None
    tax_amount: str
    line_total: str
    product_name: str | None = None  # Will be populated from join


class OrderDetailResponse(BaseModel):
    id: int
    user_id: int
    subtotal: str
    tax: str
    shipping_cost: str | None
    shipping_tax: str | None
    total_amount: str
    order_number: str | None
    order_status: str
    payment_status: str
    payment_method: str | None
    payment_intent_id: str | None
    shipping_address: str | None
    created_at: str
    updated_at: str
    items: list[SaleItemResponse] = []


class GetOrderResponse(BaseModel):
    order: OrderDetailResponse

