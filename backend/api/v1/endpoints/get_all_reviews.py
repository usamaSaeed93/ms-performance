from fastapi import status
from api.base_resource import GetResource
from crud import review as crud_review
from ..schemas.reviews import GetReviewsResponse


class GetAllReviews(GetResource):
    """Admin endpoint — returns all reviews including inactive ones."""
    response_schema = GetReviewsResponse
    authentication_required = True

    api_name = "get_all_reviews"
    api_url = "admin/reviews"

    async def get_reviews_list(self):
        self.reviews = await crud_review.get_all_reviews(self.db)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {"reviews": self.reviews, "total": len(self.reviews)}

    async def process_flow(self):
        await self.get_reviews_list()
        await self.generate_response()
