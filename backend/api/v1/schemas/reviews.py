from typing import List, Optional
from pydantic import BaseModel


class ReviewSchema(BaseModel):
    id: int
    author_name: str
    rating: int
    text: Optional[str] = None
    profile_photo_url: Optional[str] = None
    relative_time: Optional[str] = None
    display_order: int
    is_active: bool

    class Config:
        from_attributes = True


class GetReviewsResponse(BaseModel):
    reviews: List[ReviewSchema]
    total: int


class CreateReviewRequest(BaseModel):
    author_name: str
    rating: int = 5
    text: Optional[str] = None
    profile_photo_url: Optional[str] = None
    relative_time: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class CreateReviewResponse(BaseModel):
    review: ReviewSchema


class UpdateReviewRequest(BaseModel):
    id: int
    author_name: Optional[str] = None
    rating: Optional[int] = None
    text: Optional[str] = None
    profile_photo_url: Optional[str] = None
    relative_time: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class UpdateReviewResponse(BaseModel):
    review: ReviewSchema


class DeleteReviewRequest(BaseModel):
    id: int


class DeleteReviewResponse(BaseModel):
    success: bool
