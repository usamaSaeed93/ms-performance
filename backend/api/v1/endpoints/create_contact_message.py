from fastapi import status
from api.base_resource import PostResource
from crud.crud_contact_message import contact_message
from crud.schemas.contact_message import ContactMessage, ContactMessageCreate
from core.email import email_service
from core.logger import Logger

logger = Logger.get_logger(__file__, __name__)

class CreateContactMessage(PostResource):
    request_schema = ContactMessageCreate
    response_schema = ContactMessage
    authentication_required = False

    api_name = "create_contact_message"
    api_url = "contact-messages"

    async def process_flow(self):
        self.response_data = await contact_message.create(self.db, obj_in=self.request_data)
        self.status_code = status.HTTP_201_CREATED
        self.response_message = "Message sent successfully"

        # Send email notification to the admin/SMTP sender
        try:
            await email_service.send_contact_notification_email(
                name=self.request_data.name,
                email=self.request_data.email,
                message=self.request_data.message,
                phone=self.request_data.phone,
                address=self.request_data.address,
                subject=self.request_data.subject,
            )
        except Exception as e:
            # Don't fail the contact message creation if email fails
            logger.error(f"Failed to send contact notification email: {str(e)}")
