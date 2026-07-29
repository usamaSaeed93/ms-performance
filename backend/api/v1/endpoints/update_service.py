from fastapi import status, HTTPException
from api.base_resource import PutResource
from crud import service as crud_service
from ..schemas.services import UpdateServiceRequest, UpdateServiceResponse

class UpdateService(PutResource):
    request_schema = UpdateServiceRequest
    response_schema = UpdateServiceResponse
    authentication_required = True 
    
    api_name = "update_service"
    api_url = "services/{service_id}" # PUT /v1/services/{id}

    async def update_service_data(self):
        service_id = self.request.path_params.get("service_id")
        if not service_id:
             raise HTTPException(status_code=400, detail="Service ID is required")
             
        self.service = await crud_service.update_service(
            self.db,
            service_id=int(service_id),
            title=self.request_data.title,
            image_url=self.request_data.image_url,
            link=self.request_data.link,
            description=self.request_data.description,
            page_content=self.request_data.page_content,
        )
        if not self.service:
            raise HTTPException(status_code=404, detail="Service not found")

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "service": self.service,
            "message": "Service updated successfully"
        }

    async def process_flow(self):
        await self.update_service_data()
        await self.generate_response()
