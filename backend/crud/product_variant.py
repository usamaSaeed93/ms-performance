from typing import Iterable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.product_variant import ProductVariant
from crud.schemas import ProductVariantCreate, ProductVariantUpdate


class CRUDProductVariant(CRUDBase[ProductVariant, ProductVariantCreate, ProductVariantUpdate]):
    async def get_by_product_id(
        self, db: AsyncSession, *, product_id: int, is_active: bool = True
    ) -> Iterable[ProductVariant]:
        """Get all variants for a product"""
        stmt = select(self.model).filter(self.model.product_id == product_id)
        if is_active:
            stmt = stmt.filter(self.model.is_active == True)
        stmt = stmt.order_by(self.model.id)
        results = await db.execute(stmt)
        return results.scalars().all()


product_variant = CRUDProductVariant(ProductVariant)

