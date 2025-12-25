from fastapi import status
from typing import Optional

import crud
from models.tax import TaxRate
from api.base_resource import GetResource
from ..schemas.get_tax_rates import GetTaxRatesRequest, GetTaxRatesResponse


class GetTaxRates(GetResource):
    request_schema = GetTaxRatesRequest
    response_schema = GetTaxRatesResponse
    authentication_required = True

    # Endpoint details
    api_name = "get_tax_rates"
    api_url = "get_tax_rates"

    async def get_tax_rates(self):
        # Use get_multi for pagination and search support
        self.tax_rates: list[TaxRate] = await crud.tax_rate.get_multi(
            self.db,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
            search=self.request_data.search,
        )
        
        # Filter by tax_class_id and country_code if provided (client-side filtering for now)
        # TODO: Add server-side filtering to CRUD method for better performance with large datasets
        if self.request_data.tax_class_id is not None:
            self.tax_rates = [tr for tr in self.tax_rates if tr.tax_class_id == self.request_data.tax_class_id]
        if self.request_data.country_code:
            self.tax_rates = [tr for tr in self.tax_rates if tr.country_code == self.request_data.country_code]

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax rates fetched successfully"
        self.response_data = {"tax_rates": [tr.to_dict() for tr in self.tax_rates]}

    async def process_flow(self):
        await self.get_tax_rates()
        await self.generate_response()

