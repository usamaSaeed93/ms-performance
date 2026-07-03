from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, TIMESTAMP, TEXT

from db.base_class import Base


class Review(Base):
    """
    Review Table
    Stores customer reviews displayed in the Reviews section on the homepage.
    """
    id = Column(Integer, primary_key=True, index=True)

    author_name = Column(String(200), nullable=False)
    rating = Column(Integer, nullable=False, default=5)          # 1–5 stars
    text = Column(TEXT, nullable=True)
    profile_photo_url = Column(String(500), nullable=True)
    relative_time = Column(String(100), nullable=True)           # e.g. "2 months ago"
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
