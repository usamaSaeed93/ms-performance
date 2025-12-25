from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, TEXT, Boolean, JSON

from db.base_class import Base


class WebhookTask(Base):
    """
    Webhook Task Queue Table
    Stores webhook processing tasks for retry mechanism
    """
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(255), nullable=False, index=True)  # Stripe event ID
    event_type = Column(String(100), nullable=False, index=True)
    event_data = Column(JSON, nullable=False)  # Full event data as JSON
    status = Column(String(20), nullable=False, default="pending", index=True)  # pending, processing, completed, failed
    retry_count = Column(Integer, nullable=False, default=0)
    max_retries = Column(Integer, nullable=False, default=3)
    error_message = Column(TEXT, nullable=True)
    next_retry_at = Column(TIMESTAMP, nullable=True, index=True)  # When to retry if failed
    completed_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

