from pydantic import BaseModel, field_validator

from common.schemas import PaginatedRequest
from crud.schemas import Product


class GetProductsRequest(PaginatedRequest):
    category_ids: list[int] = []
    search: str | None = None
    
    @field_validator('category_ids', mode='before')
    @classmethod
    def convert_category_ids_to_list(cls, v):
        if v is None:
            return []
        if isinstance(v, int):
            return [v]
        if isinstance(v, str):
            try:
                return [int(v)]
            except ValueError:
                return []
        if isinstance(v, list):
            return [int(x) if isinstance(x, str) else x for x in v]
        return []


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
    average_rating: str | None
    review_count: int
    created_at: str
    updated_at: str
    category_name: str
    category_slug: str


class GetProductsResponse(BaseModel):
    products: list[ProductWithCategory]
    total: int | None = None
    page: int | None = None
    per_page: int | None = None
    total_pages: int | None = None
