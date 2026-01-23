from fastapi import status
import math

import crud
from api.base_resource import GetResource
from ..schemas.get_product_reviews import GetProductReviewsRequest, GetProductReviewsResponse, ProductReviewResponse


class GetProductReviews(GetResource):
    request_schema = GetProductReviewsRequest
    response_schema = GetProductReviewsResponse
    authentication_required = False

    api_name = "get_product_reviews"
    api_url = "get_product_reviews"

    async def check_if_product_exists(self):
        product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}

    async def get_reviews(self):
        self.reviews = await crud.product_review.get_by_product(
            self.db,
            product_id=self.request_data.product_id,
            approved_only=self.request_data.approved_only,
            page=self.request_data.page,
            per_page=self.request_data.per_page
        )
        
        self.total = await crud.product_review.get_count_by_product(
            self.db,
            product_id=self.request_data.product_id,
            approved_only=self.request_data.approved_only
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Product reviews retrieved successfully"
        
        total_pages = math.ceil(self.total / self.request_data.per_page) if self.total > 0 else 0
        
        self.response_data = {
            "reviews": [
                ProductReviewResponse(
                    id=review.id,
                    product_id=review.product_id,
                    user_id=review.user_id,
                    reviewer_name=review.reviewer_name,
                    reviewer_email=review.reviewer_email,
                    title=review.title,
                    review_text=review.review_text,
                    rating=review.rating,
                    is_approved=review.is_approved,
                    is_verified_purchase=review.is_verified_purchase,
                    helpful_count=review.helpful_count,
                    created_at=review.created_at.isoformat() if hasattr(review.created_at, 'isoformat') else str(review.created_at),
                    updated_at=review.updated_at.isoformat() if hasattr(review.updated_at, 'isoformat') else str(review.updated_at),
                )
                for review in self.reviews
            ],
            "total": self.total,
            "page": self.request_data.page,
            "per_page": self.request_data.per_page,
            "total_pages": total_pages,
        }

    async def process_flow(self):
        await self.check_if_product_exists()
        if self.early_response:
            return
        await self.get_reviews()
        await self.generate_response()











