from datetime import datetime
from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_blog import UpdateBlogRequest, UpdateBlogResponse


class UpdateBlog(PutResource):
    request_schema = UpdateBlogRequest
    response_schema = UpdateBlogResponse
    authentication_required = True

    api_name = "update_blog"
    api_url = "update_blog"

    async def check_if_blog_exists(self):
        self.blog = await crud.blog.get(self.db, id=self.request_data.blog_id)
        if not self.blog:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Blog not found"
            self.response_data = {}

    async def prepare_update_data(self):
        update_data = self.request_data.model_dump(exclude={"blog_id"}, exclude_unset=True)
        
        if "slug" in update_data or "title" in update_data:
            base_slug = crud.blog.slugify(
                update_data.get("slug")
                or update_data.get("title")
                or self.blog.slug
                or self.blog.title
            )
            update_data["slug"] = await crud.blog.generate_unique_slug(
                self.db, base_slug=base_slug, current_id=self.blog.id
            )
        
        # Handle published_at datetime conversion
        if update_data.get("published_at"):
            published_at = update_data["published_at"]
            # If it's a string, parse it to datetime
            if isinstance(published_at, str):
                try:
                    # Remove 'Z' suffix and parse ISO format string
                    iso_string = published_at.replace('Z', '+00:00')
                    # Parse and convert to naive datetime (MySQL compatible)
                    dt = datetime.fromisoformat(iso_string)
                    update_data["published_at"] = dt.replace(tzinfo=None)
                except (ValueError, AttributeError):
                    # If parsing fails, use current time
                    update_data["published_at"] = datetime.utcnow()
            elif isinstance(published_at, datetime):
                # If it's already a datetime, ensure it's naive (no timezone)
                if published_at.tzinfo is not None:
                    update_data["published_at"] = published_at.replace(tzinfo=None)
        elif update_data.get("status") == "published" and not update_data.get("published_at"):
            if not self.blog.published_at:
                update_data["published_at"] = datetime.utcnow()
        
        self.update_data = update_data

    async def update_blog(self):
        self.blog = await crud.blog.update(
            self.db, db_obj=self.blog, obj_in=self.update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Blog updated successfully"
        self.response_data = self.blog.to_dict()

    async def process_flow(self):
        await self.check_if_blog_exists()
        if self.early_response:
            return
        await self.prepare_update_data()
        await self.update_blog()
        await self.generate_response()

