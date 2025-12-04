from fastapi import status

import crud
from models.product import Product
from api.base_resource import GetResource
from ..schemas.get_product import GetProductRequest, GetProductResponse


class GetProduct(GetResource):
    request_schema = GetProductRequest
    response_schema = GetProductResponse
    authentication_required = False

    # Endpoint details
    api_name = "get_product"
    api_url = "get_product"

    async def check_if_product_exists(self):
        self.product: Product = await crud.product.get(
            self.db, id=self.request_data.product_id
        )
        if not self.product:
            self.early_response = True
            self.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            self.response_message = "Product does not exist"
            self.response_data = {}

    async def get_inventory(self):
        self.inventories = await crud.inventory.get_by_product_id(
            self.db, product_id=self.request_data.product_id
        )
        self.inventories = list(map(lambda x: x.to_dict(), self.inventories))

    async def normalize_product_data(self):
        """Normalize product data to ensure all required fields have valid values."""
        product_dict = self.product.to_dict()
        
        # Normalize product_type - default to "simple" if empty or None
        product_type = product_dict.get("product_type")
        if not product_type or (isinstance(product_type, str) and product_type.strip() == ""):
            product_dict["product_type"] = "simple"
        
        # Normalize stock_status - default to "in_stock" if empty or None
        stock_status = product_dict.get("stock_status")
        if not stock_status or (isinstance(stock_status, str) and stock_status.strip() == ""):
            product_dict["stock_status"] = "in_stock"
        
        # Normalize status - default to "published" if empty or None
        status = product_dict.get("status")
        if not status or (isinstance(status, str) and status.strip() == ""):
            product_dict["status"] = "published"
        
        # Handle invalid sale_price data (sale_price >= price) by setting sale_price to None
        # This allows reading products with invalid data without validation errors
        if product_dict.get("sale_price") is not None and product_dict.get("price") is not None:
            try:
                from decimal import Decimal
                sale_price = Decimal(str(product_dict.get("sale_price", 0)))
                price = Decimal(str(product_dict.get("price", 0)))
                if sale_price >= price:
                    product_dict["sale_price"] = None  # Clear invalid sale price
            except (ValueError, TypeError):
                pass  # Ignore conversion errors
        
        return product_dict

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Product retrieved successfully"
        product_dict = await self.normalize_product_data()
        self.response_data = {
            **product_dict,
            "inventory": self.inventories,
        }

    async def process_flow(self):
        await self.check_if_product_exists()
        if self.early_response:
            return
        await self.get_inventory()
        await self.generate_response()
