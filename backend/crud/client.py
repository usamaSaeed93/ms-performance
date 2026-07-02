from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.client import Client


async def get_clients(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Client]:
    stmt = (
        select(Client)
        .where(Client.is_active == True)
        .order_by(Client.display_order.asc(), Client.id.asc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_all_clients(db: AsyncSession, skip: int = 0, limit: int = 200) -> List[Client]:
    """Used by admin — returns active and inactive clients."""
    stmt = (
        select(Client)
        .order_by(Client.display_order.asc(), Client.id.asc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_client(db: AsyncSession, client_id: int) -> Optional[Client]:
    stmt = select(Client).filter(Client.id == client_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_client(
    db: AsyncSession,
    name: str,
    details: Optional[str] = None,
    image_url: Optional[str] = None,
    display_order: int = 0,
    is_active: bool = True,
) -> Client:
    db_client = Client(
        name=name,
        details=details,
        image_url=image_url,
        display_order=display_order,
        is_active=is_active,
    )
    db.add(db_client)
    await db.commit()
    await db.refresh(db_client)
    return db_client


async def update_client(
    db: AsyncSession,
    client_id: int,
    name: Optional[str] = None,
    details: Optional[str] = None,
    image_url: Optional[str] = None,
    display_order: Optional[int] = None,
    is_active: Optional[bool] = None,
) -> Optional[Client]:
    client = await get_client(db, client_id)
    if not client:
        return None

    if name is not None:
        client.name = name
    if details is not None:
        client.details = details
    if image_url is not None:
        client.image_url = image_url
    if display_order is not None:
        client.display_order = display_order
    if is_active is not None:
        client.is_active = is_active

    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client


async def delete_client(db: AsyncSession, client_id: int) -> bool:
    client = await get_client(db, client_id)
    if not client:
        return False
    await db.delete(client)
    await db.commit()
    return True
