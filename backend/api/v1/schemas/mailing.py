from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class MailingAttachmentRequest(BaseModel):
    url: str
    object_name: str
    filename: str
    content_type: str
    size: int


class MailingJobCreateRequest(BaseModel):
    subject: str
    content: str
    scheduled_at: Optional[datetime] = None
    attachments: Optional[List[MailingAttachmentRequest]] = None
