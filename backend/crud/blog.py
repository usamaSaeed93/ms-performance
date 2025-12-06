import re
from typing import Optional
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.blog import Blog
from crud.schemas.blog import BlogCreate, BlogUpdate


class CRUDBlog(CRUDBase[Blog, BlogCreate, BlogUpdate]):
    async def get_by_slug(self, db: AsyncSession, *, slug: str) -> Optional[Blog]:
        stmt = select(self.model).filter(self.model.slug == slug)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def generate_unique_slug(
        self, db: AsyncSession, *, base_slug: str, current_id: Optional[int] = None
    ) -> str:
        slug = base_slug
        counter = 1
        while True:
            existing = await self.get_by_slug(db, slug=slug)
            if not existing or (current_id and existing.id == current_id):
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1

    @staticmethod
    def slugify(text_value: str) -> str:
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", text_value.lower()).strip("-")
        return slug

    async def get_published(
        self, db: AsyncSession, *, page: int, per_page: int, order_by: str, order: str
    ):
        if not getattr(self.model, order_by, None):
            order_by = "published_at"
        stmt = (
            select(self.model)
            .filter(self.model.status == "published")
            .filter(self.model.published_at.isnot(None))
            .order_by(text(f"{order_by} {order}"))
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        result = await db.execute(stmt)
        return result.scalars().all()


blog = CRUDBlog(Blog)

