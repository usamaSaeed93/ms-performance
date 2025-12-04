from fastapi import status

import crud
from crud.schemas import ProductImageCreate
from api.base_resource import PutResource
from ..schemas.update_product_images import (
    UpdateProductImagesRequest,
    UpdateProductImagesResponse,
    ProductImageResponse,
)


class UpdateProductImages(PutResource):
    request_schema = UpdateProductImagesRequest
    response_schema = UpdateProductImagesResponse
    authentication_required = True

    api_name = "update_product_images"
    api_url = "update_product_images"

    async def check_if_product_exists(self):
        product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}

    async def delete_existing_images(self):
        from sqlalchemy import delete
        from models.product_image import ProductImage
        
        stmt = delete(ProductImage).where(
            ProductImage.product_id == self.request_data.product_id
        )
        await self.db.execute(stmt)
        await self.db.commit()

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
        self.response_message = "Product images updated successfully"
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

        # Delete all existing images
        await self.delete_existing_images()
        
        # Create new images
        if self.request_data.images:
            await self.create_product_images()
        else:
            self.created_images = []
        
        await self.generate_response()

