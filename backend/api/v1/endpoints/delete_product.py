from fastapi import status

import crud
from api.base_resource import PostResource
from ..schemas.delete_product import DeleteProductRequest, DeleteProductResponse


class DeleteProduct(PostResource):
    request_schema = DeleteProductRequest
    response_schema = DeleteProductResponse
    authentication_required = True

    api_name = "delete_product"
    api_url = "delete_product"

    async def check_if_product_exists(self):
        self.product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not self.product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}

    async def delete_product(self):
        await crud.product.remove(self.db, id=self.request_data.product_id)

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Product deleted successfully"
        self.response_data = {}

    async def process_flow(self):
        await self.check_if_product_exists()
        if self.early_response:
            return
        await self.delete_product()
        await self.generate_response()

