from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date, time, datetime, timedelta
import pytz

from models.appointment import ShopHours, Appointment


async def get_all_shop_hours(db: AsyncSession) -> List[ShopHours]:
    """Get all shop hours, creating defaults if none exist."""
    async with db as session:
        stmt = select(ShopHours).order_by(ShopHours.day_of_week)
        result = await session.execute(stmt)
        hours = list(result.scalars().all())
        
        if not hours:
            # Create default shop hours (Mon-Fri 9-5, closed weekends)
            default_hours = []
            for day in range(7):
                is_weekday = day < 5
                shop_hour = ShopHours(
                    day_of_week=day,
                    is_open=is_weekday,
                    open_time=time(9, 0) if is_weekday else None,
                    close_time=time(17, 0) if is_weekday else None,
                    slot_duration_minutes=30
                )
                session.add(shop_hour)
                default_hours.append(shop_hour)
            await session.commit()
            for h in default_hours:
                await session.refresh(h)
            return default_hours
        
        return hours


async def get_shop_hours_for_day(db: AsyncSession, day_of_week: int) -> Optional[ShopHours]:
    """Get shop hours for a specific day."""
    async with db as session:
        stmt = select(ShopHours).filter(ShopHours.day_of_week == day_of_week)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()


async def update_shop_hours(db: AsyncSession, day_of_week: int, is_open: bool = None, 
                            open_time: time = None, close_time: time = None,
                            slot_duration_minutes: int = None) -> ShopHours:
    """Update shop hours for a specific day."""
    async with db as session:
        stmt = select(ShopHours).filter(ShopHours.day_of_week == day_of_week)
        result = await session.execute(stmt)
        shop_hour = result.scalar_one_or_none()
        
        if not shop_hour:
            shop_hour = ShopHours(day_of_week=day_of_week)
            session.add(shop_hour)
        
        if is_open is not None:
            shop_hour.is_open = is_open
        if open_time is not None:
            shop_hour.open_time = open_time
        if close_time is not None:
            shop_hour.close_time = close_time
        if slot_duration_minutes is not None:
            shop_hour.slot_duration_minutes = slot_duration_minutes
        
        await session.commit()
        await session.refresh(shop_hour)
        return shop_hour


async def bulk_update_shop_hours(db: AsyncSession, hours_data: list) -> List[ShopHours]:
    """Update all shop hours at once."""
    result = []
    for hour_data in hours_data:
        shop_hour = await update_shop_hours(
            db,
            day_of_week=hour_data.day_of_week,
            is_open=hour_data.is_open,
            open_time=hour_data.open_time,
            close_time=hour_data.close_time,
            slot_duration_minutes=hour_data.slot_duration_minutes
        )
        result.append(shop_hour)
    return result


# Shop timezone - Chelmsford, UK
SHOP_TIMEZONE = pytz.timezone("Europe/London")


def _get_shop_now() -> datetime:
    """Get the current datetime in the shop's timezone (Europe/London)."""
    return datetime.now(pytz.utc).astimezone(SHOP_TIMEZONE)


def _get_shop_today() -> date:
    """Get today's date in the shop's timezone."""
    return _get_shop_now().date()


async def get_available_slots(db: AsyncSession, target_date: date) -> dict:
    """Get available time slots for a specific date."""
    day_of_week = target_date.weekday()
    shop_hours = await get_shop_hours_for_day(db, day_of_week)
    
    if not shop_hours or not shop_hours.is_open:
        return {"date": target_date, "slots": [], "is_open": False}
    
    # Generate all possible slots
    slots = []
    current_time = datetime.combine(target_date, shop_hours.open_time)
    end_time = datetime.combine(target_date, shop_hours.close_time)
    slot_duration = timedelta(minutes=shop_hours.slot_duration_minutes)
    
    # Get existing appointments for this date
    async with db as session:
        stmt = select(Appointment).filter(
            and_(
                Appointment.appointment_date == target_date,
                Appointment.status != "cancelled"
            )
        )
        result = await session.execute(stmt)
        existing_appointments = list(result.scalars().all())
    
    booked_times = {appt.appointment_time for appt in existing_appointments}
    
    # Use shop timezone for "today" and "now" comparisons
    shop_today = _get_shop_today()
    shop_now_time = _get_shop_now().time()
    
    # Generate slots
    while current_time + slot_duration <= end_time:
        slot_time = current_time.time()
        is_available = slot_time not in booked_times
        
        # Don't show past slots for today (using shop's local time)
        if target_date == shop_today:
            if slot_time <= shop_now_time:
                is_available = False
        
        slots.append({
            "time": slot_time,
            "available": is_available
        })
        current_time += slot_duration
    
    return {"date": target_date, "slots": slots, "is_open": True}


async def create_appointment(db: AsyncSession, appointment_data: dict) -> Appointment:
    """Create a new appointment."""
    async with db as session:
        appointment = Appointment(**appointment_data)
        session.add(appointment)
        await session.commit()
        await session.refresh(appointment)
        return appointment


async def get_appointments(db: AsyncSession, status: str = None, 
                           from_date: date = None, to_date: date = None,
                           skip: int = 0, limit: int = 100) -> tuple:
    """Get appointments with optional filtering."""
    async with db as session:
        stmt = select(Appointment)
        
        if status:
            stmt = stmt.filter(Appointment.status == status)
        if from_date:
            stmt = stmt.filter(Appointment.appointment_date >= from_date)
        if to_date:
            stmt = stmt.filter(Appointment.appointment_date <= to_date)
        
        # Get total count
        count_stmt = select(Appointment)
        if status:
            count_stmt = count_stmt.filter(Appointment.status == status)
        if from_date:
            count_stmt = count_stmt.filter(Appointment.appointment_date >= from_date)
        if to_date:
            count_stmt = count_stmt.filter(Appointment.appointment_date <= to_date)
        count_result = await session.execute(count_stmt)
        total = len(list(count_result.scalars().all()))
        
        stmt = stmt.order_by(
            Appointment.appointment_date.desc(),
            Appointment.appointment_time.desc()
        ).offset(skip).limit(limit)
        
        result = await session.execute(stmt)
        appointments = list(result.scalars().all())
        
        return appointments, total


async def get_appointment_by_id(db: AsyncSession, appointment_id: int) -> Optional[Appointment]:
    """Get a single appointment by ID."""
    async with db as session:
        stmt = select(Appointment).filter(Appointment.id == appointment_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()


async def update_appointment_status(db: AsyncSession, appointment_id: int, status: str) -> Optional[Appointment]:
    """Update appointment status."""
    async with db as session:
        stmt = select(Appointment).filter(Appointment.id == appointment_id)
        result = await session.execute(stmt)
        appointment = result.scalar_one_or_none()
        if appointment:
            appointment.status = status
            await session.commit()
            await session.refresh(appointment)
        return appointment


async def delete_appointment(db: AsyncSession, appointment_id: int) -> bool:
    """Cancel an appointment (soft delete by setting status)."""
    async with db as session:
        stmt = select(Appointment).filter(Appointment.id == appointment_id)
        result = await session.execute(stmt)
        appointment = result.scalar_one_or_none()
        if appointment:
            appointment.status = "cancelled"
            await session.commit()
            return True
        return False


async def is_slot_available(db: AsyncSession, target_date: date, target_time: time) -> bool:
    """Check if a specific slot is available."""
    async with db as session:
        stmt = select(Appointment).filter(
            and_(
                Appointment.appointment_date == target_date,
                Appointment.appointment_time == target_time,
                Appointment.status != "cancelled"
            )
        )
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        return existing is None
