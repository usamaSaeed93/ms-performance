import re
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

    async def get_by_slug(self, db: AsyncSession, *, slug: str) -> Optional[Product]:
        stmt = select(self.model).filter(self.model.slug == slug)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def generate_unique_slug(
        self, db: AsyncSession, *, base_slug: str, current_id: Optional[int] = None
    ) -> str:
        """Generate a unique slug based on the provided base slug."""
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
        """Create a URL-friendly slug."""
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", text_value.lower()).strip("-")
        return slug

    async def get_multi_with_category(
        self,
        db: AsyncSession,
        category_ids: list[int],
        page: int,
        per_page: int,
        order_by: str,
        order: str,
        search: str | None = None,
    ) -> tuple[Iterable, int]:
        from sqlalchemy import func
        
        if not getattr(self.model, order_by, None):
            order_by = "id"
        stmt = select(
            self.model.id,
            self.model.product_name,
            self.model.slug,
            self.model.description,
            self.model.category_id,
            self.model.quantity,
            self.model.price,
            self.model.sale_price,
            self.model.sale_start_date,
            self.model.sale_end_date,
            self.model.sku,
            self.model.image_url,
            self.model.weight,
            self.model.is_active,
            self.model.is_featured,
            self.model.average_rating,
            self.model.review_count,
            self.model.created_at,
            self.model.updated_at,
            Category.category_name,
            Category.category_slug,
        ).join(Category, self.model.category_id == Category.id)
        
        if category_ids:
            stmt = stmt.filter(self.model.category_id.in_(category_ids))
        
        if search:
            search_filter = self.model.product_name.ilike(f"%{search}%")
            stmt = stmt.filter(search_filter)
        
        # Count total before pagination
        count_stmt = select(func.count()).select_from(self.model).join(Category, self.model.category_id == Category.id)
        if category_ids:
            count_stmt = count_stmt.filter(self.model.category_id.in_(category_ids))
        if search:
            search_filter = self.model.product_name.ilike(f"%{search}%")
            count_stmt = count_stmt.filter(search_filter)
        
        count_result = await db.execute(count_stmt)
        total = count_result.scalar() or 0
        
        stmt = (
            stmt.order_by(text(f"product.{order_by} {order}"))
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        result = await db.execute(stmt)
        return result.all(), total


product = CRUDProduct(Product)
