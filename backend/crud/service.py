from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.service import Service

async def get_services(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Service]:
    stmt = select(Service).order_by(Service.display_order.asc(), Service.id.asc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_service(db: AsyncSession, service_id: int) -> Optional[Service]:
    stmt = select(Service).filter(Service.id == service_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def get_service_by_title(db: AsyncSession, title: str) -> Optional[Service]:
    stmt = select(Service).filter(Service.title == title)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def update_service(
    db: AsyncSession,
    service_id: int,
    image_url: str = None,
    link: str = None,
    description: str = None,
    title: str = None,
    icon: str = None,
    page_content: dict = None,
) -> Optional[Service]:
    service = await get_service(db, service_id)
    if not service:
        return None
    
    if image_url is not None:
        service.image_url = image_url
    if link is not None:
        service.link = link
    if description is not None:
        service.description = description
    if title is not None:
        service.title = title
    if icon is not None:
        service.icon = icon
    if page_content is not None:
        service.page_content = page_content
        
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service

async def create_service(db: AsyncSession, title: str, description: str, icon: str, link: str, image_url: str = None, display_order: int = 0) -> Service:
    db_service = Service(
        title=title,
        description=description,
        icon=icon,
        link=link,
        image_url=image_url,
        display_order=display_order
    )
    db.add(db_service)
    await db.commit()
    await db.refresh(db_service)
    return db_service
