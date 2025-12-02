from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, TEXT, ForeignKey

from db.base_class import Base


class Category(Base):
    """
    Category Table
    """

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), nullable=False, index=True)
    category_slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(TEXT, nullable=True)
    parent_id = Column(Integer, ForeignKey("category.id"), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
