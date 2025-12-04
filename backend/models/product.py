from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String, TIMESTAMP, TEXT, DECIMAL, Boolean

from db.base_class import Base


class Product(Base):
    """
    Product Table
    Enhanced with WooCommerce-like features
    """

    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    product_name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), nullable=True, unique=True, index=True)  # URL-friendly slug
    short_description = Column(TEXT, nullable=True)  # Brief description for listings
    description = Column(TEXT, nullable=True)  # Full description
    
    # Pricing
    price = Column(DECIMAL(10, 2), nullable=False)  # Regular price
    sale_price = Column(DECIMAL(10, 2), nullable=True)  # Sale price
    sale_start_date = Column(TIMESTAMP, nullable=True)  # Sale start date
    sale_end_date = Column(TIMESTAMP, nullable=True)  # Sale end date
    
    # Product Type
    product_type = Column(String(20), nullable=False, default="simple")  # simple, variable, grouped, external
    is_virtual = Column(Boolean, nullable=False, default=False)  # No shipping needed
    is_downloadable = Column(Boolean, nullable=False, default=False)  # Digital product
    
    # Stock Management
    sku = Column(String(100), nullable=True, unique=True, index=True)
    quantity = Column(Integer, default=0)
    stock_status = Column(String(20), nullable=False, default="in_stock")  # in_stock, out_of_stock, on_backorder
    manage_stock = Column(Boolean, nullable=False, default=True)
    stock_threshold = Column(Integer, nullable=True)  # Low stock threshold
    backorders_allowed = Column(Boolean, nullable=False, default=False)
    
    # Dimensions & Weight
    weight = Column(DECIMAL(10, 2), nullable=True)
    length = Column(DECIMAL(10, 2), nullable=True)
    width = Column(DECIMAL(10, 2), nullable=True)
    height = Column(DECIMAL(10, 2), nullable=True)
    
    # Shipping
    shipping_class = Column(String(50), nullable=True)  # Shipping class
    shipping_required = Column(Boolean, nullable=False, default=True)
    shipping_taxable = Column(Boolean, nullable=False, default=True)
    
    # Images (primary image - gallery stored in product_image table)
    image_url = Column(String(500), nullable=True)  # Primary/main image
    
    # Categories (primary category - multiple categories in product_category_relation)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=True)  # Primary category (nullable for backward compat)
    
    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(TEXT, nullable=True)
    meta_keywords = Column(String(500), nullable=True)
    
    # Product Status
    status = Column(String(20), nullable=False, default="published")  # draft, published, archived
    is_active = Column(Integer, nullable=False, default=1)  # Legacy field
    is_featured = Column(Boolean, nullable=False, default=False)  # Featured product
    
    # Purchase Options
    purchase_note = Column(TEXT, nullable=True)  # Note shown after purchase
    enable_reviews = Column(Boolean, nullable=False, default=True)
    average_rating = Column(DECIMAL(3, 2), nullable=True, default=0)  # Calculated average rating
    review_count = Column(Integer, nullable=False, default=0)  # Number of reviews
    
    # Related Products
    upsell_ids = Column(String(500), nullable=True)  # Comma-separated product IDs
    cross_sell_ids = Column(String(500), nullable=True)  # Comma-separated product IDs
    
    # Grouped Products
    parent_id = Column(Integer, ForeignKey("product.id"), nullable=True)  # For grouped products
    
    # External Products
    external_url = Column(String(500), nullable=True)  # For external/affiliate products
    button_text = Column(String(100), nullable=True, default="Buy product")  # Button text for external products
    
    # Tax Settings (WooCommerce-like)
    tax_class_id = Column(Integer, ForeignKey("tax_class.id"), nullable=True, index=True)  # Tax class for this product
    tax_status = Column(String(20), nullable=False, default="taxable")  # taxable, shipping, none
    
    # Timestamps
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
