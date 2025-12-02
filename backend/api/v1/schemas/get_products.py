from pydantic import BaseModel

from common.schemas import PaginatedRequest
from crud.schemas import Product


class GetProductsRequest(PaginatedRequest):
    category_ids: list[int] = []


class ProductWithCategory(BaseModel):
    id: int
    product_name: str
    description: str | None
    category_id: int
    quantity: int
    price: str
    sku: str | None
    image_url: str | None
    weight: str | None
    is_active: int
    created_at: str
    updated_at: str
    category_name: str
    category_slug: str


class GetProductsResponse(BaseModel):
    products: list[ProductWithCategory]
