from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ForeignKey

from db.base_class import Base


class ProductAttribute(Base):
    """
    Product Attribute Table
    Defines attribute types (e.g., Color, Size, Material)
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)  # e.g., "Color", "Size"
    slug = Column(String(100), nullable=False, unique=True, index=True)  # e.g., "color", "size"
    type = Column(String(20), nullable=False, default="select")  # select, text, number, etc.
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class ProductAttributeValue(Base):
    """
    Product Attribute Value Table
    Stores possible values for attributes (e.g., Red, Blue, Small, Large)
    """
    id = Column(Integer, primary_key=True, index=True)
    attribute_id = Column(Integer, ForeignKey("product_attribute.id", ondelete="CASCADE"), nullable=False, index=True)
    value = Column(String(255), nullable=False)  # e.g., "Red", "Small", "XL"
    display_value = Column(String(255), nullable=True)  # Display name (e.g., "Extra Large")
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

