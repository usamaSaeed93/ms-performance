from fastapi import status
from pydantic import BaseModel, Field
from sqlalchemy import select

import crud
from api.base_resource import GetResource
from ..schemas.get_order import GetOrderResponse


class GetOrderRequest(BaseModel):
    order_id: int = Field(..., description="Order ID")


class GetOrder(GetResource):
    request_schema = GetOrderRequest
    response_schema = GetOrderResponse
    authentication_required = True

    api_name = "get_order"
    api_url = "get_order"

    async def get_order(self):
        order_id = self.request_data.order_id
        
        # Get order with items
        order = await crud.sale.get(self.db, id=order_id)
        
        if not order:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Order not found"
            self.response_data = {}
            return
        
        # Check if user has access (customer can only see their own orders, admin can see all)
        from starlette_context import context
        user = context.data.get("user")
        user_obj = await crud.user.get(self.db, id=user["id"])
        
        # Check if user is admin or the order belongs to them
        if user_obj.role != "admin" and order.user_id != user["id"]:
            self.early_response = True
            self.status_code = status.HTTP_403_FORBIDDEN
            self.response_message = "You don't have permission to view this order"
            self.response_data = {}
            return
        
        self.order = order
        
        # Get order items with product names
        from models.sale_item import SaleItem
        from models.product import Product
        
        stmt = (
            select(SaleItem, Product.product_name)
            .join(Product, Product.id == SaleItem.product_id)
            .where(SaleItem.sale_id == order_id)
        )
        
        result = await self.db.execute(stmt)
        items_data = result.all()
        
        self.order_items = []
        for sale_item, product_name in items_data:
            self.order_items.append({
                "sale_item": sale_item,
                "product_name": product_name,
            })

    async def generate_response(self):
        if self.early_response:
            return
            
        self.status_code = status.HTTP_200_OK
        self.response_message = "Order retrieved successfully"
        
        # Build order response
        order_dict = self.order.to_dict()
        
        # Build items response
        items_list = []
        for item_data in self.order_items:
            sale_item = item_data["sale_item"]
            item_dict = sale_item.to_dict()
            item_dict["product_name"] = item_data["product_name"]
            items_list.append(item_dict)
        
        order_dict["items"] = items_list
        
        self.response_data = {"order": order_dict}

    async def process_flow(self):
        await self.get_order()
        if not self.early_response:
            await self.generate_response()

