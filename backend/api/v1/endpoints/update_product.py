from fastapi import status

import crud
from api.base_resource import PutResource
from ..schemas.update_product import UpdateProductRequest, UpdateProductResponse


class UpdateProduct(PutResource):
    request_schema = UpdateProductRequest
    response_schema = UpdateProductResponse
    authentication_required = True

    api_name = "update_product"
    api_url = "update_product"

    async def check_if_product_exists(self):
        self.product = await crud.product.get(self.db, id=self.request_data.product_id)
        if not self.product:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Product not found"
            self.response_data = {}

    async def check_if_category_exists(self):
        if self.request_data.category_id:
            category = await crud.category.get(self.db, id=self.request_data.category_id)
            if not category:
                self.early_response = True
                self.status_code = status.HTTP_404_NOT_FOUND
                self.response_message = "Category not found"
                self.response_data = {}

    async def prepare_update_data(self):
        update_data = self.request_data.model_dump(exclude={"product_id"}, exclude_unset=True)
        # Only regenerate slug when explicitly provided or name changes
        if "slug" in update_data or "product_name" in update_data:
            base_slug = crud.product.slugify(
                update_data.get("slug")
                or update_data.get("product_name")
                or self.product.slug
                or self.product.product_name
            )
            update_data["slug"] = await crud.product.generate_unique_slug(
                self.db, base_slug=base_slug, current_id=self.product.id
            )
        self.update_data = update_data

    async def update_product(self):
        self.product = await crud.product.update(
            self.db, db_obj=self.product, obj_in=self.update_data
        )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Product updated successfully"
        self.response_data = self.product.to_dict()

    async def process_flow(self):
        await self.check_if_product_exists()
        if self.early_response:
            return
        await self.check_if_category_exists()
        if self.early_response:
            return
        await self.prepare_update_data()
        await self.update_product()
        await self.generate_response()
