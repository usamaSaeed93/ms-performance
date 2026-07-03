from fastapi import status
from api.base_resource import PutResource
from crud import review as crud_review
from ..schemas.reviews import CreateReviewRequest, CreateReviewResponse


class CreateReview(PutResource):
    request_schema = CreateReviewRequest
    response_schema = CreateReviewResponse
    authentication_required = True

    api_name = "create_review"
    api_url = "reviews"

    async def create_review_record(self):
        self.review = await crud_review.create_review(
            self.db,
            author_name=self.request_data.author_name,
            rating=self.request_data.rating,
            text=self.request_data.text,
            profile_photo_url=self.request_data.profile_photo_url,
            relative_time=self.request_data.relative_time,
            display_order=self.request_data.display_order,
            is_active=self.request_data.is_active,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_201_CREATED
        self.response_data = {
            "review": self.review,
            "message": "Review created successfully",
        }

    async def process_flow(self):
        await self.create_review_record()
        await self.generate_response()
