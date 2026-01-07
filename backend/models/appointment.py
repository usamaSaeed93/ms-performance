from sqlalchemy import Column, Integer, String, Time, Boolean, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from db.base_class import Base


class ShopHours(Base):
    """Weekly shop hours configuration."""
    __tablename__ = "shop_hours"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    is_open = Column(Boolean, default=True)
    open_time = Column(Time, nullable=True)  # e.g., 09:00
    close_time = Column(Time, nullable=True)  # e.g., 17:00
    slot_duration_minutes = Column(Integer, default=30)  # Duration of each slot
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Appointment(Base):
    """Customer appointment bookings."""
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    
    # Booking details
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    
    # Customer info
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    
    # Vehicle info
    vehicle_make = Column(String(100), nullable=True)
    vehicle_model = Column(String(100), nullable=True)
    vehicle_registration = Column(String(20), nullable=True)
    
    # Service info
    service_type = Column(String(100), nullable=False)  # e.g., "ECU Remapping", "Dyno Test"
    notes = Column(Text, nullable=True)
    
    # Status
    status = Column(String(50), default="confirmed")  # confirmed, completed, cancelled
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
