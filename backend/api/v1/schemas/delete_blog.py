from pydantic import BaseModel


class DeleteBlogRequest(BaseModel):
    blog_id: int


class DeleteBlogResponse(BaseModel):
    success: bool











