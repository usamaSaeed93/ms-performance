from pydantic import BaseModel, Field, model_validator
from decimal import Decimal
from typing import Optional
from datetime import datetime
import re

from common.types import TzDateTime


def _normalize_product_values(values: dict) -> dict:
    """Normalize incoming payloads from the admin UI (handles blank strings/booleans)."""
    if not values:
        return values

    values = dict(values)

    # Convert empty strings to None for optional fields
    optional_string_fields = [
        "slug",
        "short_description",
        "description",
        "sale_start_date",
        "sale_end_date",
        "sku",
        "shipping_class",
        "image_url",
        "meta_title",
        "meta_description",
        "meta_keywords",
        "upsell_ids",
        "cross_sell_ids",
        "external_url",
        "button_text",
    ]
    for field in optional_string_fields:
        if field in values and isinstance(values[field], str) and values[field].strip() == "":
            values[field] = None

    # Handle numeric fields passed as empty strings
    empty_to_none_fields = [
        "price",
        "sale_price",
        "quantity",
        "stock_threshold",
        "weight",
        "length",
        "width",
        "height",
        "parent_id",
        "category_id",
    ]
    for field in empty_to_none_fields:
        if field in values and values[field] == "":
            values[field] = None

    # Normalize boolean-ish fields that can arrive as strings/ints
    boolean_fields = [
        "is_active",
        "is_featured",
        "enable_reviews",
        "manage_stock",
        "backorders_allowed",
        "is_virtual",
        "is_downloadable",
        "shipping_required",
        "shipping_taxable",
    ]
    truthy = {True, "true", "True", 1, "1", "yes", "on"}
    falsy = {False, "false", "False", 0, "0", "no", "off"}
    for field in boolean_fields:
        if field in values:
            if values[field] in truthy:
                values[field] = True
            elif values[field] in falsy:
                values[field] = False

    # Parse ISO-ish datetime strings when provided
    for dt_field in ["sale_start_date", "sale_end_date"]:
        val = values.get(dt_field)
        if isinstance(val, str):
            if val.strip():
                try:
                    values[dt_field] = datetime.fromisoformat(val)
                except ValueError:
                    pass
            else:
                values[dt_field] = None

    return values


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
    
    # Tax
    tax_class_id: Optional[int] = Field(None, gt=0)
    tax_status: str = Field(default="taxable", pattern="^(taxable|shipping|none)$")
    
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

    @model_validator(mode="before")
    @classmethod
    def normalize_blank_values(cls, values: dict):
        return _normalize_product_values(values)


