from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from crud.base import CRUDBase
from models.webhook_task import WebhookTask


class CRUDWebhookTask(CRUDBase[WebhookTask, dict, dict]):
    async def get_by_event_id(
        self, db: AsyncSession, *, event_id: str
    ) -> Optional[WebhookTask]:
        """Get webhook task by Stripe event ID."""
        stmt = select(self.model).filter(self.model.event_id == event_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_pending_tasks(
        self, db: AsyncSession, *, limit: int = 10
    ) -> List[WebhookTask]:
        """Get pending tasks that are ready to be processed."""
        now = datetime.utcnow()
        stmt = (
            select(self.model)
            .filter(
                and_(
                    self.model.status == "pending",
                    (self.model.next_retry_at.is_(None)) | (self.model.next_retry_at <= now)
                )
            )
            .order_by(self.model.created_at)
            .limit(limit)
        )
        result = await db.execute(stmt)
        return result.scalars().all()

    async def mark_as_processing(
        self, db: AsyncSession, *, task_id: int
    ) -> WebhookTask:
        """Mark task as processing."""
        task = await self.get(db, id=task_id)
        if task:
            task.status = "processing"
            db.add(task)
            await db.commit()
            await db.refresh(task)
        return task

    async def mark_as_completed(
        self, db: AsyncSession, *, task_id: int
    ) -> WebhookTask:
        """Mark task as completed."""
        task = await self.get(db, id=task_id)
        if task:
            task.status = "completed"
            task.completed_at = datetime.utcnow()
            db.add(task)
            await db.commit()
            await db.refresh(task)
        return task

    async def mark_as_failed(
        self, db: AsyncSession, *, task_id: int, error_message: str, retry: bool = True
    ) -> WebhookTask:
        """Mark task as failed and schedule retry if applicable."""
        task = await self.get(db, id=task_id)
        if task:
            task.status = "failed" if not retry or task.retry_count >= task.max_retries else "pending"
            task.error_message = error_message
            task.retry_count += 1
            
            if retry and task.retry_count < task.max_retries:
                # Exponential backoff: 2^retry_count minutes
                delay_minutes = 2 ** task.retry_count
                task.next_retry_at = datetime.utcnow() + timedelta(minutes=delay_minutes)
                task.status = "pending"
            
            db.add(task)
            await db.commit()
            await db.refresh(task)
        return task


webhook_task = CRUDWebhookTask(WebhookTask)

