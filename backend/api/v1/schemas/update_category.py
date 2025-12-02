from pydantic import BaseModel, Field
from typing import Optional


class UpdateCategoryRequest(BaseModel):
    category_id: int = Field(..., gt=0)
    category_name: Optional[str] = Field(None, max_length=100, min_length=3)
    category_slug: Optional[str] = Field(None, max_length=100, min_length=3)
    description: Optional[str] = None
    parent_id: Optional[int] = Field(None, gt=0)


class UpdateCategoryResponse(BaseModel):
    id: int
    category_name: str
    category_slug: str
    description: str | None
    parent_id: int | None
    created_at: str
    updated_at: str

