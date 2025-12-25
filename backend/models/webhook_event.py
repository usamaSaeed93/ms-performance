from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, TEXT, Boolean

from db.base_class import Base


class WebhookEvent(Base):
    """
    Webhook Event Table
    Stores processed webhook events for deduplication
    """
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(255), nullable=False, unique=True, index=True)  # Stripe event ID
    event_type = Column(String(100), nullable=False, index=True)  # e.g., payment_intent.succeeded
    payment_intent_id = Column(String(255), nullable=True, index=True)  # Related payment intent
    processed = Column(Boolean, nullable=False, default=False, index=True)  # Whether event was successfully processed
    processed_at = Column(TIMESTAMP, nullable=True)  # When event was processed
    error_message = Column(TEXT, nullable=True)  # Error message if processing failed
    retry_count = Column(Integer, nullable=False, default=0)  # Number of retry attempts
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

