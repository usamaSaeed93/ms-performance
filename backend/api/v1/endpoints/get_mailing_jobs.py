from fastapi import status

from api.base_resource import GetResource
from crud.mailing_job import mailing_job
from crud.schemas.mailing_job import MailingJob


class GetMailingJobs(GetResource):
    response_schema = MailingJob
    authentication_required = True

    api_name = "get_mailing_jobs"
    api_url = "mailing-jobs"

    async def process_flow(self):
        self.response_data = await mailing_job.get_multi(
            self.db, page=1, per_page=200, order_by="created_at", order="desc"
        )
        self.status_code = status.HTTP_200_OK
        self.response_message = "Mailing jobs retrieved successfully"
