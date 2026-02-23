from crud.base import CRUDBase
from models.mailing_job import MailingJob
from crud.schemas.mailing_job import MailingJobCreate, MailingJobUpdate


class CRUDMailingJob(CRUDBase[MailingJob, MailingJobCreate, MailingJobUpdate]):
    pass


mailing_job = CRUDMailingJob(MailingJob)
