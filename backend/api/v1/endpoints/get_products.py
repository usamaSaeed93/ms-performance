from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_products import GetProductsRequest, GetProductsResponse


class GetProducts(GetResource):
    request_schema = GetProductsRequest
    response_schema = GetProductsResponse
    authentication_required = True

    # Endpoint details
    api_name = "get_products"
    api_url = "get_products"

    async def get_products(self):
        self.products = await crud.product.get_multi_with_category(
            self.db,
            category_ids=self.request_data.category_ids,
            page=self.request_data.page,
            per_page=self.request_data.per_page,
            order_by=self.request_data.order_by,
            order=self.request_data.order,
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Products fetched successfully"
        # Convert Row objects to dicts
        products_list = []
        for p in self.products:
            product_dict = {
                "id": p.id,
                "product_name": p.product_name,
                "description": p.description,
                "category_id": p.category_id,
                "quantity": p.quantity or 0,
                "price": str(p.price),
                "sku": p.sku,
                "image_url": p.image_url,
                "weight": str(p.weight) if p.weight else None,
                "is_active": p.is_active,
                "created_at": p.created_at.isoformat() if hasattr(p.created_at, 'isoformat') else str(p.created_at),
                "updated_at": p.updated_at.isoformat() if hasattr(p.updated_at, 'isoformat') else str(p.updated_at),
                "category_name": p.category_name,
                "category_slug": p.category_slug,
            }
            products_list.append(product_dict)
        self.response_data = {"products": products_list}

    async def process_flow(self):
        await self.get_products()
        await self.generate_response()
