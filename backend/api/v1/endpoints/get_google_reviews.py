from fastapi import status
from api.base_resource import GetResource
from core.google_reviews import get_google_reviews
from ..schemas.google_reviews import GetGoogleReviewsResponse


class GetGoogleReviews(GetResource):
    response_schema = GetGoogleReviewsResponse
    authentication_required = False

    api_name = "get_google_reviews"
    api_url = "google-reviews"

    async def fetch_reviews(self):
        self.reviews = await get_google_reviews()

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "reviews": self.reviews,
            "total": len(self.reviews),
        }

    async def process_flow(self):
        await self.fetch_reviews()
        await self.generate_response()
