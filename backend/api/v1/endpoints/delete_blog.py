from fastapi import status

import crud
from api.base_resource import PostResource
from ..schemas.delete_blog import DeleteBlogRequest, DeleteBlogResponse


class DeleteBlog(PostResource):
    request_schema = DeleteBlogRequest
    response_schema = DeleteBlogResponse
    authentication_required = True

    api_name = "delete_blog"
    api_url = "delete_blog"

    async def check_if_blog_exists(self):
        self.blog = await crud.blog.get(self.db, id=self.request_data.blog_id)
        if not self.blog:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Blog not found"
            self.response_data = {}

    async def delete_blog(self):
        await crud.blog.remove(self.db, id=self.request_data.blog_id)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Blog deleted successfully"
        self.response_data = {"success": True}

    async def process_flow(self):
        await self.check_if_blog_exists()
        if self.early_response:
            return
        await self.delete_blog()
        await self.generate_response()












