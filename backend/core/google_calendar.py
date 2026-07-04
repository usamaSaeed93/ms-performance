"""
Google Calendar integration via Service Account.

No extra packages — uses PyJWT + cryptography (already in pyproject.toml)
for JWT signing, and urllib for HTTP calls.

Setup (one-time, on Google Cloud Console):
  1. Create a project → enable "Google Calendar API"
  2. Create a Service Account → download the JSON key file
  3. Share your Google Calendar with the service account email
     (Settings → Share with specific people → "Make changes to events")
  4. Copy the Calendar ID from Calendar Settings → "Integrate calendar"

Required env vars (add to .vars):
  GOOGLE_SERVICE_ACCOUNT_JSON  – Full contents of the service account JSON key
                                  (paste the entire JSON as a single line / multiline)
  GOOGLE_CALENDAR_ID           – Your Google Calendar ID
                                  (e.g. yourname@gmail.com  or  xxx@group.calendar.google.com)
"""
from __future__ import annotations

import asyncio
import json
import time
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone
from functools import partial
from typing import Optional

import jwt  # PyJWT — already in pyproject.toml

from core.logger import Logger

logger = Logger.get_logger(__file__, __name__)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"
SCOPES = "https://www.googleapis.com/auth/calendar.events"


# ── low-level HTTP helpers ─────────────────────────────────────────────────────

def _post_form(url: str, params: dict) -> dict:
    body = urllib.parse.urlencode(params).encode()  # type: ignore[attr-defined]
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def _post_json(url: str, payload: dict, access_token: str) -> dict:
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def _delete_req(url: str, access_token: str) -> int:
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {access_token}"},
        method="DELETE",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code


# ── token caching ──────────────────────────────────────────────────────────────

_token_cache: dict[str, tuple[str, float]] = {}  # {client_email: (token, expires_at)}


def _build_jwt(sa: dict) -> str:
    now = int(time.time())
    payload = {
        "iss": sa["client_email"],
        "scope": SCOPES,
        "aud": GOOGLE_TOKEN_URL,
        "iat": now,
        "exp": now + 3600,
    }
    return jwt.encode(payload, sa["private_key"], algorithm="RS256")


def _exchange_jwt_for_token(sa: dict) -> str:
    assertion = _build_jwt(sa)
    data = _post_form(GOOGLE_TOKEN_URL, {
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": assertion,
    })
    return data["access_token"]


def _get_access_token_sync(sa: dict) -> str:
    key = sa["client_email"]
    cached_token, expires_at = _token_cache.get(key, ("", 0.0))
    if cached_token and time.time() < expires_at - 60:
        return cached_token
    token = _exchange_jwt_for_token(sa)
    _token_cache[key] = (token, time.time() + 3600)
    return token


# ── Google Calendar client ─────────────────────────────────────────────────────

import urllib.parse  # noqa: E402 — needed for _post_form above


class GoogleCalendarClient:
    """
    Creates/deletes Google Calendar events using a Service Account.
    All operations are fire-and-forget — failures are logged but never raise.
    """

    def __init__(self) -> None:
        import os
        raw = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")
        self._sa: Optional[dict] = None
        if raw.strip():
            try:
                self._sa = json.loads(raw)
            except Exception as exc:
                logger.error(f"GoogleCalendar: failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: {exc}")

        import os as _os
        self._calendar_id: str = _os.getenv("GOOGLE_CALENDAR_ID", "")

    @property
    def enabled(self) -> bool:
        return bool(self._sa and self._calendar_id)

    async def _get_token(self) -> Optional[str]:
        try:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(None, partial(_get_access_token_sync, self._sa))
        except Exception as exc:
            logger.error(f"GoogleCalendar: token exchange failed: {exc}")
            return None

    async def create_event(
        self,
        *,
        summary: str,
        description: str = "",
        start_datetime: datetime,
        end_datetime: datetime,
        attendee_email: Optional[str] = None,
        location: str = "Unit 16, Bakers Ln, Chelmsford CM2 8LD",
    ) -> Optional[str]:
        """
        Create a Google Calendar event.
        Returns the event ID on success, None on failure.
        """
        if not self.enabled:
            logger.info("GoogleCalendar: skipped — not configured.")
            return None

        token = await self._get_token()
        if not token:
            return None

        def _iso(dt: datetime) -> str:
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.strftime("%Y-%m-%dT%H:%M:%S+00:00")

        event_body: dict = {
            "summary": summary,
            "description": description,
            "location": location,
            "start": {"dateTime": _iso(start_datetime), "timeZone": "Europe/London"},
            "end":   {"dateTime": _iso(end_datetime),   "timeZone": "Europe/London"},
            "reminders": {"useDefault": True},
        }
        if attendee_email:
            event_body["attendees"] = [{"email": attendee_email}]

        url = f"{CALENDAR_API_BASE}/calendars/{urllib.parse.quote(self._calendar_id)}/events"
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, partial(_post_json, url, event_body, token)
            )
            event_id = result.get("id")
            if event_id:
                logger.info(f"GoogleCalendar: event created — id={event_id}, summary={summary!r}")
                return event_id
            else:
                logger.error(f"GoogleCalendar: unexpected response: {result}")
                return None
        except Exception as exc:
            logger.error(f"GoogleCalendar: create_event failed: {exc}")
            return None

    async def delete_event(self, event_id: str) -> bool:
        """Delete a calendar event by ID. Returns True on success."""
        if not self.enabled:
            return False

        token = await self._get_token()
        if not token:
            return False

        url = (
            f"{CALENDAR_API_BASE}/calendars/"
            f"{urllib.parse.quote(self._calendar_id)}/events/{urllib.parse.quote(event_id)}"
        )
        try:
            loop = asyncio.get_event_loop()
            status_code = await loop.run_in_executor(
                None, partial(_delete_req, url, token)
            )
            if status_code in (200, 204):
                logger.info(f"GoogleCalendar: event deleted — id={event_id}")
                return True
            else:
                logger.error(f"GoogleCalendar: delete returned HTTP {status_code}")
                return False
        except Exception as exc:
            logger.error(f"GoogleCalendar: delete_event failed: {exc}")
            return False


# Module-level singleton
google_calendar = GoogleCalendarClient()
