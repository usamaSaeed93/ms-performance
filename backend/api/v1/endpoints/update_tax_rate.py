from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_tax_rate import UpdateTaxRateRequest, UpdateTaxRateResponse


class UpdateTaxRate(PutResource):
    request_schema = UpdateTaxRateRequest
    response_schema = UpdateTaxRateResponse
    authentication_required = True

    api_name = "update_tax_rate"
    api_url = "update_tax_rate"

    async def check_if_tax_rate_exists(self):
        self.tax_rate = await crud.tax_rate.get(self.db, id=self.request_data.id)
        if not self.tax_rate:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Tax rate not found"
            self.response_data = {}

    async def update_tax_rate(self):
        update_data = self.request_data.model_dump(exclude={"id"}, exclude_unset=True)
        self.tax_rate = await crud.tax_rate.update(
            self.db, db_obj=self.tax_rate, obj_in=update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax rate updated successfully"
        self.response_data = self.tax_rate.to_dict()

    async def process_flow(self):
        await self.check_if_tax_rate_exists()
        if self.early_response:
            return
        await self.update_tax_rate()
        await self.generate_response()

