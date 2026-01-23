from datetime import datetime
from sqlalchemy import Column, String, TIMESTAMP, TEXT

from db.base_class import Base

class Setting(Base):
    """
    Setting Table
    Stores global configuration settings (key-value pairs).
    """
    key = Column(String(100), primary_key=True, index=True)
    value = Column(TEXT, nullable=True)
    description = Column(TEXT, nullable=True)
    type = Column(String(20), default="string") # string, boolean, number, json

    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
