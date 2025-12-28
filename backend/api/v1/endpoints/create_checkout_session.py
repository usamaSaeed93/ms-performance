import os
import stripe
from decimal import Decimal
from fastapi import status
from starlette_context import context

import crud
from models.product import Product
from api.base_resource import PostResource
from core.tax import TaxCalculator
from ..schemas.create_checkout_session import (
    CreateCheckoutSessionRequest,
    CreateCheckoutSessionResponse,
    ItemRequest,
)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

# Frontend URLs for redirect
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


class CreateCheckoutSession(PostResource):
    request_schema = CreateCheckoutSessionRequest
    response_schema = CreateCheckoutSessionResponse
    authentication_required = True

    api_name = "create_checkout_session"
    api_url = "stripe/create_checkout_session"

    async def initialize(self):
        self.products_cache = {}
        self.successful_items = []
        self.line_items = []

    async def check_email_confirmation(self):
        """Check if user's email is confirmed."""
        user = context.data.get("user")
        if not user:
            self.early_response = True
            self.status_code = status.HTTP_403_FORBIDDEN
            self.response_message = "Authentication required"
            self.response_data = {}
            return

        user_obj = await crud.user.get(self.db, id=user["id"])
        if not user_obj or not user_obj.email_confirmed:
            self.early_response = True
            self.status_code = status.HTTP_403_FORBIDDEN
            self.response_message = "Please confirm your email address before placing an order."
            self.response_data = {"email_confirmed": False}
            return

    async def process_item(self, item: ItemRequest):
        """Process a single item and create Stripe line item."""
        # Get product from cache or database
        if item.product_id in self.products_cache:
            product = self.products_cache[item.product_id]
        else:
            product = await crud.product.get(self.db, id=item.product_id)
            if not product:
                return None
            self.products_cache[item.product_id] = product

        # Check stock availability (only if manage_stock is enabled)
        if product.manage_stock and product.quantity < item.quantity:
            return None

        # Use sale_price if available, otherwise regular price
        price_per_unit = product.sale_price if product.sale_price else product.price

        # Calculate tax for this line item
        tax_calculation = await TaxCalculator.calculate_line_item_tax(
            db=self.db,
            product=product,
            quantity=item.quantity,
            price_per_unit=price_per_unit,
            country_code=self.request_data.country_code,
            state_code=self.request_data.state_code,
            postcode=self.request_data.postcode,
            city=self.request_data.city,
        )

        # Price per unit in pence including tax
        unit_price_with_tax = int(tax_calculation["line_total"] / item.quantity * 100)

        # Create Stripe line item for Checkout
        line_item = {
            "price_data": {
                "currency": "gbp",
                "product_data": {
                    "name": product.product_name,
                    "description": product.short_description or product.product_name,
                    "images": [product.image_url] if product.image_url and product.image_url.startswith("http") else [],
                },
                "unit_amount": unit_price_with_tax,
            },
            "quantity": item.quantity,
        }

        return line_item

    async def build_line_items(self):
        """Build all Stripe line items including shipping."""
        # Process all product items
        for item in self.request_data.items:
            line_item = await self.process_item(item)
            if line_item:
                self.line_items.append(line_item)
                self.successful_items.append(item)
            else:
                self.early_response = True
                self.status_code = status.HTTP_400_BAD_REQUEST
                self.response_message = f"Product {item.product_id} is not available or out of stock"
                self.response_data = {}
                return

        # Add shipping as a line item if there's a shipping cost
        shipping_cost = Decimal(str(self.request_data.shipping_cost))
        if shipping_cost > 0:
            # Calculate shipping tax
            shipping_tax_calc = await TaxCalculator.calculate_shipping_tax(
                db=self.db,
                shipping_cost=shipping_cost,
                country_code=self.request_data.country_code,
                state_code=self.request_data.state_code,
                postcode=self.request_data.postcode,
                city=self.request_data.city,
                shipping_taxable=True,
            )

            shipping_total = shipping_cost + shipping_tax_calc["tax_amount"]
            shipping_amount_pence = int(shipping_total * 100)

            self.line_items.append({
                "price_data": {
                    "currency": "gbp",
                    "product_data": {
                        "name": "Shipping",
                        "description": "Standard delivery",
                    },
                    "unit_amount": shipping_amount_pence,
                },
                "quantity": 1,
            })

    async def create_stripe_checkout_session(self):
        """Create a Stripe Checkout Session."""
        user = context.data.get("user")
        user_obj = await crud.user.get(self.db, id=user["id"])

        try:
            checkout_session = stripe.checkout.Session.create(
                mode="payment",
                payment_method_types=["card"],
                line_items=self.line_items,
                success_url=f"{FRONTEND_URL}/order-confirmation?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{FRONTEND_URL}/checkout?cancelled=true",
                customer_email=user_obj.email if user_obj else None,
                metadata={
                    "user_id": str(user["id"]),
                    "email": user_obj.email if user_obj else "",
                    "items": str([{"product_id": item.product_id, "quantity": item.quantity} for item in self.successful_items]),
                    "shipping_cost": str(self.request_data.shipping_cost),
                    "country_code": self.request_data.country_code,
                    "state_code": self.request_data.state_code or "",
                    "postcode": self.request_data.postcode or "",
                    "city": self.request_data.city or "",
                    "shipping_address": self.request_data.shipping_address or "",
                },
                billing_address_collection="required",
                shipping_address_collection={
                    "allowed_countries": ["GB", "US"],
                },
            )

            return checkout_session
        except stripe.error.StripeError as e:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = f"Stripe error: {str(e)}"
            self.response_data = {}
            return None

    async def generate_response(self, checkout_session):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Checkout session created successfully"
        self.response_data = {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id,
        }

    async def process_flow(self):
        await self.initialize()
        await self.check_email_confirmation()
        if self.early_response:
            return

        await self.build_line_items()
        if self.early_response:
            return

        checkout_session = await self.create_stripe_checkout_session()
        if not checkout_session:
            return

        await self.generate_response(checkout_session)
