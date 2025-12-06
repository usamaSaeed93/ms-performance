from typing import Optional, Iterable

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.category import Category
from crud.schemas import CategoryCreate, CategoryUpdate


class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    async def get_by_slug(self, db: AsyncSession, *, slug: str) -> Optional[Category]:
        stmt = select(self.model).filter(self.model.category_slug == slug)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_multi(
        self, db: AsyncSession, *, page: int, per_page: int, order_by: str, order: str, search: str | None = None
    ) -> Iterable[Category]:
        if not getattr(self.model, order_by, None):
            order_by = "id"
        stmt = select(self.model)
        
        if search:
            search_filter = self.model.category_name.ilike(f"%{search}%")
            stmt = stmt.filter(search_filter)
        
        stmt = (
            stmt.order_by(text(f"{order_by} {order}"))
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        result = await db.execute(stmt)
        return result.scalars().all()


category = CRUDCategory(Category)
