from pydantic import BaseModel

from common.schemas import PaginatedRequest
from crud.schemas import TaxClass


class GetTaxClassesRequest(PaginatedRequest):
    search: str | None = None


class GetTaxClassesResponse(BaseModel):
    tax_classes: list[TaxClass]

