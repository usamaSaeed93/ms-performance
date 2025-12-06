from pydantic import BaseModel, Field


class DeleteProductReviewRequest(BaseModel):
    review_id: int = Field(..., gt=0)


class DeleteProductReviewResponse(BaseModel):
    pass

