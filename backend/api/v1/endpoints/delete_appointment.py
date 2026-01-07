from fastapi import status

from api.base_resource import DeleteResource, PutResource
from crud.appointment import delete_appointment, update_appointment_status


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
        
        valid_statuses = ["confirmed", "completed", "cancelled"]
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
        
        self.appointment = await update_appointment_status(self.db, appointment_id, new_status)
        
        if not self.appointment:
            self.status_code = status.HTTP_404_NOT_FOUND
            self.success = False
            self.response_message = "Appointment not found"
            self.response_data = {}
            return False
        
        return True

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
