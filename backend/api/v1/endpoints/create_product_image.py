from fastapi import status

import crud
from crud.schemas import ProductImageCreate
from api.base_resource import PutResource
from ..schemas.create_product_image import (
    CreateProductImageRequest,
    CreateProductImageResponse,
    ProductImageResponse,
)


class CreateProductImage(PutResource):
    request_schema = CreateProductImageRequest
    response_schema = CreateProductImageResponse
    authentication_required = True

    # Endpoint details
    api_name = "create_product_image"
    api_url = "create_product_image"

    async def check_if_product_exists(self):
        product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}

    async def create_product_images(self):
        created_images = []
        for image_data in self.request_data.images:
            product_image_create = ProductImageCreate(
                product_id=self.request_data.product_id,
                image_url=image_data.image_url,
                alt_text=image_data.alt_text,
                sort_order=image_data.sort_order,
                is_primary=image_data.is_primary,
            )
            product_image = await crud.product_image.create(
                self.db, obj_in=product_image_create
            )
            created_images.append(product_image)
        self.created_images = created_images

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Product images created successfully"
        self.response_data = {
            "images": [
                ProductImageResponse(
                    id=img.id,
                    product_id=img.product_id,
                    image_url=img.image_url,
                    alt_text=img.alt_text,
                    sort_order=img.sort_order,
                    is_primary=img.is_primary,
                )
                for img in self.created_images
            ]
        }

    async def process_flow(self):
        await self.check_if_product_exists()
        if self.early_response:
            return

        await self.create_product_images()
        await self.generate_response()

