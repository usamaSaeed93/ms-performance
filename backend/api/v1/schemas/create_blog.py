from crud.schemas.blog import BlogCreate, Blog as BlogSchema


class CreateBlogRequest(BlogCreate):
    pass


class CreateBlogResponse(BlogSchema):
    pass












