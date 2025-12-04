from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, DECIMAL, Boolean, ForeignKey, TEXT

from db.base_class import Base


class TaxClass(Base):
    """
    Tax Class Table
    Similar to WooCommerce tax classes (Standard, Reduced Rate, Zero Rate, etc.)
    """
    __tablename__ = "tax_class"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)  # e.g., "Standard", "Reduced Rate", "Zero Rate"
    slug = Column(String(100), nullable=False, unique=True, index=True)  # URL-friendly slug
    description = Column(TEXT, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class TaxRate(Base):
    """
    Tax Rate Table
    Stores tax rates for different tax classes and countries/regions
    Similar to WooCommerce tax rates
    """
    __tablename__ = "tax_rate"

    id = Column(Integer, primary_key=True, index=True)
    tax_class_id = Column(Integer, ForeignKey("tax_class.id"), nullable=True, index=True)  # NULL = standard rate
    name = Column(String(100), nullable=False)  # e.g., "UK VAT Standard Rate", "UK VAT Reduced Rate"
    country_code = Column(String(2), nullable=False, default="GB", index=True)  # ISO country code (GB for UK)
    state_code = Column(String(50), nullable=True, index=True)  # State/province code (if applicable)
    postcode = Column(String(20), nullable=True)  # Postcode range (if applicable)
    city = Column(String(100), nullable=True)  # City (if applicable)
    rate = Column(DECIMAL(5, 4), nullable=False)  # Tax rate as decimal (e.g., 0.2000 for 20%)
    priority = Column(Integer, nullable=False, default=1)  # Priority when multiple rates apply
    compound = Column(Boolean, nullable=False, default=False)  # Whether this is a compound tax
    shipping = Column(Boolean, nullable=False, default=True)  # Whether tax applies to shipping
    order = Column(Integer, nullable=False, default=0)  # Display order
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

