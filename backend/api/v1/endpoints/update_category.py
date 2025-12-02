from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_category import UpdateCategoryRequest, UpdateCategoryResponse


class UpdateCategory(PutResource):
    request_schema = UpdateCategoryRequest
    response_schema = UpdateCategoryResponse
    authentication_required = True

    api_name = "update_category"
    api_url = "update_category"

    async def check_if_category_exists(self):
        self.category = await crud.category.get(self.db, id=self.request_data.category_id)
        if not self.category:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Category not found"
            self.response_data = {}

    async def update_category(self):
        update_data = self.request_data.model_dump(exclude={"category_id"}, exclude_unset=True)
        self.category = await crud.category.update(
            self.db, db_obj=self.category, obj_in=update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Category updated successfully"
        self.response_data = self.category.to_dict()

    async def process_flow(self):
        await self.check_if_category_exists()
        if self.early_response:
            return
        await self.update_category()
        await self.generate_response()

