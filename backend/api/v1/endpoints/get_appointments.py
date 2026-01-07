from fastapi import status
from datetime import datetime

from api.base_resource import GetResource
from crud.appointment import get_appointments


class GetAppointments(GetResource):
    """Get all appointments (admin only)."""
    api_name = "get_appointments"
    api_url = "appointments"
    authentication_required = False  # TODO: Set to True and add admin check

    async def fetch_appointments(self):
        status_filter = self.request.query_params.get("status")
        from_date_str = self.request.query_params.get("from_date")
        to_date_str = self.request.query_params.get("to_date")
        page = int(self.request.query_params.get("page", 1))
        per_page = int(self.request.query_params.get("per_page", 20))
        
        from_date = None
        to_date = None
        
        if from_date_str:
            try:
                from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        if to_date_str:
            try:
                to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        skip = (page - 1) * per_page
        self.appointments, self.total = await get_appointments(
            self.db, 
            status=status_filter,
            from_date=from_date,
            to_date=to_date,
            skip=skip,
            limit=per_page
        )
        self.page = page
        self.per_page = per_page

    async def generate_response(self):
        result = []
        for appt in self.appointments:
            result.append({
                "id": appt.id,
                "appointment_date": appt.appointment_date.isoformat(),
                "appointment_time": appt.appointment_time.isoformat(),
                "customer_name": appt.customer_name,
                "customer_email": appt.customer_email,
                "customer_phone": appt.customer_phone,
                "vehicle_make": appt.vehicle_make,
                "vehicle_model": appt.vehicle_model,
                "vehicle_registration": appt.vehicle_registration,
                "service_type": appt.service_type,
                "notes": appt.notes,
                "status": appt.status,
                "created_at": appt.created_at.isoformat() if appt.created_at else None
            })
        
        self.status_code = status.HTTP_200_OK
        self.response_message = "Appointments retrieved successfully"
        self.response_data = {
            "appointments": result,
            "total": self.total,
            "page": self.page,
            "per_page": self.per_page,
            "total_pages": (self.total + self.per_page - 1) // self.per_page
        }

    async def process_flow(self):
        await self.fetch_appointments()
        await self.generate_response()
