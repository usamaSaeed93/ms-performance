from typing import List, Optional
from pydantic import BaseModel


class GoogleReview(BaseModel):
    author_name: str
    profile_photo_url: Optional[str] = ""
    rating: int
    text: Optional[str] = ""
    time: Optional[int] = 0
    relative_time: Optional[str] = ""


class GetGoogleReviewsResponse(BaseModel):
    reviews: List[GoogleReview]
    total: int
