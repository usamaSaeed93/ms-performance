from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, TEXT, Boolean, ForeignKey
from sqlalchemy.dialects.mysql import LONGTEXT

from db.base_class import Base


class Blog(Base):
    """
    Blog Post Table
    """
    id = Column(Integer, primary_key=True, index=True)
    
    title = Column(String(500), nullable=False, index=True)
    slug = Column(String(500), nullable=True, unique=True, index=True)
    excerpt = Column(TEXT, nullable=True)
    content = Column(LONGTEXT, nullable=False)
    
    featured_image = Column(String(500), nullable=True)
    
    author_id = Column(Integer, ForeignKey("user.id"), nullable=True, index=True)
    author_name = Column(String(200), nullable=True)
    
    status = Column(String(20), nullable=False, default="draft")
    
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(TEXT, nullable=True)
    meta_keywords = Column(String(500), nullable=True)
    
    published_at = Column(TIMESTAMP, nullable=True)
    
    view_count = Column(Integer, default=0)
    
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

