from fastapi import status
from api.base_resource import GetResource
from crud import setting as crud_setting
from ..schemas.settings import GetSettingsResponse

class GetSettings(GetResource):
    response_schema = GetSettingsResponse
    authentication_required = True # Admin only likely
    
    api_name = "get_settings"
    api_url = "settings" # GET /v1/settings

    async def get_settings_list(self):
        self.settings = await crud_setting.get_all_settings(self.db)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "settings": self.settings
        }

    async def process_flow(self):
        await self.get_settings_list()
        await self.generate_response()
