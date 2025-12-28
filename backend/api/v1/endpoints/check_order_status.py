from api.base_resource import GetResource
from fastapi import status
from sqlalchemy import select
import crud
import os
import stripe
from ..schemas.check_order_status import CheckOrderStatusRequest, CheckOrderStatusResponse

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


class CheckOrderStatus(GetResource):
    api_name = "check_order_status"
    api_url = "check_order_status"
    request_schema = CheckOrderStatusRequest
    authentication_required = True

    async def process_flow(self):
        payment_intent_id = self.request_data.payment_intent_id
        session_id = self.request_data.session_id

        # If session_id is provided but not payment_intent_id, get payment_intent from Stripe
        if session_id and not payment_intent_id:
            try:
                session = stripe.checkout.Session.retrieve(session_id)
                payment_intent_id = session.payment_intent
            except stripe.error.StripeError as e:
                self.status_code = status.HTTP_200_OK
                self.response_message = "Could not retrieve session"
                self.response_data = {
                    "order_exists": False,
                    "order_id": None,
                    "order_number": None,
                }
                return

        if not payment_intent_id:
            self.status_code = status.HTTP_200_OK
            self.response_message = "No payment information provided"
            self.response_data = {
                "order_exists": False,
                "order_id": None,
                "order_number": None,
            }
            return

        # Find sale by payment_intent_id
        db = self.db
        stmt = select(
            crud.sale.model.id,
            crud.sale.model.order_number,
            crud.sale.model.payment_intent_id
        ).where(
            crud.sale.model.payment_intent_id == payment_intent_id
        )
        result = await db.execute(stmt)
        sale_row = result.first()

        if sale_row:
            self.status_code = status.HTTP_200_OK
            self.response_message = "Order found"
            self.response_data = {
                "order_exists": True,
                "order_id": sale_row.id,
                "order_number": sale_row.order_number,
            }
        else:
            self.status_code = status.HTTP_200_OK
            self.response_message = "Order not found"
            self.response_data = {
                "order_exists": False,
                "order_id": None,
                "order_number": None,
            }
