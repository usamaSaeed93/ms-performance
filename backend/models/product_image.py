from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ForeignKey

from db.base_class import Base


class ProductImage(Base):
    """
    Product Image Table
    Stores multiple images for a product (gallery)
    """
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)  # For ordering images
    is_primary = Column(Boolean, nullable=False, default=False)  # Primary/main image
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

