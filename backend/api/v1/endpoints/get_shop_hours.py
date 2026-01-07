from fastapi import status

from api.base_resource import GetResource
from crud.appointment import get_all_shop_hours


class GetShopHours(GetResource):
    """Get shop hours configuration."""
    api_name = "get_shop_hours"
    api_url = "shop-hours"
    authentication_required = False

    async def fetch_hours(self):
        self.hours = await get_all_shop_hours(self.db)

    async def generate_response(self):
        result = []
        for hour in self.hours:
            result.append({
                "id": hour.id,
                "day_of_week": hour.day_of_week,
                "is_open": hour.is_open,
                "open_time": hour.open_time.isoformat() if hour.open_time else None,
                "close_time": hour.close_time.isoformat() if hour.close_time else None,
                "slot_duration_minutes": hour.slot_duration_minutes
            })
        
        self.status_code = status.HTTP_200_OK
        self.response_message = "Shop hours retrieved successfully"
        self.response_data = {"hours": result}

    async def process_flow(self):
        await self.fetch_hours()
        await self.generate_response()
