from pydantic import BaseModel
from crud.schemas.blog import Blog as BlogSchema


class GetBlogRequest(BaseModel):
    blog_id: int | None = None
    slug: str | None = None


class GetBlogResponse(BlogSchema):
    pass

