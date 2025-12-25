import os
import stripe
from decimal import Decimal
from fastapi import status
from starlette_context import context

import crud
from models.product import Product
from api.base_resource import PostResource
from core.tax import TaxCalculator
from ..schemas.create_payment_intent import (
    CreatePaymentIntentRequest,
    CreatePaymentIntentResponse,
    ItemRequest,
)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


class CreatePaymentIntent(PostResource):
    request_schema = CreatePaymentIntentRequest
    response_schema = CreatePaymentIntentResponse
    authentication_required = True

    api_name = "create_payment_intent"
    api_url = "stripe/create_payment_intent"

    async def initialize(self):
        self.products_cache = {}
        self.successful_items = []

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
        """Process a single item and calculate its cost with tax."""
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

        return {
            "line_subtotal": tax_calculation["line_subtotal"],
            "tax_amount": tax_calculation["tax_amount"],
            "line_total": tax_calculation["line_total"],
        }

    async def calculate_total(self):
        """Calculate total amount including tax and shipping."""
        # Process all items
        line_totals = []
        for item in self.request_data.items:
            result = await self.process_item(item)
            if result:
                line_totals.append(result)
                self.successful_items.append(item)
            else:
                self.early_response = True
                self.status_code = status.HTTP_400_BAD_REQUEST
                self.response_message = f"Product {item.product_id} is not available or out of stock"
                self.response_data = {}
                return

        # Calculate subtotal (sum of all line totals including tax)
        subtotal = sum([x["line_total"] for x in line_totals])

        # Calculate shipping tax
        shipping_cost = Decimal(str(self.request_data.shipping_cost))
        shipping_tax_calc = await TaxCalculator.calculate_shipping_tax(
            db=self.db,
            shipping_cost=shipping_cost,
            country_code=self.request_data.country_code,
            state_code=self.request_data.state_code,
            postcode=self.request_data.postcode,
            city=self.request_data.city,
            shipping_taxable=True,
        )

        shipping_tax = shipping_tax_calc["tax_amount"]

        # Total amount in pence (Stripe uses smallest currency unit)
        total_amount = subtotal + shipping_cost + shipping_tax
        total_in_pence = int(total_amount * 100)

        return total_in_pence

    async def create_stripe_payment_intent(self, amount: int):
        """Create a Stripe payment intent."""
        user = context.data.get("user")
        user_obj = await crud.user.get(self.db, id=user["id"])

        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="gbp",
                automatic_payment_methods={
                    "enabled": True,
                },
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
            )

            return payment_intent
        except stripe.error.StripeError as e:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = f"Stripe error: {str(e)}"
            self.response_data = {}
            return None

    async def generate_response(self, payment_intent):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Payment intent created successfully"
        self.response_data = {
            "client_secret": payment_intent.client_secret,
            "payment_intent_id": payment_intent.id,
            "amount": Decimal(payment_intent.amount) / 100,
            "currency": payment_intent.currency,
        }

    async def process_flow(self):
        await self.initialize()
        await self.check_email_confirmation()
        if self.early_response:
            return

        total_in_pence = await self.calculate_total()
        if self.early_response:
            return

        payment_intent = await self.create_stripe_payment_intent(total_in_pence)
        if not payment_intent:
            return

        await self.generate_response(payment_intent)

