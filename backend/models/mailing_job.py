from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text

from db.base_class import Base


class MailingJob(Base):
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="queued", index=True)
    scheduled_at = Column(DateTime, nullable=True)
    total_recipients = Column(Integer, nullable=False, default=0)
    sent_count = Column(Integer, nullable=False, default=0)
    failed_count = Column(Integer, nullable=False, default=0)
    last_error = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
