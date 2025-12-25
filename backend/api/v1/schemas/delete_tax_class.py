from pydantic import BaseModel


class DeleteTaxClassRequest(BaseModel):
    id: int


class DeleteTaxClassResponse(BaseModel):
    message: str

