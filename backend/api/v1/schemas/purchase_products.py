from pydantic import BaseModel, Field
from crud.schemas import Sale, SaleItem


class Item(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class PurchaseProductsRequest(BaseModel):
    items: list[Item]
    shipping_cost: float = Field(default=0.0, ge=0)  # Shipping cost (optional)
    country_code: str = Field(default="GB", max_length=2)  # ISO country code (GB for UK)
    state_code: str | None = Field(default=None)  # State/province code (optional)
    postcode: str | None = Field(default=None)  # Postcode (optional)
    city: str | None = Field(default=None)  # City (optional)


class PurchaseProductsResponse(Sale):
    purchased_items: list[SaleItem]
    failed_items: list[Item]
