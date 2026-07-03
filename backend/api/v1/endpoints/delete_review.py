from fastapi import status
from api.base_resource import PostResource
from crud import review as crud_review
from ..schemas.reviews import DeleteReviewRequest, DeleteReviewResponse


class DeleteReview(PostResource):
    request_schema = DeleteReviewRequest
    response_schema = DeleteReviewResponse
    authentication_required = True

    api_name = "delete_review"
    api_url = "delete_review"

    async def check_and_delete(self):
        deleted = await crud_review.delete_review(self.db, review_id=self.request_data.id)
        if not deleted:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Review not found"
            self.response_data = {"success": False}

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Review deleted successfully"
        self.response_data = {"success": True}

    async def process_flow(self):
        await self.check_and_delete()
        if self.early_response:
            return
        await self.generate_response()
