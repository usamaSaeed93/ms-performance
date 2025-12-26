from fastapi import status
from api.base_resource import PostResource
from crud.crud_contact_message import contact_message
from crud.schemas.contact_message import ContactMessage, ContactMessageCreate

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
