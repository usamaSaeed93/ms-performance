from datetime import datetime, timedelta
from fastapi import status

import crud
from api.base_resource import PostResource
from ..schemas.reset_password import ResetPasswordRequest


class ResetPassword(PostResource):
    """
    POST endpoint to reset password using a reset token
    """
    request_schema = ResetPasswordRequest
    authentication_required = False

    api_name = "reset_password"
    api_url = "reset_password"

    RESET_TOKEN_EXPIRE_HOURS = 1

    async def validate_token(self):
        """Validate the reset token."""
        if not hasattr(self.request_data, 'token') or not self.request_data.token:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Reset token is required"
            self.response_data = {}
            return

        # Find user by reset token
        self.user = await crud.user.get_by_reset_token(self.db, token=self.request_data.token)
        if not self.user:
            self.early_response = True
            self.status_code = status.HTTP_404_NOT_FOUND
            self.response_message = "Invalid or expired reset token"
            self.response_data = {}
            return

        # Check token expiry
        if self.user.password_reset_sent_at:
            expiry_time = self.user.password_reset_sent_at + timedelta(hours=self.RESET_TOKEN_EXPIRE_HOURS)
            if datetime.utcnow() > expiry_time:
                self.early_response = True
                self.status_code = status.HTTP_400_BAD_REQUEST
                self.response_message = "Reset token has expired. Please request a new one."
                self.response_data = {}
                return

    async def validate_password(self):
        """Validate the new password."""
        if not hasattr(self.request_data, 'new_password') or not self.request_data.new_password:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "New password is required"
            self.response_data = {}
            return

        if len(self.request_data.new_password) < 6:
            self.early_response = True
            self.status_code = status.HTTP_400_BAD_REQUEST
            self.response_message = "Password must be at least 6 characters"
            self.response_data = {}
            return

    async def reset_password(self):
        """Reset the user's password."""
        await crud.user.reset_password(
            self.db, db_obj=self.user, new_password=self.request_data.new_password
        )
        self.response_data = {"message": "Password has been reset successfully"}
        self.status_code = status.HTTP_200_OK
        self.response_message = "Password reset successfully"

    async def process_flow(self):
        await self.validate_token()
        if self.early_response:
            return
        await self.validate_password()
        if self.early_response:
            return
        await self.reset_password()
