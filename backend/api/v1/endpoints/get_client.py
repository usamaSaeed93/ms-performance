from fastapi import status, HTTPException
from api.base_resource import GetResource
from crud import client as crud_client
from ..schemas.clients import ClientSchema


class GetClient(GetResource):
    response_schema = ClientSchema
    authentication_required = False

    api_name = "get_client"
    api_url = "clients/{client_id}"

    async def fetch_client(self):
        client_id = self.request.path_params.get("client_id")
        if not client_id:
            raise HTTPException(status_code=400, detail="Client ID is required")
        self.client = await crud_client.get_client(self.db, client_id=int(client_id))
        if not self.client:
            raise HTTPException(status_code=404, detail="Client not found")

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = self.client

    async def process_flow(self):
        await self.fetch_client()
        await self.generate_response()
