from fastapi import status

from api.base_resource import GetResource
from crud.mailing_subscription import mailing_subscription
from crud.schemas.mailing_subscription import MailingSubscription


class GetMailingSubscriptions(GetResource):
    response_schema = MailingSubscription
    authentication_required = True

    api_name = "get_mailing_subscriptions"
    api_url = "mailing-subscriptions"

    async def process_flow(self):
        self.response_data = await mailing_subscription.get_multi(
            self.db, page=1, per_page=500, order_by="created_at", order="desc"
        )
        self.status_code = status.HTTP_200_OK
        self.response_message = "Subscriptions retrieved successfully"
