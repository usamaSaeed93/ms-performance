from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String, TIMESTAMP, DECIMAL, Boolean

from db.base_class import Base


class ProductVariant(Base):
    """
    Product Variant Table
    Stores product variations (e.g., Small Red T-Shirt, Large Blue T-Shirt)
    """
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False, index=True)
    sku = Column(String(100), nullable=True, unique=True, index=True)
    name = Column(String(255), nullable=True)  # e.g., "Small - Red"
    
    # Pricing
    price = Column(DECIMAL(10, 2), nullable=True)  # Override product price if set
    sale_price = Column(DECIMAL(10, 2), nullable=True)
    
    # Stock
    quantity = Column(Integer, nullable=False, default=0)
    stock_status = Column(String(20), nullable=False, default="in_stock")  # in_stock, out_of_stock, on_backorder
    manage_stock = Column(Boolean, nullable=False, default=True)
    stock_threshold = Column(Integer, nullable=True)  # Low stock threshold
    
    # Dimensions & Weight (can override product defaults)
    weight = Column(DECIMAL(10, 2), nullable=True)
    length = Column(DECIMAL(10, 2), nullable=True)
    width = Column(DECIMAL(10, 2), nullable=True)
    height = Column(DECIMAL(10, 2), nullable=True)
    
    # Image override
    image_url = Column(String(500), nullable=True)  # Variant-specific image
    
    # Status
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class ProductVariantAttribute(Base):
    """
    Product Variant Attribute Table
    Links variants to their attribute values (e.g., Variant 1 has Color=Red, Size=Small)
    """
    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("product_variant.id", ondelete="CASCADE"), nullable=False, index=True)
    attribute_id = Column(Integer, ForeignKey("product_attribute.id", ondelete="CASCADE"), nullable=False)
    attribute_value_id = Column(Integer, ForeignKey("product_attribute_value.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

