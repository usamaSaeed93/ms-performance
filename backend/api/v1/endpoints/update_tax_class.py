from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_tax_class import UpdateTaxClassRequest, UpdateTaxClassResponse


class UpdateTaxClass(PutResource):
    request_schema = UpdateTaxClassRequest
    response_schema = UpdateTaxClassResponse
    authentication_required = True

    api_name = "update_tax_class"
    api_url = "update_tax_class"

    async def check_if_tax_class_exists(self):
        self.tax_class = await crud.tax_class.get(self.db, id=self.request_data.id)
        if not self.tax_class:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Tax class not found"
            self.response_data = {}

    async def update_tax_class(self):
        update_data = self.request_data.model_dump(exclude={"id"}, exclude_unset=True)
        self.tax_class = await crud.tax_class.update(
            self.db, db_obj=self.tax_class, obj_in=update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax class updated successfully"
        self.response_data = self.tax_class.to_dict()

    async def process_flow(self):
        await self.check_if_tax_class_exists()
        if self.early_response:
            return
        await self.update_tax_class()
        await self.generate_response()

