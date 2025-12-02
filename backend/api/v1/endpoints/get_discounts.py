from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_discounts import GetDiscountsRequest, GetDiscountsResponse


class GetDiscounts(GetResource):
    request_schema = GetDiscountsRequest
    response_schema = GetDiscountsResponse
    authentication_required = True

    api_name = "get_discounts"
    api_url = "get_discounts"

    async def get_discounts(self):
        self.discounts = await crud.discount.get_multi(
            self.db,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Discounts retrieved successfully"
        self.response_data = {"discounts": [d.to_dict() for d in self.discounts]}

    async def process_flow(self):
        await self.get_discounts()
        await self.generate_response()

