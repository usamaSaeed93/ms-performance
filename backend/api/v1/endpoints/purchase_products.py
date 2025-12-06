from decimal import Decimal
from fastapi import status
from starlette_context import context

import crud
from models.product import Product
from api.base_resource import PostResource
from crud.schemas import SaleCreate, SaleItemCreate
from core.tax import TaxCalculator
from core.email import email_service
from core.email_queue import email_queue
from ..schemas.purchase_products import (
    Item,
    PurchaseProductsRequest,
    PurchaseProductsResponse,
)


class PurchaseProducts(PostResource):
    request_schema = PurchaseProductsRequest
    response_schema = PurchaseProductsResponse
    authentication_required = True

    # Endpoint details
    api_name = "purchase_products"
    api_url = "purchase_products"

    async def initialize(self):
        self.failed_purchases = []
        self.successful_purchases = []
        self.products_cache = {}  # Cache products to avoid multiple DB queries
    
    async def check_email_confirmation(self):
        """Check if user's email is confirmed."""
        user = context.data.get("user")
        if not user:
            self.early_response = True
            self.status_code = status.HTTP_403_FORBIDDEN
            self.response_message = "Authentication required"
            self.response_data = {}
            return
        
        # Get user from DB to check email confirmation
        user_obj = await crud.user.get(self.db, id=user["id"])
        if not user_obj or not user_obj.email_confirmed:
            self.early_response = True
            self.status_code = status.HTTP_403_FORBIDDEN
            self.response_message = "Please confirm your email address before placing an order."
            self.response_data = {"email_confirmed": False}
            return

    async def purchase_product(self, item: Item):
        # Important
        # This should ideally happen in a queue orchestrated by a task manager like Celery
        # to ensure that the inventory is updated only after the payment is successful
        # but for the sake of simplicity, we are doing it here

        # Get Product Information (use cache if available)
        if item.product_id not in self.products_cache:
            product = await crud.product.get_active(self.db, id=item.product_id)
            if not product:
                self.failed_purchases.append(item)
                return
            self.products_cache[item.product_id] = product
        else:
            product = self.products_cache[item.product_id]

        # Get Product Inventory Information
        inventories = await crud.inventory.get_by_product_id(
            self.db, product_id=item.product_id
        )
        if not inventories:
            self.failed_purchases.append(item)
            return

        # Ensure sum of inventory quantity is greater than or equal to requested quantity
        total_quantity = sum([x.quantity for x in inventories])
        if total_quantity < item.quantity:
            self.failed_purchases.append(item)
            return

        # Sort it by oldest inventories first
        inventories = sorted(inventories, key=lambda x: x.created_at)

        modified_inventories = []

        # Deplete Inventory
        left_quantity = item.quantity
        for inventory in inventories:
            if inventory.quantity >= left_quantity:
                inventory.quantity -= left_quantity
                left_quantity = 0
                modified_inventories.append(inventory)
                break
            else:
                left_quantity -= inventory.quantity
                inventory.quantity = 0
                modified_inventories.append(inventory)

        if modified_inventories:
            await crud.inventory.bulk_update(self.db, db_objs=modified_inventories)
            # Update Product
            await crud.product.update(
                self.db,
                db_obj=product,
                obj_in={"quantity": product.quantity - item.quantity},
            )

        # Calculate tax for this line item
        # Use sale_price if available, otherwise use regular price
        price_per_unit = product.sale_price if product.sale_price else product.price
        
        tax_calculation = await TaxCalculator.calculate_line_item_tax(
            db=self.db,
            product=product,
            quantity=item.quantity,
            price_per_unit=price_per_unit,
            country_code=self.request_data.country_code,
            state_code=self.request_data.state_code,
            postcode=self.request_data.postcode,
            city=self.request_data.city
        )
        
        # Create Sale Item object with tax information
        sale_item = SaleItemCreate(
            sale_id=0,  # to be populated later
            product_id=item.product_id,
            quantity=item.quantity,
            price_per_unit=price_per_unit,
            tax_rate=tax_calculation["tax_rate"],
            tax_amount=tax_calculation["tax_amount"],
            line_total=tax_calculation["line_total"],
        )

        self.successful_purchases.append({
            "sale_item": sale_item,
            "line_subtotal": tax_calculation["line_subtotal"],
            "tax_amount": tax_calculation["tax_amount"]
        })

    async def purchase_products(self):
        for item in self.request_data.items:
            await self.purchase_product(item)

    async def create_sales_data(self):
        # Calculate subtotal (sum of all line subtotals before tax)
        subtotal = sum([x["line_subtotal"] for x in self.successful_purchases])
        
        # Calculate total tax (sum of all line item taxes)
        total_tax = sum([x["tax_amount"] for x in self.successful_purchases])
        
        # Calculate shipping tax if shipping is provided
        shipping_cost = Decimal(str(self.request_data.shipping_cost))
        shipping_tax_calc = await TaxCalculator.calculate_shipping_tax(
            db=self.db,
            shipping_cost=shipping_cost,
            country_code=self.request_data.country_code,
            state_code=self.request_data.state_code,
            postcode=self.request_data.postcode,
            city=self.request_data.city,
            shipping_taxable=True  # Default to taxable, can be made configurable
        )
        
        shipping_tax = shipping_tax_calc["tax_amount"]
        
        # Calculate total amount (subtotal + tax + shipping + shipping_tax)
        total_amount = subtotal + total_tax + shipping_cost + shipping_tax
        
        # Create Sale object
        self.sale = SaleCreate(
            user_id=context.data["user"]["id"],
            subtotal=subtotal,
            tax=total_tax,
            shipping_cost=shipping_cost,
            shipping_tax=shipping_tax,
            total_amount=total_amount,
        )
        self.sale = await crud.sale.create(self.db, obj_in=self.sale)

        # Update Sale Item with sale_id and create sale items
        sale_items_to_create = []
        for purchase_data in self.successful_purchases:
            sale_item = purchase_data["sale_item"]
            sale_item.sale_id = self.sale.id
            sale_items_to_create.append(sale_item)

        self.successful_purchases_created = await crud.sale_item.bulk_create(
            self.db, objs_in=sale_items_to_create
        )
        
        # Get order items for email
        self.order_items = []
        for sale_item in self.successful_purchases_created:
            product = await crud.product.get(self.db, id=sale_item.product_id)
            if product:
                self.order_items.append({
                    "name": product.name,
                    "quantity": sale_item.quantity,
                    "price": float(sale_item.price_per_unit),
                    "total": float(sale_item.line_total)
                })

    async def send_order_confirmation_email(self):
        """Send order confirmation email."""
        user = context.data.get("user")
        if user and self.order_items:
            user_obj = await crud.user.get(self.db, id=user["id"])
            if user_obj:
                await email_queue.add_email_task(
                    email_service.send_order_confirmation_email,
                    to_email=user_obj.email,
                    first_name=user_obj.first_name,
                    order_number=self.sale.order_number or f"ORD-{self.sale.id}",
                    order_items=self.order_items,
                    subtotal=float(self.sale.subtotal),
                    tax=float(self.sale.tax),
                    shipping_cost=float(self.sale.shipping_cost or 0),
                    total=float(self.sale.total_amount)
                )

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Products purchased successfully"
        self.response_data = {
            **self.sale.to_dict(),
            "purchased_items": [x.to_dict() for x in self.successful_purchases_created],
            "failed_items": self.failed_purchases,
        }

    async def process_flow(self):
        await self.initialize()
        await self.check_email_confirmation()
        if self.early_response:
            return
        await self.purchase_products()
        await self.create_sales_data()
        await self.send_order_confirmation_email()
        await self.generate_response()
