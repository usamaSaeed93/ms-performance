from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String, TIMESTAMP, TEXT, Boolean, DECIMAL

from db.base_class import Base


class ProductReview(Base):
    """
    Product Review Table
    Customer reviews and ratings for products
    """
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Review content
    reviewer_name = Column(String(100), nullable=False)  # Name if user is not logged in
    reviewer_email = Column(String(100), nullable=True)
    title = Column(String(255), nullable=True)
    review_text = Column(TEXT, nullable=True)
    
    # Rating (1-5 stars)
    rating = Column(Integer, nullable=False, default=5)  # 1-5
    
    # Status
    is_approved = Column(Boolean, nullable=False, default=False)  # Admin approval
    is_verified_purchase = Column(Boolean, nullable=False, default=False)  # Verified purchase
    
    # Helpful votes
    helpful_count = Column(Integer, nullable=False, default=0)
    
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

