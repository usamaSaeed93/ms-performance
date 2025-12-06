from pydantic import BaseModel, Field
from typing import List, Optional


class ProductReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: Optional[int] = None
    reviewer_name: str
    reviewer_email: Optional[str] = None
    title: Optional[str] = None
    review_text: Optional[str] = None
    rating: int
    is_approved: bool
    is_verified_purchase: bool
    helpful_count: int
    created_at: str
    updated_at: str


class GetProductReviewsRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=10, ge=1, le=100)
    approved_only: bool = Field(default=True)


class GetProductReviewsResponse(BaseModel):
    reviews: List[ProductReviewResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

