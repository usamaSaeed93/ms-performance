from typing import List, Optional
from pydantic import BaseModel

class SettingSchema(BaseModel):
    key: str
    value: Optional[str] = None
    description: Optional[str] = None
    type: str = "string"
    
    class Config:
        from_attributes = True

class GetSettingsResponse(BaseModel):
    settings: List[SettingSchema]

class UpdateSettingRequest(BaseModel):
    value: str
    description: Optional[str] = None
    type: Optional[str] = None

class UpdateSettingResponse(BaseModel):
    setting: SettingSchema
    message: str
