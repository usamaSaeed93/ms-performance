from pydantic import BaseModel
from common.schemas import PaginatedRequest
from crud.schemas.blog import Blog as BlogSchema


class GetBlogsRequest(PaginatedRequest):
    status: str | None = None


class BlogListItem(BaseModel):
    id: int
    title: str
    slug: str | None
    excerpt: str | None
    featured_image: str | None
    author_name: str | None
    status: str
    published_at: str | None
    view_count: int
    created_at: str
    updated_at: str


class GetBlogsResponse(BaseModel):
    blogs: list[BlogListItem]
    total: int | None = None
    page: int | None = None
    per_page: int | None = None
    total_pages: int | None = None












