from fastapi import status, HTTPException
from api.base_resource import PutResource
from crud import review as crud_review
from ..schemas.reviews import UpdateReviewRequest, UpdateReviewResponse


class UpdateReview(PutResource):
    request_schema = UpdateReviewRequest
    response_schema = UpdateReviewResponse
    authentication_required = True

    api_name = "update_review"
    api_url = "reviews/{review_id}"

    async def update_review_data(self):
        review_id = self.request.path_params.get("review_id")
        if not review_id:
            raise HTTPException(status_code=400, detail="Review ID is required")

        self.review = await crud_review.update_review(
            self.db,
            review_id=int(review_id),
            author_name=self.request_data.author_name,
            rating=self.request_data.rating,
            text=self.request_data.text,
            profile_photo_url=self.request_data.profile_photo_url,
            relative_time=self.request_data.relative_time,
            display_order=self.request_data.display_order,
            is_active=self.request_data.is_active,
        )
        if not self.review:
            raise HTTPException(status_code=404, detail="Review not found")

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "review": self.review,
            "message": "Review updated successfully",
        }

    async def process_flow(self):
        await self.update_review_data()
        await self.generate_response()
