from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_blog import GetBlogRequest, GetBlogResponse


class GetBlog(GetResource):
    request_schema = GetBlogRequest
    response_schema = GetBlogResponse
    authentication_required = False

    api_name = "get_blog"
    api_url = "get_blog"

    async def get_blog(self):
        if self.request_data.blog_id:
            self.blog = await crud.blog.get(self.db, id=self.request_data.blog_id)
        elif self.request_data.slug:
            self.blog = await crud.blog.get_by_slug(self.db, slug=self.request_data.slug)
        else:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Either blog_id or slug must be provided"
            self.response_data = {}
            return

        if not self.blog:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Blog not found"
            self.response_data = {}

    async def increment_view_count(self):
        if self.blog and self.blog.status == "published":
            self.blog.view_count = (self.blog.view_count or 0) + 1
            await self.db.commit()

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Blog fetched successfully"
        self.response_data = self.blog.to_dict()

    async def process_flow(self):
        await self.get_blog()
        if self.early_response:
            return
        await self.increment_view_count()
        await self.generate_response()


