from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from decimal import Decimal

from common.types import TzDateTime


class ProductReviewBase(BaseModel):
    product_id: int = Field(..., gt=0)
    reviewer_name: str = Field(..., max_length=100)
    reviewer_email: Optional[EmailStr] = Field(None, max_length=100)
    title: Optional[str] = Field(None, max_length=255)
    review_text: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)  # 1-5 stars
    is_verified_purchase: bool = Field(default=False)


class ProductReviewCreate(ProductReviewBase):
    user_id: Optional[int] = Field(None, gt=0)


class ProductReviewUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    review_text: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_approved: Optional[bool] = None
    helpful_count: Optional[int] = Field(None, ge=0)


class ProductReviewInDB(ProductReviewBase):
    id: int
    user_id: Optional[int] = None
    is_approved: bool = Field(default=False)
    helpful_count: int = Field(default=0)
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class ProductReview(ProductReviewInDB):
    pass

