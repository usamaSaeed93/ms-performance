from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.mailing_subscription import MailingSubscription
from crud.schemas.mailing_subscription import MailingSubscriptionCreate, MailingSubscriptionUpdate


class CRUDMailingSubscription(CRUDBase[MailingSubscription, MailingSubscriptionCreate, MailingSubscriptionUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str):
        stmt = select(MailingSubscription).where(
            func.lower(MailingSubscription.email) == email.lower()
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_active(self, db: AsyncSession):
        stmt = select(MailingSubscription).where(MailingSubscription.is_active == True)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_active_count(self, db: AsyncSession) -> int:
        stmt = select(func.count()).select_from(MailingSubscription).where(MailingSubscription.is_active == True)
        result = await db.execute(stmt)
        return int(result.scalar_one())


mailing_subscription = CRUDMailingSubscription(MailingSubscription)
