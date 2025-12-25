from pydantic import BaseModel, Field
from typing import Optional


class UpdateProductReviewRequest(BaseModel):
    review_id: int = Field(..., gt=0)
    is_approved: Optional[bool] = None
    helpful_count: Optional[int] = Field(None, ge=0)


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


class UpdateProductReviewResponse(BaseModel):
    review: ProductReviewResponse










