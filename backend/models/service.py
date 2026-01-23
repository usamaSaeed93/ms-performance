from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, TEXT

from db.base_class import Base

class Service(Base):
    """
    Service Table
    Stores services displayed on the homepage.
    """
    id = Column(Integer, primary_key=True, index=True)
    
    title = Column(String(200), nullable=False, unique=True, index=True)
    description = Column(TEXT, nullable=True)
    icon = Column(String(50), nullable=True) # Text based icon or identifier
    link = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0)

    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
