from fastapi import status
from datetime import datetime, date, time
import asyncio

from api.base_resource import PostResource
from crud.appointment import create_appointment, is_slot_available, get_shop_hours_for_day
from core.email import email_service


class CreateAppointment(PostResource):
    """Create a new appointment."""
    api_name = "create_appointment"
    api_url = "appointments"
    authentication_required = True  # Only authenticated users can book

    async def create_booking(self):
        data = self.request.state.data
        
        # Parse date and time
        appointment_date_str = data.get("appointment_date")
        appointment_time_str = data.get("appointment_time")
        
        if not appointment_date_str or not appointment_time_str:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Date and time are required"
            self.response_data = {}
            return False
        
        try:
            appt_date = datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
            try:
                appt_time = datetime.strptime(appointment_time_str, "%H:%M:%S").time()
            except ValueError:
                appt_time = datetime.strptime(appointment_time_str, "%H:%M").time()
        except ValueError:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Invalid date or time format"
            self.response_data = {}
            return False
        
        # Validate date is not in the past
        if appt_date < date.today():
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Cannot book appointments in the past"
            self.response_data = {}
            return False
        
        # Check if shop is open on this day
        day_of_week = appt_date.weekday()
        shop_hours = await get_shop_hours_for_day(self.db, day_of_week)
        if not shop_hours or not shop_hours.is_open:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Shop is closed on this day"
            self.response_data = {}
            return False
        
        # Check if slot is within business hours
        if shop_hours.open_time and shop_hours.close_time:
            if appt_time < shop_hours.open_time or appt_time >= shop_hours.close_time:
                self.status_code = status.HTTP_400_BAD_REQUEST
                self.success = False
                self.response_message = "Selected time is outside business hours"
                self.response_data = {}
                return False
        
        # Check slot availability
        if not await is_slot_available(self.db, appt_date, appt_time):
            self.status_code = status.HTTP_409_CONFLICT
            self.success = False
            self.response_message = "This time slot is no longer available"
            self.response_data = {}
            return False
        
        # Create the appointment
        appointment_data = {
            "appointment_date": appt_date,
            "appointment_time": appt_time,
            "customer_name": data.get("customer_name"),
            "customer_email": data.get("customer_email"),
            "customer_phone": data.get("customer_phone"),
            "vehicle_make": data.get("vehicle_make"),
            "vehicle_model": data.get("vehicle_model"),
            "vehicle_registration": data.get("vehicle_registration"),
            "service_type": data.get("service_type"),
            "notes": data.get("notes"),
            "status": "confirmed"
        }
        
        self.appointment = await create_appointment(self.db, appointment_data)
        
        # Send confirmation email
        try:
            asyncio.create_task(self._send_confirmation_email())
        except Exception as e:
            print(f"Failed to queue confirmation email: {e}")
        
        return True
    
    async def _send_confirmation_email(self):
        """Send appointment confirmation email."""
        try:
            await email_service.send_appointment_confirmation_email(
                to_email=self.appointment.customer_email,
                customer_name=self.appointment.customer_name,
                appointment_date=self.appointment.appointment_date.strftime("%A, %B %d, %Y"),
                appointment_time=self.appointment.appointment_time.strftime("%I:%M %p"),
                service_type=self.appointment.service_type,
                vehicle_info=f"{self.appointment.vehicle_make} {self.appointment.vehicle_model}" if self.appointment.vehicle_make else None
            )
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")

    async def generate_response(self):
        self.status_code = status.HTTP_201_CREATED
        self.response_message = "Appointment booked successfully"
        self.response_data = {
            "appointment": {
                "id": self.appointment.id,
                "appointment_date": self.appointment.appointment_date.isoformat(),
                "appointment_time": self.appointment.appointment_time.isoformat(),
                "customer_name": self.appointment.customer_name,
                "customer_email": self.appointment.customer_email,
                "service_type": self.appointment.service_type,
                "status": self.appointment.status
            }
        }

    async def process_flow(self):
        success = await self.create_booking()
        if success:
            await self.generate_response()
