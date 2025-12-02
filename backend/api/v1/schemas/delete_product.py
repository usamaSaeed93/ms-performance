from pydantic import BaseModel, Field


class DeleteProductRequest(BaseModel):
    product_id: int = Field(..., gt=0)


class DeleteProductResponse(BaseModel):
    pass

