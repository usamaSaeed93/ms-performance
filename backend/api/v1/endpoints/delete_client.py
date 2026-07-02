from fastapi import status
from api.base_resource import PostResource
from crud import client as crud_client
from ..schemas.clients import DeleteClientRequest, DeleteClientResponse


class DeleteClient(PostResource):
    request_schema = DeleteClientRequest
    response_schema = DeleteClientResponse
    authentication_required = True

    api_name = "delete_client"
    api_url = "delete_client"

    async def check_and_delete(self):
        deleted = await crud_client.delete_client(self.db, client_id=self.request_data.client_id)
        if not deleted:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Client not found"
            self.response_data = {"success": False}

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Client deleted successfully"
        self.response_data = {"success": True}

    async def process_flow(self):
        await self.check_and_delete()
        if self.early_response:
            return
        await self.generate_response()
