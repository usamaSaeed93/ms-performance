from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class ServiceSchema(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    link: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int
    page_content: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class GetServicesResponse(BaseModel):
    services: List[ServiceSchema]

class UpdateServiceRequest(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None
    page_content: Optional[Dict[str, Any]] = None

class UpdateServiceResponse(BaseModel):
    service: ServiceSchema
    message: str
