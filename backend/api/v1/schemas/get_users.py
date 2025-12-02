from pydantic import BaseModel, Field
from common.schemas import PaginatedRequest


class GetUsersRequest(PaginatedRequest):
    pass


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    is_active: int
    role: str
    created_at: str
    last_login: str | None = None


class GetUsersResponse(BaseModel):
    users: list[UserResponse]

