from fastapi import status
from api.base_resource import GetResource
from crud.crud_contact_message import contact_message
from crud.schemas.contact_message import ContactMessage

class GetContactMessages(GetResource):
    response_schema = ContactMessage # It handles list automatically in base resource logic? No, let's verify logic.
    # BaseResource: if isinstance(self.response_data, list): self.response_data = [self.response_schema(**data) ...]
    # So yes, response_schema should be the single item schema.
    
    authentication_required = False # Or True if admin only? The prompt implied making it work. Admin dashboard needs it. I'll stick to False or maybe True if I had auth setup. User didn't ask for auth yet.

    api_name = "get_contact_messages"
    api_url = "contact-messages"

    async def process_flow(self):
        # We can implement pagination later, for now get last 100
        self.response_data = await contact_message.get_multi(self.db, page=1, per_page=100, order_by="created_at", order="desc")
        self.status_code = status.HTTP_200_OK
        self.response_message = "Messages retrieved successfully"
