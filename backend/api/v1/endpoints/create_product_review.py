from fastapi import status
from starlette_context import context

import crud
from crud.schemas import ProductReviewCreate
from api.base_resource import PutResource
from ..schemas.create_product_review import (
    CreateProductReviewRequest,
    CreateProductReviewResponse,
    ProductReviewResponse,
)


class CreateProductReview(PutResource):
    request_schema = CreateProductReviewRequest
    response_schema = CreateProductReviewResponse
    authentication_required = False  # Allow public reviews

    api_name = "create_product_review"
    api_url = "create_product_review"

    async def check_if_product_exists(self):
        product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}
            return
        
        # Check if reviews are enabled for this product
        if not product.enable_reviews:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Reviews are not enabled for this product"
            self.response_data = {}

    async def get_user_id(self):
        """Get user ID from token if authenticated"""
        user = context.data.get("user")
        if user:
            return user.get("id") if isinstance(user, dict) else getattr(user, "id", None)
        return None

    async def create_review(self):
        user_id = await self.get_user_id()
        user = context.data.get("user")
        is_authenticated = user is not None
        
        review_create = ProductReviewCreate(
            product_id=self.request_data.product_id,
            user_id=user_id,
            reviewer_name=self.request_data.reviewer_name,
            reviewer_email=self.request_data.reviewer_email,
            title=self.request_data.title,
            review_text=self.request_data.review_text,
            rating=self.request_data.rating,
            is_verified_purchase=self.request_data.is_verified_purchase,
        )
        
        # Create review (will be auto-approved if authenticated)
        self.review = await crud.product_review.create(self.db, obj_in=review_create)
        
        # Auto-approve all reviews for now (can be changed to require admin approval later)
        # Auto-approve if user is authenticated, otherwise also auto-approve for easier testing
        if not self.review.is_approved:
            self.review.is_approved = True
            await self.db.commit()
            await self.db.refresh(self.review)
        
        # Update product stats since review is now approved
        await crud.product_review.update_product_review_stats(self.db, product_id=self.request_data.product_id)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        user = context.data.get("user")
        is_authenticated = user is not None
        self.response_message = "Review submitted successfully" + (
            ". It will be published after admin approval." if not is_authenticated and not self.review.is_approved else ""
        )
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
        await self.check_if_product_exists()
        if self.early_response:
            return

        await self.create_review()
        await self.generate_response()

