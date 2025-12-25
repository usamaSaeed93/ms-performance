from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.webhook_event import WebhookEvent


class CRUDWebhookEvent(CRUDBase[WebhookEvent, dict, dict]):
    async def get_by_event_id(
        self, db: AsyncSession, *, event_id: str
    ) -> Optional[WebhookEvent]:
        """Get webhook event by Stripe event ID."""
        stmt = select(self.model).filter(self.model.event_id == event_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def mark_as_processed(
        self, db: AsyncSession, *, event_id: str, error_message: Optional[str] = None
    ) -> WebhookEvent:
        """Mark webhook event as processed."""
        event = await self.get_by_event_id(db, event_id=event_id)
        if event:
            event.processed = True if not error_message else False
            event.error_message = error_message
            from datetime import datetime
            event.processed_at = datetime.utcnow()
            db.add(event)
            await db.commit()
            await db.refresh(event)
        return event


webhook_event = CRUDWebhookEvent(WebhookEvent)

