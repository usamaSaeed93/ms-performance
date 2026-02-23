from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class MailingJobBase(BaseModel):
    subject: str
    content: str
    scheduled_at: Optional[datetime] = None


class MailingJobCreate(MailingJobBase):
    pass


class MailingJobUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    total_recipients: Optional[int] = None
    sent_count: Optional[int] = None
    failed_count: Optional[int] = None
    last_error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class MailingJob(MailingJobBase):
    id: int
    status: str
    total_recipients: int
    sent_count: int
    failed_count: int
    last_error: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
