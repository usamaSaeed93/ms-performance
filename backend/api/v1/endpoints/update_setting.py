from fastapi import status, HTTPException
from api.base_resource import PutResource
from crud import setting as crud_setting
from ..schemas.settings import UpdateSettingRequest, UpdateSettingResponse

class UpdateSetting(PutResource):
    request_schema = UpdateSettingRequest
    response_schema = UpdateSettingResponse
    authentication_required = True
    
    api_name = "update_setting"
    api_url = "settings/{key}" # PUT /v1/settings/{key}

    async def update_setting_data(self):
        key = self.request.path_params.get("key")
        if not key:
            raise HTTPException(status_code=400, detail="Setting key is required")
            
        self.setting = await crud_setting.set_setting(
            self.db,
            key=key,
            value=self.request_data.value,
            description=self.request_data.description,
            type=self.request_data.type
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "setting": self.setting,
            "message": "Setting updated successfully"
        }

    async def process_flow(self):
        await self.update_setting_data()
        await self.generate_response()
