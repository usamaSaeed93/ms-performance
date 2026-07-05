"""
HMAC-SHA256 token utilities for appointment email actions.

Tokens are signed with the JWT secret key and bound to a specific
appointment ID + action (approve/deny), so they cannot be forged or
swapped between actions.
"""

import hmac
import hashlib

from instance.config import config


_SECRET = config.JWT_CONFIG.JWT_SECRET_KEY


def generate_email_action_token(appointment_id: int, action: str) -> str:
    """
    Generate an HMAC-SHA256 hex token for an email action link.

    Args:
        appointment_id: The appointment this token is for.
        action: Either "approve" or "deny".

    Returns:
        A hex-encoded HMAC digest.
    """
    message = f"appointment:{appointment_id}:action:{action}"
    return hmac.new(
        _SECRET.encode(), message.encode(), hashlib.sha256
    ).hexdigest()


def verify_email_action_token(
    appointment_id: int, action: str, token: str
) -> bool:
    """
    Verify that *token* is a valid HMAC for the given appointment + action.

    Uses constant-time comparison to prevent timing attacks.
    """
    expected = generate_email_action_token(appointment_id, action)
    return hmac.compare_digest(expected, token)
