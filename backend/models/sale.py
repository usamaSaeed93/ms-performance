from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String, DECIMAL, TIMESTAMP, TEXT

from db.base_class import Base


class Sale(Base):
    """
    Sale/Order Table
    """

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)  # Amount before tax
    tax = Column(DECIMAL(10, 2), nullable=False, default=0)  # Total tax amount
    shipping_cost = Column(DECIMAL(10, 2), nullable=True, default=0)
    shipping_tax = Column(DECIMAL(10, 2), nullable=True, default=0)  # Tax on shipping
    total_amount = Column(DECIMAL(10, 2), nullable=False)  # Total amount (subtotal + tax + shipping + shipping_tax)
    order_number = Column(String(50), nullable=True, unique=True, index=True)
    order_status = Column(String(20), nullable=False, default="pending", index=True)  # pending, processing, shipped, delivered, cancelled
    payment_status = Column(String(20), nullable=False, default="pending", index=True)  # pending, paid, failed, refunded
    payment_method = Column(String(50), nullable=True)
    payment_intent_id = Column(String(255), nullable=True, unique=True, index=True)  # Stripe Payment Intent ID
    shipping_address = Column(TEXT, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
