import asyncio
from datetime import datetime
from sqlalchemy import select

from core.email import email_service
from core.storage import get_storage
from core.logger import Logger
from db.session import AsyncSessionMaker
from instance.config import config
from models.mailing_job import MailingJob
from models.mailing_subscription import MailingSubscription
from models.mailing_attachment import MailingAttachment


logger = Logger.get_logger(__file__, __name__)


async def send_mailing_job(job_id: int) -> None:
    db = AsyncSessionMaker()
    db.sync_session.set_bind_key(config.APP_ENVIRONMENT)

    try:
        result = await db.execute(select(MailingJob).where(MailingJob.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            logger.error(f"Mailing job {job_id} not found")
            return

        subscribers_result = await db.execute(
            select(MailingSubscription).where(MailingSubscription.is_active == True)
        )
        subscribers = subscribers_result.scalars().all()

        attachments_result = await db.execute(
            select(MailingAttachment).where(MailingAttachment.job_id == job.id)
        )
        attachments = attachments_result.scalars().all()

        attachment_payloads = []
        if attachments:
            storage = get_storage()
            bucket_name = config.STORAGE_BUCKET_NAME
            for attachment in attachments:
                try:
                    file_bytes = await storage.download_file(
                        bucket_name=bucket_name,
                        object_name=attachment.object_name,
                    )
                    attachment_payloads.append({
                        "filename": attachment.filename,
                        "content_type": attachment.content_type,
                        "data": file_bytes,
                    })
                except Exception as exc:
                    logger.error(f"Failed to fetch attachment {attachment.object_name}: {exc}")

        job.status = "sending"
        job.started_at = datetime.utcnow()
        job.total_recipients = len(subscribers)
        job.sent_count = 0
        job.failed_count = 0
        job.last_error = None
        db.add(job)
        await db.commit()

        sent_count = 0
        failed_count = 0
        last_error = None

        for index, subscriber in enumerate(subscribers, start=1):
            try:
                result = await email_service.send_newsletter_email(
                    to_email=subscriber.email,
                    customer_name=subscriber.name,
                    subject=job.subject,
                    content=job.content,
                    attachments=attachment_payloads,
                )
                if result:
                    sent_count += 1
                else:
                    failed_count += 1
            except Exception as exc:
                failed_count += 1
                last_error = str(exc)
                logger.error(f"Failed to send newsletter to {subscriber.email}: {exc}")

            if index % 10 == 0:
                job.sent_count = sent_count
                job.failed_count = failed_count
                job.last_error = last_error
                db.add(job)
                await db.commit()
                await asyncio.sleep(0.2)

        job.sent_count = sent_count
        job.failed_count = failed_count
        job.last_error = last_error
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        db.add(job)
        await db.commit()

    except Exception as exc:
        logger.error(f"Mailing job {job_id} failed: {exc}")
        try:
            result = await db.execute(select(MailingJob).where(MailingJob.id == job_id))
            job = result.scalar_one_or_none()
            if job:
                job.status = "failed"
                job.last_error = str(exc)
                job.completed_at = datetime.utcnow()
                db.add(job)
                await db.commit()
        except Exception:
            pass
    finally:
        await db.close()
