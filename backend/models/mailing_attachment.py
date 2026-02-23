from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from db.base_class import Base


class MailingAttachment(Base):
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("mailing_job.id"), nullable=False, index=True)
    url = Column(String(500), nullable=False)
    object_name = Column(String(500), nullable=False)
    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    size = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
