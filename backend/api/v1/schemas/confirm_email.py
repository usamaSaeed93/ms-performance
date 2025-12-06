from pydantic import BaseModel


class ConfirmEmailRequest(BaseModel):
    token: str


class ResendConfirmationEmailRequest(BaseModel):
    email: str

