from fastapi import status, HTTPException
from api.base_resource import PutResource
from crud import client as crud_client
from ..schemas.clients import UpdateClientRequest, UpdateClientResponse


class UpdateClient(PutResource):
    request_schema = UpdateClientRequest
    response_schema = UpdateClientResponse
    authentication_required = True

    api_name = "update_client"
    api_url = "clients/{client_id}"

    async def update_client_data(self):
        client_id = self.request.path_params.get("client_id")
        if not client_id:
            raise HTTPException(status_code=400, detail="Client ID is required")

        self.client = await crud_client.update_client(
            self.db,
            client_id=int(client_id),
            name=self.request_data.name,
            details=self.request_data.details,
            image_url=self.request_data.image_url,
            display_order=self.request_data.display_order,
            is_active=self.request_data.is_active,
        )
        if not self.client:
            raise HTTPException(status_code=404, detail="Client not found")

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {
            "client": self.client,
            "message": "Client updated successfully",
        }

    async def process_flow(self):
        await self.update_client_data()
        await self.generate_response()
