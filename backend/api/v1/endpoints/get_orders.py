from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_orders import GetOrdersRequest, GetOrdersResponse


class GetOrders(GetResource):
    request_schema = GetOrdersRequest
    response_schema = GetOrdersResponse
    authentication_required = True

    api_name = "get_orders"
    api_url = "get_orders"

    async def get_orders(self):
        self.orders = await crud.sale.get_multi(
            self.db,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Orders retrieved successfully"
        self.response_data = {"orders": [x.to_dict() for x in self.orders]}

    async def process_flow(self):
        await self.get_orders()
        await self.generate_response()

