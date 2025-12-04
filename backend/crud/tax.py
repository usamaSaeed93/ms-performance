from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.tax import TaxClass, TaxRate
from crud.schemas.tax import TaxClassCreate, TaxClassUpdate, TaxRateCreate, TaxRateUpdate


class CRUDTaxClass(CRUDBase[TaxClass, TaxClassCreate, TaxClassUpdate]):
    async def get_by_slug(self, db: AsyncSession, *, slug: str) -> Optional[TaxClass]:
        stmt = select(self.model).filter(self.model.slug == slug)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_active(self, db: AsyncSession) -> List[TaxClass]:
        stmt = select(self.model).filter(self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalars().all()


class CRUDTaxRate(CRUDBase[TaxRate, TaxRateCreate, TaxRateUpdate]):
    async def get_by_country(
        self, 
        db: AsyncSession, 
        *, 
        country_code: str,
        tax_class_id: Optional[int] = None,
        state_code: Optional[str] = None,
        postcode: Optional[str] = None,
        city: Optional[str] = None
    ) -> List[TaxRate]:
        """
        Get tax rates for a specific country and optionally tax class and location
        """
        stmt = select(self.model).filter(
            self.model.country_code == country_code,
            self.model.is_active == True
        )
        
        if tax_class_id is not None:
            stmt = stmt.filter(self.model.tax_class_id == tax_class_id)
        else:
            # If tax_class_id is None, we want standard rates (tax_class_id IS NULL)
            stmt = stmt.filter(self.model.tax_class_id.is_(None))
        
        if state_code:
            stmt = stmt.filter(self.model.state_code == state_code)
        if postcode:
            stmt = stmt.filter(self.model.postcode == postcode)
        if city:
            stmt = stmt.filter(self.model.city == city)
        
        stmt = stmt.order_by(self.model.priority.desc(), self.model.order.asc())
        
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_active(self, db: AsyncSession) -> List[TaxRate]:
        stmt = select(self.model).filter(self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalars().all()


tax_class = CRUDTaxClass(TaxClass)
tax_rate = CRUDTaxRate(TaxRate)

