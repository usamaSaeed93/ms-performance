from datetime import datetime
from pydantic import BaseModel, validator
from enum import StrEnum


class Buckets(StrEnum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"


class GetSalesDataRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    include_sales_items: bool = True
    buckets: Buckets | None = None
    product_ids: list[int] = []
    category_ids: list[int] = []

    @validator("start_date", pre=True)
    def parse_start_date(cls, v):
        if isinstance(v, str):
            # Handle date string from query parameters
            try:
                # If it's just a date (YYYY-MM-DD), add time
                if 'T' not in v:
                    v = f"{v}T00:00:00"
                # Parse ISO format
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                raise ValueError(f"Invalid start_date format: {v}")
        return v

    @validator("end_date", pre=True)
    def parse_end_date(cls, v, values):
        if isinstance(v, str):
            # Handle date string from query parameters
            try:
                # If it's just a date (YYYY-MM-DD), add time to end of day
                if 'T' not in v:
                    v = f"{v}T23:59:59"
                # Parse ISO format
                parsed = datetime.fromisoformat(v.replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                raise ValueError(f"Invalid end_date format: {v}")
        else:
            parsed = v
        
        # Check if end_date is greater than start_date
        if "start_date" in values and parsed < values["start_date"]:
            raise ValueError("end_date must be greater than start_date")
        return parsed

    @validator("category_ids", pre=True)
    def parse_category_ids(cls, v):
        if isinstance(v, str):
            # Handle comma-separated string
            if v:
                return [int(x.strip()) for x in v.split(',') if x.strip()]
            return []
        if isinstance(v, list):
            return [int(x) if isinstance(x, str) else x for x in v]
        return v or []

    @validator("product_ids", pre=True)
    def parse_product_ids(cls, v):
        if isinstance(v, str):
            # Handle comma-separated string
            if v:
                return [int(x.strip()) for x in v.split(',') if x.strip()]
            return []
        if isinstance(v, list):
            return [int(x) if isinstance(x, str) else x for x in v]
        return v or []

    @validator("include_sales_items", pre=True)
    def parse_include_sales_items(cls, v):
        if isinstance(v, str):
            return v.lower() in ('true', '1', 'yes', 'on')
        return bool(v) if v is not None else True

    @validator("category_ids")
    def product_ids_or_category_ids_but_not_both(cls, v, values):
        product_ids = values.get("product_ids")
        if v and product_ids:
            raise ValueError("product_ids or category_ids but not both")
        return v


class GetSalesDataResponse(BaseModel):
    ...
