from pydantic import BaseModel
from typing import Optional

from common.schemas import PaginatedRequest
from crud.schemas import TaxRate


class GetTaxRatesRequest(PaginatedRequest):
    search: str | None = None
    tax_class_id: Optional[int] = None
    country_code: Optional[str] = None


class GetTaxRatesResponse(BaseModel):
    tax_rates: list[TaxRate]

