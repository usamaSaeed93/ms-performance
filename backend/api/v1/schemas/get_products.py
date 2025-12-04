from pydantic import BaseModel

from common.schemas import PaginatedRequest
from crud.schemas import Product


class GetProductsRequest(PaginatedRequest):
    category_ids: list[int] = []


class ProductWithCategory(BaseModel):
    id: int
    product_name: str
    slug: str | None
    description: str | None
    category_id: int
    quantity: int
    price: str
    sale_price: str | None
    sale_start_date: str | None
    sale_end_date: str | None
    sku: str | None
    image_url: str | None
    weight: str | None
    is_active: int
    is_featured: bool
    created_at: str
    updated_at: str
    category_name: str
    category_slug: str


class GetProductsResponse(BaseModel):
    products: list[ProductWithCategory]
