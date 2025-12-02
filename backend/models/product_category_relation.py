from datetime import datetime
from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey

from db.base_class import Base


class ProductCategoryRelation(Base):
    """
    Product Category Relation Table
    Many-to-many relationship between products and categories
    Allows products to belong to multiple categories
    """
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("category.id", ondelete="CASCADE"), nullable=False, index=True)
    is_primary = Column(Integer, nullable=False, default=0)  # 1 if this is the primary category
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

