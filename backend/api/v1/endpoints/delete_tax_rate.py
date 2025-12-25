from fastapi import status

import crud
from api.base_resource import DeleteResource
from ..schemas.delete_tax_rate import DeleteTaxRateRequest, DeleteTaxRateResponse


class DeleteTaxRate(DeleteResource):
    request_schema = DeleteTaxRateRequest
    response_schema = DeleteTaxRateResponse
    authentication_required = True

    api_name = "delete_tax_rate"
    api_url = "delete_tax_rate"

    async def check_if_tax_rate_exists(self):
        self.tax_rate = await crud.tax_rate.get(self.db, id=self.request_data.id)
        if not self.tax_rate:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Tax rate not found"
            self.response_data = {}

    async def delete_tax_rate(self):
        await crud.tax_rate.remove(self.db, id=self.request_data.id)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax rate deleted successfully"
        self.response_data = {"message": "Tax rate deleted successfully"}

    async def process_flow(self):
        await self.check_if_tax_rate_exists()
        if self.early_response:
            return
        await self.delete_tax_rate()
        await self.generate_response()

