from pydantic import BaseModel
from common.schemas import PaginatedRequest


class GetPublishedBlogsRequest(PaginatedRequest):
    pass


class PublishedBlogItem(BaseModel):
    id: int
    title: str
    slug: str | None
    excerpt: str | None
    featured_image: str | None
    author_name: str | None
    published_at: str | None
    view_count: int
    created_at: str


class GetPublishedBlogsResponse(BaseModel):
    blogs: list[PublishedBlogItem]
    total: int | None = None
    page: int | None = None
    per_page: int | None = None
    total_pages: int | None = None












