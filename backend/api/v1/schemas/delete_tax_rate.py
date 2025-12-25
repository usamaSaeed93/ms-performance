from pydantic import BaseModel


class DeleteTaxRateRequest(BaseModel):
    id: int


class DeleteTaxRateResponse(BaseModel):
    message: str

