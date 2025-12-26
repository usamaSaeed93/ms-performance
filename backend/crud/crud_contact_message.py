from crud.base import CRUDBase
from models.contact_message import ContactMessage
from crud.schemas.contact_message import ContactMessageCreate, ContactMessageUpdate

class CRUDContactMessage(CRUDBase[ContactMessage, ContactMessageCreate, ContactMessageUpdate]):
    pass

contact_message = CRUDContactMessage(ContactMessage)
