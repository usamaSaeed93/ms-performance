from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_users import GetUsersRequest, GetUsersResponse


class GetUsers(GetResource):
    request_schema = GetUsersRequest
    response_schema = GetUsersResponse
    authentication_required = True

    # Endpoint details
    api_name = "get_users"
    api_url = "get_users"

    async def get_users(self):
        self.users = await crud.user.get_multi(
            self.db,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Users retrieved successfully"
        self.response_data = {"users": [x.to_dict() for x in self.users]}

    async def process_flow(self):
        await self.get_users()
        await self.generate_response()

