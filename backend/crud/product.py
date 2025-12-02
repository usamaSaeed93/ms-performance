from typing import Iterable, Optional

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.product import Product
from models.category import Category
from crud.schemas import ProductCreate, ProductUpdate


class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    async def get_products_quantity_le(
        self, db: AsyncSession, *, quantity: int
    ) -> Iterable[Product]:
        stmt = select(self.model).filter(self.model.quantity <= quantity)
        results = await db.execute(stmt)
        return results.scalars().all()

    async def get_active(self, db: AsyncSession, *, id: int) -> Optional[Product]:
        stmt = select(self.model).filter(
            self.model.id == id, self.model.is_active == 1
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_multi_with_category(
        self,
        db: AsyncSession,
        category_ids: list[int],
        page: int,
        per_page: int,
        order_by: str,
        order: str,
    ) -> Iterable:
        if not getattr(self.model, order_by, None):
            order_by = "id"
        stmt = select(
            self.model.id,
            self.model.product_name,
            self.model.description,
            self.model.category_id,
            self.model.quantity,
            self.model.price,
            self.model.sku,
            self.model.image_url,
            self.model.weight,
            self.model.is_active,
            self.model.created_at,
            self.model.updated_at,
            Category.category_name,
            Category.category_slug,
        ).join(Category, self.model.category_id == Category.id)
        if category_ids:
            stmt = stmt.filter(self.model.category_id.in_(category_ids))
        stmt = (
            stmt.order_by(text(f"product.{order_by} {order}"))
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        result = await db.execute(stmt)
        return result.all()


product = CRUDProduct(Product)
