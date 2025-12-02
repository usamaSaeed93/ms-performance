from pydantic import BaseModel
from common.schemas import PaginatedRequest
from crud.schemas.discount import Discount


class GetDiscountsRequest(PaginatedRequest):
    pass


class GetDiscountsResponse(BaseModel):
    discounts: list[Discount]

