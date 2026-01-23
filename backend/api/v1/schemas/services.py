from typing import List, Optional
from pydantic import BaseModel

class ServiceSchema(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int
    
    class Config:
        from_attributes = True

class GetServicesResponse(BaseModel):
    services: List[ServiceSchema]

class UpdateServiceRequest(BaseModel):
    image_url: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None

class UpdateServiceResponse(BaseModel):
    service: ServiceSchema
    message: str
