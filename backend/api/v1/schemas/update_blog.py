from crud.schemas.blog import BlogUpdate, Blog as BlogSchema


class UpdateBlogRequest(BlogUpdate):
    blog_id: int


class UpdateBlogResponse(BlogSchema):
    pass












