from fastapi import status
from sqlalchemy import select, func

import crud
from models.blog import Blog
from api.base_resource import GetResource
from ..schemas.get_published_blogs import GetPublishedBlogsRequest, GetPublishedBlogsResponse


class GetPublishedBlogs(GetResource):
    request_schema = GetPublishedBlogsRequest
    response_schema = GetPublishedBlogsResponse
    authentication_required = False

    api_name = "get_published_blogs"
    api_url = "get_published_blogs"

    async def get_published_blogs(self):
        order_by = self.request_data.order_by if hasattr(self.request_data, 'order_by') else "published_at"
        order = self.request_data.order if hasattr(self.request_data, 'order') else "desc"
        
        order_by_column = getattr(Blog, order_by, None)
        if not order_by_column:
            order_by_column = Blog.published_at

        stmt = (
            select(Blog)
            .filter(Blog.status == "published")
            .filter(Blog.published_at.isnot(None))
        )

        if order == "desc":
            stmt = stmt.order_by(order_by_column.desc())
        else:
            stmt = stmt.order_by(order_by_column.asc())

        stmt = (
            stmt.offset((self.request_data.page - 1) * self.request_data.per_page)
            .limit(self.request_data.per_page)
        )

        count_stmt = (
            select(func.count())
            .select_from(Blog)
            .filter(Blog.status == "published")
            .filter(Blog.published_at.isnot(None))
        )

        result = await self.db.execute(stmt)
        blogs = result.scalars().all()

        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar()

        self.blogs = blogs
        self.total = total

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Published blogs fetched successfully"
        
        blogs_list = []
        for blog in self.blogs:
            blogs_list.append({
                "id": blog.id,
                "title": blog.title,
                "slug": blog.slug,
                "excerpt": blog.excerpt,
                "featured_image": blog.featured_image,
                "author_name": blog.author_name,
                "published_at": blog.published_at.isoformat() if blog.published_at else None,
                "view_count": blog.view_count or 0,
                "created_at": blog.created_at.isoformat() if hasattr(blog.created_at, 'isoformat') else str(blog.created_at),
            })
        
        total_pages = (self.total + self.request_data.per_page - 1) // self.request_data.per_page if self.total else 0
        
        self.response_data = {
            "blogs": blogs_list,
            "total": self.total,
            "page": self.request_data.page,
            "per_page": self.request_data.per_page,
            "total_pages": total_pages,
        }

    async def process_flow(self):
        await self.get_published_blogs()
        await self.generate_response()

