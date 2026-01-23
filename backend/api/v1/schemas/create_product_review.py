from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class CreateProductReviewRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    reviewer_name: str = Field(..., max_length=100)
    reviewer_email: Optional[EmailStr] = Field(None, max_length=100)
    title: Optional[str] = Field(None, max_length=255)
    review_text: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    is_verified_purchase: bool = Field(default=False)


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


class CreateProductReviewResponse(BaseModel):
    review: ProductReviewResponse











