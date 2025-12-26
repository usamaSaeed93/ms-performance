from pydantic import BaseModel, Field
from typing import Optional, Literal
from crud.schemas import Sale, SaleItem


class Item(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class PurchaseProductsRequest(BaseModel):
    items: list[Item]
    shipping_cost: float = Field(default=0.0, ge=0)  # Shipping cost (optional)
    country_code: str = Field(default="GB", max_length=2)  # ISO country code (GB for UK)
    state_code: Optional[str] = Field(default=None)  # State/province code (optional)
    postcode: Optional[str] = Field(default=None)  # Postcode (optional)
    city: Optional[str] = Field(default=None)  # City (optional)
    payment_method: Literal["card", "cod"] = Field(default="card")  # Payment method
    shipping_address: Optional[str] = Field(default=None)  # Full shipping address


class PurchaseProductsResponse(Sale):
    purchased_items: list[SaleItem]
    failed_items: list[Item]

