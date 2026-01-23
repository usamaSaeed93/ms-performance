from fastapi import status

import crud
from api.base_resource import DeleteResource
from ..schemas.delete_product_review import DeleteProductReviewRequest, DeleteProductReviewResponse


class DeleteProductReview(DeleteResource):
    request_schema = DeleteProductReviewRequest
    response_schema = DeleteProductReviewResponse
    authentication_required = True  # Only authenticated users can delete

    api_name = "delete_product_review"
    api_url = "delete_product_review"

    async def check_if_review_exists(self):
        self.review = await crud.product_review.get(self.db, id=self.request_data.review_id)
        if not self.review:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Review not found"
            self.response_data = {}

    async def delete_review(self):
        await crud.product_review.delete(self.db, id=self.request_data.review_id)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Review deleted successfully"
        self.response_data = {}

    async def process_flow(self):
        await self.check_if_review_exists()
        if self.early_response:
            return

        await self.delete_review()
        await self.generate_response()











