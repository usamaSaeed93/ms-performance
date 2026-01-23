from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.setting import Setting

async def get_setting(db: AsyncSession, key: str) -> Optional[Setting]:
    stmt = select(Setting).filter(Setting.key == key)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def set_setting(db: AsyncSession, key: str, value: str, description: str = None, type: str = "string") -> Setting:
    setting = await get_setting(db, key)
    if setting:
        setting.value = value
        if description:
            setting.description = description
        if type:
            setting.type = type
    else:
        setting = Setting(key=key, value=value, description=description, type=type)
        db.add(setting)
    
    await db.commit()
    await db.refresh(setting)
    return setting

async def get_all_settings(db: AsyncSession) -> List[Setting]:
    stmt = select(Setting)
    result = await db.execute(stmt)
    return result.scalars().all()
