from fastapi import status

import crud
from models.tax import TaxRate
from api.base_resource import PutResource
from ..schemas.create_tax_rate import CreateTaxRateRequest, CreateTaxRateResponse


class CreateTaxRate(PutResource):
    request_schema = CreateTaxRateRequest
    response_schema = CreateTaxRateResponse
    authentication_required = True

    # Endpoint details
    api_name = "create_tax_rate"
    api_url = "create_tax_rate"

    async def create_tax_rate(self):
        self.tax_rate: TaxRate = await crud.tax_rate.create(
            self.db, obj_in=self.request_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax rate created successfully"
        self.response_data = self.tax_rate.to_dict()

    async def process_flow(self):
        await self.create_tax_rate()
        await self.generate_response()

