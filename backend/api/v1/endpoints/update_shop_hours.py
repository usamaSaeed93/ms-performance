from fastapi import status
from datetime import time

from api.base_resource import PutResource
from crud.appointment import bulk_update_shop_hours
from api.v1.schemas.appointment import ShopHoursBase


class UpdateShopHours(PutResource):
    """Update shop hours configuration (admin only)."""
    api_name = "update_shop_hours"
    api_url = "shop-hours"
    authentication_required = False  # TODO: Set to True and add admin check

    async def update_hours(self):
        hours_data = self.request.state.data.get("hours", [])
        if not hours_data:
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.success = False
            self.response_message = "No hours data provided"
            self.response_data = {}
            return False
        
        # Convert string times to time objects
        parsed_hours = []
        for hour in hours_data:
            open_time = None
            close_time = None
            
            if hour.get("open_time"):
                if isinstance(hour["open_time"], str):
                    open_time = time.fromisoformat(hour["open_time"])
                else:
                    open_time = hour["open_time"]
            
            if hour.get("close_time"):
                if isinstance(hour["close_time"], str):
                    close_time = time.fromisoformat(hour["close_time"])
                else:
                    close_time = hour["close_time"]
            
            parsed_hours.append(ShopHoursBase(
                day_of_week=hour["day_of_week"],
                is_open=hour.get("is_open", True),
                open_time=open_time,
                close_time=close_time,
                slot_duration_minutes=hour.get("slot_duration_minutes", 30)
            ))
        
        self.result = await bulk_update_shop_hours(self.db, parsed_hours)
        return True

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Shop hours updated successfully"
        self.response_data = {
            "hours": [
                {
                    "id": h.id,
                    "day_of_week": h.day_of_week,
                    "is_open": h.is_open,
                    "open_time": h.open_time.isoformat() if h.open_time else None,
                    "close_time": h.close_time.isoformat() if h.close_time else None,
                    "slot_duration_minutes": h.slot_duration_minutes
                }
                for h in self.result
            ]
        }

    async def process_flow(self):
        success = await self.update_hours()
        if success:
            await self.generate_response()
