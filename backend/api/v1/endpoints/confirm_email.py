from fastapi import status

import crud
from api.base_resource import GetResource, PostResource
from crud.schemas import User
from ..schemas.confirm_email import ConfirmEmailRequest, ResendConfirmationEmailRequest


class ConfirmEmailGet(GetResource):
    """
    GET endpoint to confirm email address using confirmation token from query params
    """
    request_schema = ConfirmEmailRequest
    authentication_required = False

    api_name = "confirm_email"
    api_url = "confirm_email"

    async def validate_token(self):
        """Validate the confirmation token from request."""
        token = None
        if hasattr(self.request_data, 'token'):
            token = self.request_data.token
        else:
            # Try getting from query params directly
            token = self.request.url.query_params.get('token') if hasattr(self.request, 'url') else None
        
        if not token:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Confirmation token is required"
            self.response_data = {}
            return
        
        # Find user by token
        self.user = await crud.user.get_by_confirmation_token(self.db, token=token)
        if not self.user:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Invalid or expired confirmation token"
            self.response_data = {}
            return
        
        # Check if already confirmed
        if self.user.email_confirmed:
            self.early_response = True
            self.status_code = status.HTTP_200_OK
            self.response_message = "Email already confirmed"
            self.response_data = {"email_confirmed": True}
            return

    async def confirm_email(self):
        """Confirm the user's email."""
        self.user = await crud.user.confirm_email(self.db, db_obj=self.user)
        self.response_data = {
            "email_confirmed": True,
            "message": "Email confirmed successfully"
        }
        self.status_code = status.HTTP_200_OK
        self.response_message = "Email confirmed successfully"

    async def process_flow(self):
        await self.validate_token()
        if self.early_response:
            return
        await self.confirm_email()


class ConfirmEmailPost(PostResource):
    """
    POST endpoint to confirm email address using confirmation token from request body
    """
    request_schema = ConfirmEmailRequest
    authentication_required = False

    api_name = "confirm_email_post"
    api_url = "confirm_email"

    async def validate_token(self):
        """Validate the confirmation token from request."""
        if not hasattr(self.request_data, 'token') or not self.request_data.token:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Confirmation token is required"
            self.response_data = {}
            return
        
        # Find user by token
        self.user = await crud.user.get_by_confirmation_token(self.db, token=self.request_data.token)
        if not self.user:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Invalid or expired confirmation token"
            self.response_data = {}
            return
        
        # Check if already confirmed
        if self.user.email_confirmed:
            self.early_response = True
            self.status_code = status.HTTP_200_OK
            self.response_message = "Email already confirmed"
            self.response_data = {"email_confirmed": True}
            return

    async def confirm_email(self):
        """Confirm the user's email."""
        self.user = await crud.user.confirm_email(self.db, db_obj=self.user)
        self.response_data = {
            "email_confirmed": True,
            "message": "Email confirmed successfully"
        }
        self.status_code = status.HTTP_200_OK
        self.response_message = "Email confirmed successfully"

    async def process_flow(self):
        await self.validate_token()
        if self.early_response:
            return
        await self.confirm_email()


class ResendConfirmationEmail(PostResource):
    """
    Endpoint to resend confirmation email
    """
    request_schema = ResendConfirmationEmailRequest
    authentication_required = False

    api_name = "resend_confirmation_email"
    api_url = "resend_confirmation_email"

    async def find_user(self):
        """Find user by email."""
        if not hasattr(self.request_data, 'email'):
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Email is required"
            self.response_data = {}
            return
        
        self.user = await crud.user.get_by_email(self.db, email=self.request_data.email)
        if not self.user:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "User not found"
            self.response_data = {}
            return
        
        # Check if already confirmed
        if self.user.email_confirmed:
            self.early_response = True
            self.status_code = status.HTTP_200_OK
            self.response_message = "Email already confirmed"
            self.response_data = {"email_confirmed": True}
            return

    async def resend_email(self):
        """Resend confirmation email."""
        from core.security import generate_email_confirmation_token
        from core.email import email_service
        from core.email_queue import email_queue
        
        # Generate new token
        confirmation_token = generate_email_confirmation_token()
        self.user = await crud.user.set_email_confirmation_token(
            self.db, db_obj=self.user, token=confirmation_token
        )
        
        # Send confirmation email asynchronously
        await email_queue.add_email_task(
            email_service.send_confirmation_email,
            to_email=self.user.email,
            first_name=self.user.first_name,
            confirmation_token=confirmation_token
        )
        
        self.response_data = {"message": "Confirmation email sent successfully"}
        self.status_code = status.HTTP_200_OK
        self.response_message = "Confirmation email sent successfully"

    async def process_flow(self):
        await self.find_user()
        if self.early_response:
            return
        await self.resend_email()

