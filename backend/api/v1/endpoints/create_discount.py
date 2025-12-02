from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.create_discount import CreateDiscountRequest, CreateDiscountResponse


class CreateDiscount(PutResource):
    request_schema = CreateDiscountRequest
    response_schema = CreateDiscountResponse
    authentication_required = True

    api_name = "create_discount"
    api_url = "create_discount"

    async def check_code_exists(self):
        existing = await crud.discount.get_by_code(self.db, code=self.request_data.code.upper())
        if existing:
            self.early_response = True
            self.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            self.response_message = "Discount code already exists"
            self.response_data = {}

    async def create_discount(self):
        discount_data = self.request_data.model_dump()
        discount_data["code"] = discount_data["code"].upper()
        self.discount = await crud.discount.create(self.db, obj_in=discount_data)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Discount created successfully"
        self.response_data = self.discount.to_dict()

    async def process_flow(self):
        await self.check_code_exists()
        if self.early_response:
            return
        await self.create_discount()
        await self.generate_response()

