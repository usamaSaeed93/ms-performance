from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime

from common.types import TzDateTime


class ProductBase(BaseModel):
    # Basic Information
    product_name: str = Field(..., max_length=200, min_length=3)
    slug: Optional[str] = Field(None, max_length=200)
    short_description: Optional[str] = None
    description: Optional[str] = None
    
    # Pricing
    price: Decimal = Field(..., gt=0, decimal_places=2)
    sale_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    sale_start_date: Optional[datetime] = None
    sale_end_date: Optional[datetime] = None
    
    # Product Type
    product_type: str = Field(default="simple", pattern="^(simple|variable|grouped|external)$")
    is_virtual: bool = Field(default=False)
    is_downloadable: bool = Field(default=False)
    
    # Stock Management
    sku: Optional[str] = Field(None, max_length=100)
    quantity: int = Field(default=0, ge=0)
    stock_status: str = Field(default="in_stock", pattern="^(in_stock|out_of_stock|on_backorder)$")
    manage_stock: bool = Field(default=True)
    stock_threshold: Optional[int] = Field(None, ge=0)
    backorders_allowed: bool = Field(default=False)
    
    # Dimensions & Weight
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    length: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    width: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    height: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    
    # Shipping
    shipping_class: Optional[str] = Field(None, max_length=50)
    shipping_required: bool = Field(default=True)
    shipping_taxable: bool = Field(default=True)
    
    # Images
    image_url: Optional[str] = Field(None, max_length=500)  # Primary image
    
    # Categories (primary category - multiple categories in product_category_relation)
    category_id: Optional[int] = Field(None, gt=0)  # Primary category
    
    # SEO
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=500)
    
    # Product Status
    status: str = Field(default="published", pattern="^(draft|published|archived)$")
    is_active: bool = Field(default=True)  # Legacy field
    is_featured: bool = Field(default=False)
    
    # Purchase Options
    purchase_note: Optional[str] = None
    enable_reviews: bool = Field(default=True)
    
    # Related Products
    upsell_ids: Optional[str] = Field(None, max_length=500)  # Comma-separated IDs
    cross_sell_ids: Optional[str] = Field(None, max_length=500)  # Comma-separated IDs
    
    # Grouped Products
    parent_id: Optional[int] = Field(None, gt=0)
    
    # External Products
    external_url: Optional[str] = Field(None, max_length=500)
    button_text: Optional[str] = Field(default="Buy product", max_length=100)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    product_name: Optional[str] = Field(None, max_length=200, min_length=3)
    slug: Optional[str] = Field(None, max_length=200)
    short_description: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    sale_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    sale_start_date: Optional[datetime] = None
    sale_end_date: Optional[datetime] = None
    product_type: Optional[str] = Field(None, pattern="^(simple|variable|grouped|external)$")
    is_virtual: Optional[bool] = None
    is_downloadable: Optional[bool] = None
    sku: Optional[str] = Field(None, max_length=100)
    quantity: Optional[int] = Field(None, ge=0)
    stock_status: Optional[str] = Field(None, pattern="^(in_stock|out_of_stock|on_backorder)$")
    manage_stock: Optional[bool] = None
    stock_threshold: Optional[int] = Field(None, ge=0)
    backorders_allowed: Optional[bool] = None
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    length: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    width: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    height: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_class: Optional[str] = Field(None, max_length=50)
    shipping_required: Optional[bool] = None
    shipping_taxable: Optional[bool] = None
    image_url: Optional[str] = Field(None, max_length=500)
    category_id: Optional[int] = Field(None, gt=0)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    purchase_note: Optional[str] = None
    enable_reviews: Optional[bool] = None
    upsell_ids: Optional[str] = Field(None, max_length=500)
    cross_sell_ids: Optional[str] = Field(None, max_length=500)
    parent_id: Optional[int] = Field(None, gt=0)
    external_url: Optional[str] = Field(None, max_length=500)
    button_text: Optional[str] = Field(None, max_length=100)


class ProductInDB(ProductBase):
    id: int
    average_rating: Optional[Decimal] = None
    review_count: int = Field(default=0)
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class Product(ProductInDB):
    pass
