from fastapi import status

import crud
from models.tax import TaxClass
from api.base_resource import GetResource
from ..schemas.get_tax_classes import GetTaxClassesRequest, GetTaxClassesResponse


class GetTaxClasses(GetResource):
    request_schema = GetTaxClassesRequest
    response_schema = GetTaxClassesResponse
    authentication_required = True

    # Endpoint details
    api_name = "get_tax_classes"
    api_url = "get_tax_classes"

    async def get_tax_classes(self):
        self.tax_classes: list[TaxClass] = await crud.tax_class.get_multi(
            self.db,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
            search=self.request_data.search,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax classes fetched successfully"
        self.response_data = {"tax_classes": [tc.to_dict() for tc in self.tax_classes]}

    async def process_flow(self):
        await self.get_tax_classes()
        await self.generate_response()

