from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ForeignKey

from db.base_class import Base


class ProductTag(Base):
    """
    Product Tag Table
    Tags for categorizing and organizing products
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class ProductTagRelation(Base):
    """
    Product Tag Relation Table
    Many-to-many relationship between products and tags
    """
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False, index=True)
    tag_id = Column(Integer, ForeignKey("product_tag.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

