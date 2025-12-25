from fastapi import status

import crud
from api.base_resource import DeleteResource
from ..schemas.delete_tax_class import DeleteTaxClassRequest, DeleteTaxClassResponse


class DeleteTaxClass(DeleteResource):
    request_schema = DeleteTaxClassRequest
    response_schema = DeleteTaxClassResponse
    authentication_required = True

    api_name = "delete_tax_class"
    api_url = "delete_tax_class"

    async def check_if_tax_class_exists(self):
        self.tax_class = await crud.tax_class.get(self.db, id=self.request_data.id)
        if not self.tax_class:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Tax class not found"
            self.response_data = {}

    async def delete_tax_class(self):
        await crud.tax_class.remove(self.db, id=self.request_data.id)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax class deleted successfully"
        self.response_data = {"message": "Tax class deleted successfully"}

    async def process_flow(self):
        await self.check_if_tax_class_exists()
        if self.early_response:
            return
        await self.delete_tax_class()
        await self.generate_response()

