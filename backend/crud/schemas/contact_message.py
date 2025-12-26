from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageUpdate(ContactMessageBase):
    is_read: Optional[bool] = None

class ContactMessage(ContactMessageBase):
    id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
