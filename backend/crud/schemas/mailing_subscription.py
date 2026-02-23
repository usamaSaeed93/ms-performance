from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class MailingSubscriptionBase(BaseModel):
    name: str
    email: EmailStr


class MailingSubscriptionCreate(MailingSubscriptionBase):
    pass


class MailingSubscriptionUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class MailingSubscription(MailingSubscriptionBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
