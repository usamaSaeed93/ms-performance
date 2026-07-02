from fastapi import status
from api.base_resource import GetResource
from crud import client as crud_client
from ..schemas.clients import GetClientsResponse


class GetAllClients(GetResource):
    """Admin endpoint — returns all clients including inactive ones."""
    response_schema = GetClientsResponse
    authentication_required = True

    api_name = "get_all_clients"
    api_url = "admin/clients"

    async def get_clients_list(self):
        self.clients = await crud_client.get_all_clients(self.db)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {"clients": self.clients}

    async def process_flow(self):
        await self.get_clients_list()
        await self.generate_response()
