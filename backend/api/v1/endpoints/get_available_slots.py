from fastapi import status
from datetime import datetime, date

from api.base_resource import GetResource
from crud.appointment import get_available_slots, _get_shop_today


class GetAvailableSlots(GetResource):
    """Get available appointment slots for a specific date."""
    api_name = "get_available_slots"
    api_url = "available-slots"
    authentication_required = False

    async def fetch_slots(self):
        date_str = self.request.query_params.get("date")
        
        if not date_str:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Date parameter is required (format: YYYY-MM-DD)"
            self.response_data = {}
            return False
        
        try:
            self.target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Invalid date format. Use YYYY-MM-DD"
            self.response_data = {}
            return False
        
        # Don't allow booking in the past (using shop's local timezone)
        if self.target_date < _get_shop_today():
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "Cannot view slots for past dates"
            self.response_data = {}
            return False
        
        self.result = await get_available_slots(self.db, self.target_date)
        return True

    async def generate_response(self):
        # Convert time objects to strings
        slots = []
        for slot in self.result["slots"]:
            slots.append({
                "time": slot["time"].isoformat(),
                "available": slot["available"]
            })
        
        self.status_code = status.HTTP_200_OK
        self.response_message = "Available slots retrieved successfully"
        self.response_data = {
            "date": self.result["date"].isoformat(),
            "slots": slots,
            "is_open": self.result["is_open"]
        }

    async def process_flow(self):
        success = await self.fetch_slots()
        if success:
            await self.generate_response()
