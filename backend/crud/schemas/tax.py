from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional

from common.types import TzDateTime


class TaxClassBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=100)
    description: Optional[str] = None
    is_active: bool = Field(default=True)


class TaxClassCreate(TaxClassBase):
    ...


class TaxClassUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class TaxClassInDB(TaxClassBase):
    id: int
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class TaxClass(TaxClassInDB):
    ...


class TaxRateBase(BaseModel):
    tax_class_id: Optional[int] = None  # NULL = standard rate
    name: str = Field(..., max_length=100)
    country_code: str = Field(default="GB", max_length=2)
    state_code: Optional[str] = Field(None, max_length=50)
    postcode: Optional[str] = Field(None, max_length=20)
    city: Optional[str] = Field(None, max_length=100)
    rate: Decimal = Field(..., decimal_places=4)  # e.g., 0.2000 for 20%
    priority: int = Field(default=1)
    compound: bool = Field(default=False)
    shipping: bool = Field(default=True)
    order: int = Field(default=0)
    is_active: bool = Field(default=True)


class TaxRateCreate(TaxRateBase):
    ...


class TaxRateUpdate(BaseModel):
    tax_class_id: Optional[int] = None
    name: Optional[str] = Field(None, max_length=100)
    country_code: Optional[str] = Field(None, max_length=2)
    state_code: Optional[str] = Field(None, max_length=50)
    postcode: Optional[str] = Field(None, max_length=20)
    city: Optional[str] = Field(None, max_length=100)
    rate: Optional[Decimal] = Field(None, decimal_places=4)
    priority: Optional[int] = None
    compound: Optional[bool] = None
    shipping: Optional[bool] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class TaxRateInDB(TaxRateBase):
    id: int
    created_at: TzDateTime
    updated_at: TzDateTime

    class Config:
        from_attributes = True


class TaxRate(TaxRateInDB):
    ...

