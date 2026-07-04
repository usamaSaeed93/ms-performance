import asyncio
from fastapi import status

from api.base_resource import DeleteResource, PutResource
from crud.appointment import (
    delete_appointment,
    update_appointment_status,
    get_appointment_by_id,
)
from core.email import email_service
from core.google_calendar import google_calendar


class DeleteAppointment(DeleteResource):
    """Cancel an appointment."""
    api_name = "delete_appointment"
    api_url = "appointments/{appointment_id}"
    authentication_required = False

    async def cancel_appointment(self):
        appointment_id = self.request.path_params.get("appointment_id")
        
        if not appointment_id:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Appointment ID is required"
            self.response_data = {}
            return False
        
        try:
            appointment_id = int(appointment_id)
        except ValueError:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Invalid appointment ID"
            self.response_data = {}
            return False
        
        success = await delete_appointment(self.db, appointment_id)
        
        if not success:
            self.status_code = status.HTTP_404_NOT_FOUND
            self.success = False
            self.response_message = "Appointment not found"
            self.response_data = {}
            return False
        
        return True

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Appointment cancelled successfully"
        self.response_data = {}

    async def process_flow(self):
        success = await self.cancel_appointment()
        if success:
            await self.generate_response()


class UpdateAppointmentStatus(PutResource):
    """Update appointment status."""
    api_name = "update_appointment_status"
    api_url = "appointments/{appointment_id}/status"
    authentication_required = False

    async def update_status(self):
        appointment_id = self.request.path_params.get("appointment_id")
        new_status = self.request.state.data.get("status")
        
        if not appointment_id:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Appointment ID is required"
            self.response_data = {}
            return False
        
        if not new_status:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Status is required"
            self.response_data = {}
            return False
        
        valid_statuses = ["pending", "confirmed", "denied", "completed", "cancelled"]
        if new_status not in valid_statuses:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            self.response_data = {}
            return False
        
        try:
            appointment_id = int(appointment_id)
        except ValueError:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Invalid appointment ID"
            self.response_data = {}
            return False

        # Fetch the appointment before updating so we have the full data for emails/Setmore
        self.old_appointment = await get_appointment_by_id(self.db, appointment_id)
        if not self.old_appointment:
            self.status_code = status.HTTP_404_NOT_FOUND
            self.success = False
            self.response_message = "Appointment not found"
            self.response_data = {}
            return False

        self.new_status = new_status
        self.appointment = await update_appointment_status(self.db, appointment_id, new_status)
        
        if not self.appointment:
            self.status_code = status.HTTP_404_NOT_FOUND
            self.success = False
            self.response_message = "Appointment not found"
            self.response_data = {}
            return False

        # Fire-and-forget side-effects (email + Setmore)
        try:
            asyncio.create_task(self._handle_status_side_effects())
        except Exception as exc:
            print(f"Failed to queue status side-effects: {exc}")
        
        return True

    async def _handle_status_side_effects(self):
        appt = self.appointment
        fmt_date = appt.appointment_date.strftime("%A, %B %d, %Y")
        fmt_time = appt.appointment_time.strftime("%I:%M %p")
        vehicle_info = None
        if appt.vehicle_make:
            vehicle_info = f"{appt.vehicle_make} {appt.vehicle_model or ''}".strip()

        if self.new_status == "confirmed":
            # 1. Send confirmation email to customer
            try:
                await email_service.send_appointment_confirmation_email(
                    to_email=appt.customer_email,
                    customer_name=appt.customer_name,
                    appointment_date=fmt_date,
                    appointment_time=fmt_time,
                    service_type=appt.service_type,
                    vehicle_info=vehicle_info,
                    customer_phone=appt.customer_phone,
                    notes=appt.notes,
                )
            except Exception as exc:
                print(f"Failed to send confirmation email: {exc}")

            # 2. Sync to Google Calendar
            try:
                from datetime import datetime, timezone
                appt_date = appt.appointment_date
                appt_time = appt.appointment_time
                start_dt = datetime(
                    appt_date.year, appt_date.month, appt_date.day,
                    appt_time.hour, appt_time.minute, appt_time.second,
                    tzinfo=timezone.utc,
                )
                end_dt = start_dt + __import__("datetime").timedelta(minutes=60)
                vehicle_str = ""
                if appt.vehicle_make:
                    vehicle_str = f"\nVehicle: {appt.vehicle_make} {appt.vehicle_model or ''}"
                    if appt.vehicle_registration:
                        vehicle_str += f" ({appt.vehicle_registration})"
                description = (
                    f"Customer: {appt.customer_name}\n"
                    f"Phone: {appt.customer_phone or 'N/A'}\n"
                    f"Email: {appt.customer_email}\n"
                    f"Service: {appt.service_type}"
                    f"{vehicle_str}"
                    f"{chr(10) + 'Notes: ' + appt.notes if appt.notes else ''}"
                )
                await google_calendar.create_event(
                    summary=f"{appt.service_type} — {appt.customer_name}",
                    description=description,
                    start_datetime=start_dt,
                    end_datetime=end_dt,
                    attendee_email=appt.customer_email,
                )
            except Exception as exc:
                print(f"Failed to sync to Google Calendar: {exc}")

        elif self.new_status == "denied":
            try:
                await email_service.send_appointment_denied_email(
                    to_email=appt.customer_email,
                    customer_name=appt.customer_name,
                    appointment_date=fmt_date,
                    appointment_time=fmt_time,
                    service_type=appt.service_type,
                )
            except Exception as exc:
                print(f"Failed to send denial email: {exc}")

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Appointment status updated"
        self.response_data = {
            "appointment": {
                "id": self.appointment.id,
                "status": self.appointment.status
            }
        }

    async def process_flow(self):
        success = await self.update_status()
        if success:
            await self.generate_response()
