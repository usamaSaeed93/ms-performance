from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, DECIMAL, ForeignKey, Boolean

from db.base_class import Base


class Discount(Base):
    """
    Discount Table
    Supports percentage and fixed amount discounts
    Can be applied to products, categories, or entire order
    """

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), nullable=False, unique=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(String(500), nullable=True)
    
    # Discount type: 'percentage' or 'fixed'
    discount_type = Column(String(20), nullable=False, default="percentage")
    
    # Discount value (percentage or fixed amount)
    discount_value = Column(DECIMAL(10, 2), nullable=False)
    
    # Minimum order amount to apply discount
    minimum_order_amount = Column(DECIMAL(10, 2), nullable=True, default=0)
    
    # Maximum discount amount (for percentage discounts)
    maximum_discount_amount = Column(DECIMAL(10, 2), nullable=True)
    
    # Usage limits
    usage_limit = Column(Integer, nullable=True)  # Total times discount can be used
    usage_count = Column(Integer, nullable=False, default=0)  # Times already used
    
    # Per-user usage limit
    per_user_limit = Column(Integer, nullable=True, default=1)
    
    # Applicable to
    product_id = Column(Integer, ForeignKey("product.id"), nullable=True)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=True)
    # If both are None, applies to entire order
    
    # Validity period
    valid_from = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    valid_until = Column(TIMESTAMP, nullable=True)
    
    # Status
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

