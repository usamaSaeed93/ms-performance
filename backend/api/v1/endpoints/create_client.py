from fastapi import status
from api.base_resource import PutResource
from crud import client as crud_client
from ..schemas.clients import CreateClientRequest, CreateClientResponse


class CreateClient(PutResource):
    request_schema = CreateClientRequest
    response_schema = CreateClientResponse
    authentication_required = True

    api_name = "create_client"
    api_url = "clients"

    async def create_client_record(self):
        self.client = await crud_client.create_client(
            self.db,
            name=self.request_data.name,
            details=self.request_data.details,
            image_url=self.request_data.image_url,
            display_order=self.request_data.display_order,
            is_active=self.request_data.is_active,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_201_CREATED
        self.response_data = {
            "client": self.client,
            "message": "Client created successfully",
        }

    async def process_flow(self):
        await self.create_client_record()
        await self.generate_response()