class ProductCreate(ProductBase):
    category_id: int = Field(..., gt=0, description="Category ID is required for product creation")
    
    @model_validator(mode="after")
    def validate_business_rules(self):
        """Validate business rules and cross-field dependencies for product creation."""
        errors = []
        
        # Category is required for creation
        if not self.category_id or self.category_id <= 0:
            errors.append(ValueError("Category is required"))
        
        # Sale price must be less than regular price
        if self.sale_price is not None and self.price is not None:
            if self.sale_price >= self.price:
                errors.append(
                    ValueError("Sale price must be less than regular price")
                )
        
        # Sale dates validation
        if self.sale_start_date and self.sale_end_date:
            if self.sale_start_date >= self.sale_end_date:
                errors.append(
                    ValueError("Sale end date must be after sale start date")
                )
        
        # External products must have external_url
        if self.product_type == "external":
            if not self.external_url or not self.external_url.strip():
                errors.append(
                    ValueError("External products must have an external URL")
                )
        
        # External URL validation (if provided)
        if self.external_url:
            if not self.external_url.startswith(("http://", "https://")):
                errors.append(
                    ValueError("External URL must start with http:// or https://")
                )
        
        # Virtual products should not require shipping
        if self.is_virtual and self.shipping_required:
            errors.append(
                ValueError("Virtual products should not require shipping")
            )
        
        # Slug validation (if provided)
        if self.slug:
            if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', self.slug):
                errors.append(
                    ValueError("Slug must contain only lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen.")
                )
        
        # SKU validation (if provided)
        if self.sku:
            if len(self.sku.strip()) == 0:
                errors.append(
                    ValueError("SKU cannot be empty if provided")
                )
            if not re.match(r'^[A-Za-z0-9_-]+$', self.sku):
                errors.append(
                    ValueError("SKU must contain only letters, numbers, hyphens, and underscores")
                )
        
        # Stock threshold validation
        if self.manage_stock and self.stock_threshold is not None:
            if self.stock_threshold < 0:
                errors.append(
                    ValueError("Stock threshold must be zero or positive")
                )
        
        # Dimensions validation (if provided)
        if self.length is not None and self.length <= 0:
            errors.append(ValueError("Length must be greater than 0"))
        if self.width is not None and self.width <= 0:
            errors.append(ValueError("Width must be greater than 0"))
        if self.height is not None and self.height <= 0:
            errors.append(ValueError("Height must be greater than 0"))
        if self.weight is not None and self.weight <= 0:
            errors.append(ValueError("Weight must be greater than 0"))
        
        if errors:
            raise ValueError(f"Validation errors: {'; '.join(str(e) for e in errors)}")
        
        return self


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
    tax_class_id: Optional[int] = Field(None, gt=0)
    tax_status: Optional[str] = Field(None, pattern="^(taxable|shipping|none)$")
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

    @model_validator(mode="before")
    @classmethod
    def normalize_blank_values(cls, values: dict):
        return _normalize_product_values(values)
    
    @model_validator(mode="after")
    def validate_business_rules_update(self):
        """Validate business rules for product updates."""
        errors = []
        
        # Get all non-None values that were actually provided
        data = self.model_dump(exclude_unset=True)
        
        # Sale price validation (if both are provided)
        if "sale_price" in data and "price" in data:
            sale_price = data.get("sale_price")
            price = data.get("price")
            if sale_price is not None and price is not None:
                if isinstance(sale_price, (int, float, Decimal)) and isinstance(price, (int, float, Decimal)):
                    if Decimal(str(sale_price)) >= Decimal(str(price)):
                        errors.append(ValueError("Sale price must be less than regular price"))
        
        # Sale dates validation
        if "sale_start_date" in data and "sale_end_date" in data:
            start = data.get("sale_start_date")
            end = data.get("sale_end_date")
            if start and end and isinstance(start, datetime) and isinstance(end, datetime):
                if start >= end:
                    errors.append(ValueError("Sale end date must be after sale start date"))
        
        # External products validation
        if data.get("product_type") == "external":
            external_url = data.get("external_url", "")
            if not external_url or not str(external_url).strip():
                errors.append(ValueError("External products must have an external URL"))
            elif not str(external_url).startswith(("http://", "https://")):
                errors.append(ValueError("External URL must start with http:// or https://"))
        
        # Virtual products validation
        if data.get("is_virtual") and data.get("shipping_required"):
            errors.append(ValueError("Virtual products should not require shipping"))
        
        # Slug validation
        if "slug" in data and data["slug"]:
            slug = str(data["slug"])
            if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', slug):
                errors.append(ValueError("Slug must contain only lowercase letters, numbers, and hyphens"))
        
        # SKU validation
        if "sku" in data and data["sku"]:
            sku = str(data["sku"])
            if len(sku.strip()) == 0:
                errors.append(ValueError("SKU cannot be empty if provided"))
            elif not re.match(r'^[A-Za-z0-9_-]+$', sku):
                errors.append(ValueError("SKU must contain only letters, numbers, hyphens, and underscores"))
        
        # Dimensions validation
        for dim in ["length", "width", "height", "weight"]:
            if dim in data and data[dim] is not None:
                val = data[dim]
                if isinstance(val, (int, float, Decimal)) and Decimal(str(val)) <= 0:
                    errors.append(ValueError(f"{dim.capitalize()} must be greater than 0"))
        
        if errors:
            raise ValueError(f"Validation errors: {'; '.join(str(e) for e in errors)}")
        
        return self


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
