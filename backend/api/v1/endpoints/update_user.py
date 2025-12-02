from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_user import UpdateUserRequest, UpdateUserResponse


class UpdateUser(PutResource):
    request_schema = UpdateUserRequest
    response_schema = UpdateUserResponse
    authentication_required = True

    api_name = "update_user"
    api_url = "update_user"

    async def check_if_user_exists(self):
        self.user = await crud.user.get(self.db, id=self.request_data.user_id)
        if not self.user:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "User not found"
            self.response_data = {}

    async def update_user(self):
        update_data = self.request_data.model_dump(exclude={"user_id"}, exclude_unset=True)
        self.user = await crud.user.update(
            self.db, db_obj=self.user, obj_in=update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "User updated successfully"
        self.response_data = self.user.to_dict()

    async def process_flow(self):
        await self.check_if_user_exists()
        if self.early_response:
            return
        await self.update_user()
        await self.generate_response()

