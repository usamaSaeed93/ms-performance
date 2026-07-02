from typing import List, Optional
from pydantic import BaseModel


class ClientSchema(BaseModel):
    id: int
    name: str
    details: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int
    is_active: bool

    class Config:
        from_attributes = True


# GET
class GetClientsResponse(BaseModel):
    clients: List[ClientSchema]


# CREATE
class CreateClientRequest(BaseModel):
    name: str
    details: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class CreateClientResponse(BaseModel):
    client: ClientSchema
    message: str


# UPDATE
class UpdateClientRequest(BaseModel):
    name: Optional[str] = None
    details: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class UpdateClientResponse(BaseModel):
    client: ClientSchema
    message: str


# DELETE
class DeleteClientRequest(BaseModel):
    client_id: int


class DeleteClientResponse(BaseModel):
    success: bool
    message: str
