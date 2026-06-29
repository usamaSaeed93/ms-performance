"""
Setmore booking integration.

When SETMORE_REFRESH_TOKEN is set in the environment, approved appointments
are automatically pushed to the Setmore calendar.

Required env vars (add to .vars):
    SETMORE_REFRESH_TOKEN  – Your Setmore API refresh token
                             (Setmore dashboard → Apps & Integrations → API)
    SETMORE_STAFF_KEY      – Staff member key to assign appointments to
                             (fetch via GET /api/v1/bookingapi/staff)
    SETMORE_SERVICE_KEY    – Service key to use for appointments
                             (fetch via GET /api/v1/bookingapi/services)
                             Leave blank to let Setmore pick the first service.
"""
from __future__ import annotations

import httpx
from datetime import datetime, timedelta

from instance.config import config
from core.logger import Logger

logger = Logger.get_logger(__file__, __name__)

SETMORE_BASE = "https://developer.setmore.com"
_REFRESH_URL = f"{SETMORE_BASE}/api/v1/bookingapi/auth/refreshtoken"
_CREATE_URL = f"{SETMORE_BASE}/api/v1/bookingapi/appointment/create"
_SERVICES_URL = f"{SETMORE_BASE}/api/v1/bookingapi/services"


class SetmoreClient:
    """Thin async wrapper around the Setmore Booking API."""

    def __init__(self) -> None:
        cfg = config.SETMORE_CONFIG
        self.refresh_token: str = cfg.SETMORE_REFRESH_TOKEN
        self.staff_key: str = cfg.SETMORE_STAFF_KEY
        self.service_key: str = cfg.SETMORE_SERVICE_KEY
        self._access_token: str | None = None

    @property
    def enabled(self) -> bool:
        return bool(self.refresh_token)

    # ------------------------------------------------------------------
    # Auth
    # ------------------------------------------------------------------

    async def _get_access_token(self) -> str | None:
        """Exchange the stored refresh token for a short-lived access token."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    _REFRESH_URL,
                    params={"refreshToken": self.refresh_token},
                )
                data = resp.json()
                if data.get("response") and data.get("data", {}).get("token"):
                    token = data["data"]["token"].get("access_token") or data["data"]["token"].get("accessToken")
                    self._access_token = token
                    return token
                logger.error(f"Setmore token exchange failed: {data}")
        except Exception as exc:
            logger.error(f"Setmore auth request failed: {exc}")
        return None

    # ------------------------------------------------------------------
    # Service discovery (optional fallback)
    # ------------------------------------------------------------------

    async def _get_first_service_key(self, access_token: str) -> str | None:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    _SERVICES_URL,
                    headers={"Authorization": f"Bearer {access_token}"},
                )
                data = resp.json()
                services = data.get("data", {}).get("services", [])
                if services:
                    return services[0].get("key")
        except Exception as exc:
            logger.error(f"Setmore services fetch failed: {exc}")
        return None

    # ------------------------------------------------------------------
    # Create appointment
    # ------------------------------------------------------------------

    async def create_appointment(
        self,
        *,
        customer_name: str,
        customer_email: str,
        customer_phone: str,
        service_type: str,
        appointment_date: str,   # "YYYY-MM-DD"
        appointment_time: str,   # "HH:MM:SS" or "HH:MM"
        notes: str = "",
        slot_duration_minutes: int = 30,
    ) -> bool:
        """
        Push an approved appointment to Setmore.
        Returns True on success, False if disabled or on any error
        (failures are logged but never raise, so they won't break the approval flow).
        """
        if not self.enabled:
            logger.info("Setmore sync skipped — SETMORE_REFRESH_TOKEN not configured.")
            return False

        access_token = await self._get_access_token()
        if not access_token:
            return False

        # Resolve service key
        svc_key = self.service_key
        if not svc_key:
            svc_key = await self._get_first_service_key(access_token) or ""

        # Parse date/time
        time_str = appointment_time[:5]  # "HH:MM"
        try:
            start_dt = datetime.strptime(f"{appointment_date} {time_str}", "%Y-%m-%d %H:%M")
        except ValueError:
            logger.error(f"Setmore: invalid date/time '{appointment_date} {time_str}'")
            return False

        end_dt = start_dt + timedelta(minutes=slot_duration_minutes)

        # Setmore expects "dd/MM/yyyy HH:mm"
        fmt = "%d/%m/%Y %H:%M"
        start_str = start_dt.strftime(fmt)
        end_str = end_dt.strftime(fmt)

        name_parts = customer_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        payload = {
            "staff_key": self.staff_key,
            "service_key": svc_key,
            "customer": {
                "key": "",
                "first_name": first_name,
                "last_name": last_name,
                "email_id": customer_email,
                "cell_phone": customer_phone or "",
            },
            "start_time": start_str,
            "end_time": end_str,
            "label": service_type,
            "comment": notes or "",
        }

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    _CREATE_URL,
                    json=payload,
                    headers={"Authorization": f"Bearer {access_token}"},
                )
                data = resp.json()
                if data.get("response"):
                    logger.info(
                        f"Setmore appointment created for {customer_email} "
                        f"on {appointment_date} at {time_str}"
                    )
                    return True
                else:
                    logger.error(f"Setmore create appointment failed: {data}")
                    return False
        except Exception as exc:
            logger.error(f"Setmore API call failed: {exc}")
            return False


# Module-level singleton
setmore_client = SetmoreClient()
