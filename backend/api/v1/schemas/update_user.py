from pydantic import BaseModel, Field
from typing import Optional


class UpdateUserRequest(BaseModel):
    user_id: int = Field(..., gt=0)
    first_name: Optional[str] = Field(None, max_length=50, min_length=2)
    last_name: Optional[str] = Field(None, max_length=50, min_length=2)
    email: Optional[str] = Field(None, max_length=50)
    is_active: Optional[int] = None
    role: Optional[str] = Field(None, pattern="^(customer|admin)$")


class UpdateUserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    is_active: int
    role: str
    created_at: str
    updated_at: str
    last_login: str | None

