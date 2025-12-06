from fastapi import status

import crud
from crud.schemas import ProductReviewUpdate
from api.base_resource import PutResource
from ..schemas.update_product_review import (
    UpdateProductReviewRequest,
    UpdateProductReviewResponse,
    ProductReviewResponse,
)


class UpdateProductReview(PutResource):
    request_schema = UpdateProductReviewRequest
    response_schema = UpdateProductReviewResponse
    authentication_required = True  # Only authenticated users can update (admin for approval, users for helpful)

    api_name = "update_product_review"
    api_url = "update_product_review"

    async def check_if_review_exists(self):
        self.review = await crud.product_review.get(self.db, id=self.request_data.review_id)
        if not self.review:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Review not found"
            self.response_data = {}

    async def update_review(self):
        update_data = ProductReviewUpdate(
            is_approved=self.request_data.is_approved,
            helpful_count=self.request_data.helpful_count,
        )
        
        # Remove None values
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        if update_dict:
            update_data = ProductReviewUpdate(**update_dict)
            self.review = await crud.product_review.update(
                self.db,
                db_obj=self.review,
                obj_in=update_data
            )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Review updated successfully"
        self.response_data = {
            "review": ProductReviewResponse(
                id=self.review.id,
                product_id=self.review.product_id,
                user_id=self.review.user_id,
                reviewer_name=self.review.reviewer_name,
                reviewer_email=self.review.reviewer_email,
                title=self.review.title,
                review_text=self.review.review_text,
                rating=self.review.rating,
                is_approved=self.review.is_approved,
                is_verified_purchase=self.review.is_verified_purchase,
                helpful_count=self.review.helpful_count,
                created_at=self.review.created_at.isoformat() if hasattr(self.review.created_at, 'isoformat') else str(self.review.created_at),
                updated_at=self.review.updated_at.isoformat() if hasattr(self.review.updated_at, 'isoformat') else str(self.review.updated_at),
            )
        }

    async def process_flow(self):
        await self.check_if_review_exists()
        if self.early_response:
            return

        await self.update_review()
        await self.generate_response()

