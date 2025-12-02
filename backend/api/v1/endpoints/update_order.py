from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_order import UpdateOrderRequest, UpdateOrderResponse


class UpdateOrder(PutResource):
    request_schema = UpdateOrderRequest
    response_schema = UpdateOrderResponse
    authentication_required = True

    api_name = "update_order"
    api_url = "update_order"

    async def check_if_order_exists(self):
        self.order = await crud.sale.get(self.db, id=self.request_data.order_id)
        if not self.order:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Order not found"
            self.response_data = {}

    async def update_order(self):
        update_data = self.request_data.model_dump(exclude={"order_id"}, exclude_unset=True)
        self.order = await crud.sale.update(
            self.db, db_obj=self.order, obj_in=update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Order updated successfully"
        self.response_data = self.order.to_dict()

    async def process_flow(self):
        await self.check_if_order_exists()
        if self.early_response:
            return
        await self.update_order()
        await self.generate_response()

