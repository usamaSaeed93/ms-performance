from crud.base import CRUDBase
from models.mailing_attachment import MailingAttachment
from crud.schemas.mailing_attachment import MailingAttachmentCreate, MailingAttachment


class CRUDMailingAttachment(CRUDBase[MailingAttachment, MailingAttachmentCreate, MailingAttachment]):
    pass


mailing_attachment = CRUDMailingAttachment(MailingAttachment)
