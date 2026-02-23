import asyncio
from datetime import datetime
from fastapi import status

from api.base_resource import PostResource
from api.v1.schemas.mailing import MailingJobCreateRequest
from core.mailing_service import send_mailing_job
from crud.mailing_job import mailing_job
from crud.mailing_subscription import mailing_subscription
from crud.mailing_attachment import mailing_attachment
from crud.schemas.mailing_job import MailingJob


class CreateMailingJob(PostResource):
    request_schema = MailingJobCreateRequest
    response_schema = MailingJob
    authentication_required = True

    api_name = "create_mailing_job"
    api_url = "mailing-jobs"

    async def process_flow(self):
        total_recipients = await mailing_subscription.get_active_count(self.db)
        job_payload = {
            "subject": self.request_data.subject,
            "content": self.request_data.content,
            "scheduled_at": self.request_data.scheduled_at,
        }
        job = await mailing_job.create(self.db, obj_in=job_payload)

        now = datetime.utcnow()
        is_scheduled = bool(self.request_data.scheduled_at and self.request_data.scheduled_at > now)
        status_value = "scheduled" if is_scheduled else "queued"

        job = await mailing_job.update(
            self.db,
            db_obj=job,
            obj_in={
                "status": status_value,
                "total_recipients": total_recipients,
            },
        )

        if self.request_data.attachments:
            for attachment in self.request_data.attachments:
                await mailing_attachment.create(
                    self.db,
                    obj_in={
                        "job_id": job.id,
                        "url": attachment.url,
                        "object_name": attachment.object_name,
                        "filename": attachment.filename,
                        "content_type": attachment.content_type,
                        "size": attachment.size,
                    },
                )

        if not is_scheduled:
            asyncio.create_task(send_mailing_job(job.id))

        self.response_data = job
        self.status_code = status.HTTP_201_CREATED
        self.response_message = "Mailing job queued successfully"
