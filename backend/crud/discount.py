from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from crud.base import CRUDBase
from models.discount import Discount
from crud.schemas.discount import DiscountCreate, DiscountUpdate


class CRUDDiscount(CRUDBase[Discount, DiscountCreate, DiscountUpdate]):
    async def get_by_code(self, db: AsyncSession, *, code: str) -> Optional[Discount]:
        """Get a discount by code."""
        async with db as session:
            stmt = select(self.model).filter(self.model.code == code.upper())
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def get_active_discounts(
        self, db: AsyncSession, *, product_id: Optional[int] = None, category_id: Optional[int] = None
    ) -> list[Discount]:
        """Get active discounts for a product or category."""
        async with db as session:
            stmt = select(self.model).filter(
                self.model.is_active == True,
                self.model.valid_from <= datetime.utcnow(),
            )
            
            if self.model.valid_until:
                stmt = stmt.filter(
                    (self.model.valid_until.is_(None)) | (self.model.valid_until >= datetime.utcnow())
                )
            
            if product_id:
                stmt = stmt.filter(
                    (self.model.product_id == product_id) | (self.model.product_id.is_(None))
                )
            
            if category_id:
                stmt = stmt.filter(
                    (self.model.category_id == category_id) | (self.model.category_id.is_(None))
                )
            
            result = await session.execute(stmt)
            return list(result.scalars().all())

    async def validate_discount(
        self, db: AsyncSession, *, code: str, user_id: Optional[int] = None, order_amount: float = 0
    ) -> Optional[Discount]:
        """Validate if a discount code can be used."""
        discount = await self.get_by_code(db, code=code)
        
        if not discount:
            return None
        
        if not discount.is_active:
            return None
        
        # Check validity period
        now = datetime.utcnow()
        if discount.valid_from > now:
            return None
        
        if discount.valid_until and discount.valid_until < now:
            return None
        
        # Check usage limits
        if discount.usage_limit and discount.usage_count >= discount.usage_limit:
            return None
        
        # Check minimum order amount
        if discount.minimum_order_amount and order_amount < float(discount.minimum_order_amount):
            return None
        
        return discount

    async def apply_discount(self, db: AsyncSession, *, discount: Discount) -> Discount:
        """Increment usage count when discount is applied."""
        async with db as session:
            discount.usage_count += 1
            session.add(discount)
            await session.commit()
            await session.refresh(discount)
            return discount


discount = CRUDDiscount(Discount)

