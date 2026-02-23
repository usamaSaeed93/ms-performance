from fastapi import status

from api.base_resource import PostResource
from crud.mailing_subscription import mailing_subscription
from crud.schemas.mailing_subscription import MailingSubscription, MailingSubscriptionCreate


class CreateMailingSubscription(PostResource):
    request_schema = MailingSubscriptionCreate
    response_schema = MailingSubscription
    authentication_required = False

    api_name = "create_mailing_subscription"
    api_url = "mailing-subscriptions"

    async def process_flow(self):
        existing = await mailing_subscription.get_by_email(self.db, email=self.request_data.email)

        if existing:
            updated_data = {
                "name": self.request_data.name,
                "is_active": True,
            }
            self.response_data = await mailing_subscription.update(
                self.db, db_obj=existing, obj_in=updated_data
            )
        else:
            self.response_data = await mailing_subscription.create(
                self.db, obj_in=self.request_data
            )

        self.status_code = status.HTTP_201_CREATED
        self.response_message = "Subscription saved successfully"
