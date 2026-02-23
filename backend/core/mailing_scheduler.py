import asyncio
from datetime import datetime
from sqlalchemy import select

from core.logger import Logger
from core.mailing_service import send_mailing_job
from db.session import AsyncSessionMaker
from instance.config import config
from models.mailing_job import MailingJob


logger = Logger.get_logger(__file__, __name__)

_scheduler_task = None
_stop_event = asyncio.Event()


async def _scheduler_loop(interval_seconds: int = 30):
    logger.info("Mailing scheduler started")
    while not _stop_event.is_set():
        try:
            db = AsyncSessionMaker()
            db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
            now = datetime.utcnow()
            result = await db.execute(
                select(MailingJob).where(
                    MailingJob.status == "scheduled",
                    MailingJob.scheduled_at != None,
                    MailingJob.scheduled_at <= now,
                )
            )
            jobs = result.scalars().all()
            if jobs:
                for job in jobs:
                    job.status = "queued"
                    db.add(job)
                await db.commit()
                for job in jobs:
                    asyncio.create_task(send_mailing_job(job.id))
        except Exception as exc:
            logger.error(f"Mailing scheduler error: {exc}")
        finally:
            try:
                await db.close()
            except Exception:
                pass
        try:
            await asyncio.wait_for(_stop_event.wait(), timeout=interval_seconds)
        except asyncio.TimeoutError:
            continue
    logger.info("Mailing scheduler stopped")


def start_mailing_scheduler():
    global _scheduler_task
    if _scheduler_task is None or _scheduler_task.done():
        _stop_event.clear()
        loop = asyncio.get_event_loop()
        _scheduler_task = loop.create_task(_scheduler_loop())


async def stop_mailing_scheduler():
    _stop_event.set()
    if _scheduler_task:
        await _scheduler_task
