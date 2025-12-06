from typing import Optional, Iterable
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal

from crud.base import CRUDBase
from models.product_review import ProductReview
from models.product import Product
from crud.schemas import ProductReviewCreate, ProductReviewUpdate


class CRUDProductReview(CRUDBase[ProductReview, ProductReviewCreate, ProductReviewUpdate]):
    
    async def get_by_product(
        self, 
        db: AsyncSession, 
        *, 
        product_id: int,
        approved_only: bool = True,
        page: int = 1,
        per_page: int = 10
    ) -> Iterable[ProductReview]:
        """Get reviews for a product with pagination"""
        stmt = select(self.model).filter(self.model.product_id == product_id)
        
        if approved_only:
            stmt = stmt.filter(self.model.is_approved == True)
        
        stmt = stmt.order_by(self.model.created_at.desc())
        stmt = stmt.offset((page - 1) * per_page).limit(per_page)
        
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_count_by_product(
        self,
        db: AsyncSession,
        *,
        product_id: int,
        approved_only: bool = True
    ) -> int:
        """Get total count of reviews for a product"""
        stmt = select(func.count(self.model.id)).filter(self.model.product_id == product_id)
        
        if approved_only:
            stmt = stmt.filter(self.model.is_approved == True)
        
        result = await db.execute(stmt)
        return result.scalar() or 0
    
    async def get_average_rating(
        self,
        db: AsyncSession,
        *,
        product_id: int,
        approved_only: bool = True
    ) -> Decimal:
        """Calculate average rating for a product"""
        stmt = select(func.avg(self.model.rating)).filter(self.model.product_id == product_id)
        
        if approved_only:
            stmt = stmt.filter(self.model.is_approved == True)
        
        result = await db.execute(stmt)
        avg_rating = result.scalar()
        return Decimal(str(avg_rating)) if avg_rating else Decimal("0.00")
    
    async def update_product_review_stats(
        self,
        db: AsyncSession,
        *,
        product_id: int
    ) -> None:
        """Update product's average_rating and review_count"""
        # Get approved reviews only
        review_count = await self.get_count_by_product(db, product_id=product_id, approved_only=True)
        average_rating = await self.get_average_rating(db, product_id=product_id, approved_only=True)
        
        # Update product
        product = await db.get(Product, product_id)
        if product:
            product.review_count = review_count
            product.average_rating = average_rating
            await db.commit()
            await db.refresh(product)
    
    async def create(
        self, 
        db: AsyncSession, 
        *, 
        obj_in: ProductReviewCreate
    ) -> ProductReview:
        """Create a review and update product stats if approved"""
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Update product stats if review is approved
        # Note: Reviews are auto-approved for authenticated users, otherwise require admin approval
        if db_obj.is_approved:
            await self.update_product_review_stats(db, product_id=obj_in.product_id)
        
        return db_obj
    
    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ProductReview,
        obj_in: ProductReviewUpdate
    ) -> ProductReview:
        """Update a review and recalculate product stats"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Check if approval status changed
        approval_changed = 'is_approved' in update_data and update_data['is_approved'] != db_obj.is_approved
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        await db.commit()
        await db.refresh(db_obj)
        
        # Update product stats if approval status changed or rating changed
        if approval_changed or 'rating' in update_data:
            await self.update_product_review_stats(db, product_id=db_obj.product_id)
        
        return db_obj
    
    async def delete(
        self,
        db: AsyncSession,
        *,
        id: int
    ) -> Optional[ProductReview]:
        """Delete a review and update product stats"""
        db_obj = await self.get(db, id=id)
        if db_obj:
            product_id = db_obj.product_id
            await db.delete(db_obj)
            await db.commit()
            
            # Update product stats
            await self.update_product_review_stats(db, product_id=product_id)
        
        return db_obj


product_review = CRUDProductReview(ProductReview)

