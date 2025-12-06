from datetime import datetime
from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.create_blog import CreateBlogRequest, CreateBlogResponse


class CreateBlog(PutResource):
    request_schema = CreateBlogRequest
    response_schema = CreateBlogResponse
    authentication_required = True

    api_name = "create_blog"
    api_url = "create_blog"

    async def prepare_payload(self):
        request_payload = self.request_data.model_dump()
        base_slug = crud.blog.slugify(
            request_payload.get("slug") or request_payload.get("title", "")
        )
        request_payload["slug"] = await crud.blog.generate_unique_slug(
            self.db, base_slug=base_slug
        )
        
        # Handle published_at datetime conversion
        if request_payload.get("published_at"):
            published_at = request_payload["published_at"]
            # If it's a string, parse it to datetime
            if isinstance(published_at, str):
                try:
                    # Remove 'Z' suffix and parse ISO format string
                    iso_string = published_at.replace('Z', '+00:00')
                    # Parse and convert to naive datetime (MySQL compatible)
                    dt = datetime.fromisoformat(iso_string)
                    request_payload["published_at"] = dt.replace(tzinfo=None)
                except (ValueError, AttributeError):
                    # If parsing fails, use current time
                    request_payload["published_at"] = datetime.utcnow()
            elif isinstance(published_at, datetime):
                # If it's already a datetime, ensure it's naive (no timezone)
                if published_at.tzinfo is not None:
                    request_payload["published_at"] = published_at.replace(tzinfo=None)
        elif request_payload.get("status") == "published" and not request_payload.get("published_at"):
            request_payload["published_at"] = datetime.utcnow()
        
        self.request_data = CreateBlogRequest(**request_payload)

    async def create_blog(self):
        self.blog = await crud.blog.create(
            self.db, obj_in=self.request_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Blog created successfully"
        self.response_data = self.blog.to_dict()

    async def process_flow(self):
        await self.prepare_payload()
        await self.create_blog()
        await self.generate_response()

