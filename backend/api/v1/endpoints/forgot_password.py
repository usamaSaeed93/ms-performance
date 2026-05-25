from fastapi import status

import crud
from api.base_resource import PostResource
from ..schemas.forgot_password import ForgotPasswordRequest


class ForgotPassword(PostResource):
    """
    POST endpoint to request a password reset email
    """
    request_schema = ForgotPasswordRequest
    authentication_required = False

    api_name = "forgot_password"
    api_url = "forgot_password"

    async def find_user(self):
        """Find user by email."""
        if not hasattr(self.request_data, 'email') or not self.request_data.email:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Email is required"
            self.response_data = {}
            return

        self.user = await crud.user.get_by_email(self.db, email=self.request_data.email)
        # Don't reveal if email exists or not - always return success

    async def send_reset_email(self):
        """Generate reset token and send email."""
        if not hasattr(self, 'user') or not self.user:
            # Silently succeed to prevent email enumeration
            self.response_data = {"message": "If an account with that email exists, a password reset link has been sent."}
            self.status_code = status.HTTP_200_OK
            self.response_message = "Password reset email sent"
            return

        from core.security import generate_password_reset_token
        from core.email import email_service
        from core.email_queue import email_queue

        # Generate reset token
        reset_token = generate_password_reset_token()
        await crud.user.set_password_reset_token(
            self.db, db_obj=self.user, token=reset_token
        )

        # Send reset email asynchronously
        await email_queue.add_email_task(
            email_service.send_password_reset_email,
            to_email=self.user.email,
            first_name=self.user.first_name,
            reset_token=reset_token
        )

        self.response_data = {"message": "If an account with that email exists, a password reset link has been sent."}
        self.status_code = status.HTTP_200_OK
        self.response_message = "Password reset email sent"

    async def process_flow(self):
        await self.find_user()
        if self.early_response:
            return
        await self.send_reset_email()
