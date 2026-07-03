from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.review import Review


async def get_reviews(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Review]:
    stmt = (
        select(Review)
        .where(Review.is_active == True)
        .order_by(Review.display_order.asc(), Review.id.asc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_all_reviews(db: AsyncSession, skip: int = 0, limit: int = 200) -> List[Review]:
    """Used by admin — returns active and inactive reviews."""
    stmt = (
        select(Review)
        .order_by(Review.display_order.asc(), Review.id.asc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_review(db: AsyncSession, review_id: int) -> Optional[Review]:
    stmt = select(Review).filter(Review.id == review_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_review(
    db: AsyncSession,
    author_name: str,
    rating: int = 5,
    text: Optional[str] = None,
    profile_photo_url: Optional[str] = None,
    relative_time: Optional[str] = None,
    display_order: int = 0,
    is_active: bool = True,
) -> Review:
    db_review = Review(
        author_name=author_name,
        rating=rating,
        text=text,
        profile_photo_url=profile_photo_url,
        relative_time=relative_time,
        display_order=display_order,
        is_active=is_active,
    )
    db.add(db_review)
    await db.commit()
    await db.refresh(db_review)
    return db_review


async def update_review(
    db: AsyncSession,
    review_id: int,
    author_name: Optional[str] = None,
    rating: Optional[int] = None,
    text: Optional[str] = None,
    profile_photo_url: Optional[str] = None,
    relative_time: Optional[str] = None,
    display_order: Optional[int] = None,
    is_active: Optional[bool] = None,
) -> Optional[Review]:
    review = await get_review(db, review_id)
    if not review:
        return None

    if author_name is not None:
        review.author_name = author_name
    if rating is not None:
        review.rating = rating
    if text is not None:
        review.text = text
    if profile_photo_url is not None:
        review.profile_photo_url = profile_photo_url
    if relative_time is not None:
        review.relative_time = relative_time
    if display_order is not None:
        review.display_order = display_order
    if is_active is not None:
        review.is_active = is_active

    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def delete_review(db: AsyncSession, review_id: int) -> bool:
    review = await get_review(db, review_id)
    if not review:
        return False
    await db.delete(review)
    await db.commit()
    return True
