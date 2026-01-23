from fastapi import status
from api.base_resource import GetResource
from crud import service as crud_service
from ..schemas.services import GetServicesResponse

class GetServices(GetResource):
    response_schema = GetServicesResponse
    authentication_required = False # Or True if needed, but homepage is public
    
    api_name = "get_services"
    api_url = "services" # GET /v1/services

    async def get_services_list(self):
        self.services = await crud_service.get_services(self.db)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "services": self.services
        }

    async def process_flow(self):
        await self.get_services_list()
        await self.generate_response()
