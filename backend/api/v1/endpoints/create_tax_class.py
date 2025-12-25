from fastapi import status

import crud
from models.tax import TaxClass
from api.base_resource import PutResource
from ..schemas.create_tax_class import CreateTaxClassRequest, CreateTaxClassResponse


class CreateTaxClass(PutResource):
    request_schema = CreateTaxClassRequest
    response_schema = CreateTaxClassResponse
    authentication_required = True

    # Endpoint details
    api_name = "create_tax_class"
    api_url = "create_tax_class"

    async def check_if_tax_class_exists(self):
        tax_class = await crud.tax_class.get_by_slug(
            self.db, slug=self.request_data.slug
        )
        if tax_class:
            self.early_response = True
            self.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            self.response_message = "Tax class with this slug already exists"
            self.response_data = {}

    async def create_tax_class(self):
        self.tax_class: TaxClass = await crud.tax_class.create(
            self.db, obj_in=self.request_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Tax class created successfully"
        self.response_data = self.tax_class.to_dict()

    async def process_flow(self):
        await self.check_if_tax_class_exists()
        if self.early_response:
            return

        await self.create_tax_class()
        await self.generate_response()

