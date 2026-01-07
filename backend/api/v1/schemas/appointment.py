from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time, datetime


# Shop Hours Schemas
class ShopHoursBase(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6, description="0=Monday, 6=Sunday")
    is_open: bool = True
    open_time: Optional[time] = None
    close_time: Optional[time] = None
    slot_duration_minutes: int = 30


class ShopHoursCreate(ShopHoursBase):
    pass


class ShopHoursUpdate(BaseModel):
    is_open: Optional[bool] = None
    open_time: Optional[time] = None
    close_time: Optional[time] = None
    slot_duration_minutes: Optional[int] = None


class ShopHoursResponse(ShopHoursBase):
    id: int

    class Config:
        from_attributes = True


class ShopHoursBulkUpdate(BaseModel):
    hours: List[ShopHoursBase]


# Appointment Schemas
class AppointmentCreate(BaseModel):
    appointment_date: date
    appointment_time: time
    customer_name: str = Field(..., min_length=2, max_length=255)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=5, max_length=50)
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_registration: Optional[str] = None
    service_type: str = Field(..., min_length=2, max_length=100)
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    appointment_date: date
    appointment_time: time
    customer_name: str
    customer_email: str
    customer_phone: str
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_registration: Optional[str] = None
    service_type: str
    notes: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AppointmentListResponse(BaseModel):
    appointments: List[AppointmentResponse]
    total: int


# Available Slots Schemas
class TimeSlot(BaseModel):
    time: time
    available: bool = True


class AvailableSlotsResponse(BaseModel):
    date: date
    slots: List[TimeSlot]
    is_open: bool
