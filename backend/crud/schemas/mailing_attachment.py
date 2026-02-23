from datetime import datetime
from pydantic import BaseModel


class MailingAttachmentBase(BaseModel):
    url: str
    object_name: str
    filename: str
    content_type: str
    size: int


class MailingAttachmentCreate(MailingAttachmentBase):
    job_id: int


class MailingAttachment(MailingAttachmentBase):
    id: int
    job_id: int
    created_at: datetime

    class Config:
        from_attributes = True
