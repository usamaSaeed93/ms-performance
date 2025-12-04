from fastapi import status

import crud
from api.base_resource import GetResource
from ..schemas.get_product_images import GetProductImagesRequest, GetProductImagesResponse


class GetProductImages(GetResource):
    request_schema = GetProductImagesRequest
    response_schema = GetProductImagesResponse
    authentication_required = False

    api_name = "get_product_images"
    api_url = "get_product_images"

    async def check_if_product_exists(self):
        product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}

    async def get_product_images(self):
        from sqlalchemy import select
        from models.product_image import ProductImage
        
        stmt = select(ProductImage).filter(
            ProductImage.product_id == self.request_data.product_id
        ).order_by(ProductImage.sort_order, ProductImage.id)
        results = await self.db.execute(stmt)
        self.product_images = results.scalars().all()

    async def generate_response(self):
        from ..schemas.get_product_images import ProductImageResponse
        
        self.status_code = status.HTTP_200_OK
        self.response_message = "Product images retrieved successfully"
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
                for img in self.product_images
            ]
        }

    async def process_flow(self):
        await self.check_if_product_exists()
        if self.early_response:
            return
        await self.get_product_images()
        await self.generate_response()

