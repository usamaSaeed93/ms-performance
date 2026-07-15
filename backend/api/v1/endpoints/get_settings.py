from fastapi import status
from datetime import datetime, timezone, timedelta
from urllib.parse import urlparse, parse_qs
import json

from api.base_resource import GetResource
from crud import setting as crud_setting
from ..schemas.settings import GetSettingsResponse, SettingSchema


class GetSettings(GetResource):
    response_schema = GetSettingsResponse
    authentication_required = False

    api_name = "get_settings"
    api_url = "settings"  # GET /v1/settings

    # ------------------------------------------------------------------
    # R2 presigned-URL refresh helpers
    # ------------------------------------------------------------------

    def _is_r2_presigned_url(self, value: str) -> bool:
        return bool(
            value
            and "r2.cloudflarestorage.com" in value
            and "X-Amz-Signature" in value
        )

    def _url_is_expiring_soon(self, url: str, threshold_hours: int = 48) -> bool:
        """Return True if the URL is already expired or expires within *threshold_hours*."""
        try:
            params = parse_qs(urlparse(url).query)
            amz_date = params.get("X-Amz-Date", [None])[0]
            amz_expires = params.get("X-Amz-Expires", [None])[0]
            if not amz_date or not amz_expires:
                return True
            created_at = datetime.strptime(amz_date, "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
            expires_at = created_at + timedelta(seconds=int(amz_expires))
            remaining = (expires_at - datetime.now(timezone.utc)).total_seconds()
            return remaining < threshold_hours * 3600
        except Exception:
            return True

    def _extract_object_key(self, url: str, bucket_name: str):
        try:
            path = urlparse(url).path.lstrip("/")
            prefix = bucket_name + "/"
            if path.startswith(prefix):
                return path[len(prefix):]
        except Exception:
            pass
        return None

    def _regenerate_url(self, url: str, r2_client, bucket_name: str) -> str:
        try:
            key = self._extract_object_key(url, bucket_name)
            if not key:
                return url
            return r2_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": key},
                ExpiresIn=604800,  # 7 days — R2 maximum
            )
        except Exception as e:
            self.logger.warning(f"Could not regenerate presigned URL: {e}")
            return url

    def _refresh_value(self, value: str, transform) -> str:
        """Refresh a setting value — handles both a plain URL and a JSON array of URLs.

        *transform* is a callable that maps a single URL to its refreshed value.
        """
        if not value:
            return value

        stripped = value.strip()

        # JSON array (e.g. hero_image_urls)
        if stripped.startswith("["):
            try:
                urls = json.loads(stripped)
                if isinstance(urls, list):
                    return json.dumps([
                        transform(u) if isinstance(u, str) else u
                        for u in urls
                    ])
            except Exception:
                pass
            return value

        # Plain URL
        return transform(value)

    # ------------------------------------------------------------------
    # Main flow
    # ------------------------------------------------------------------

    async def get_settings_list(self):
        raw_settings = await crud_setting.get_all_settings(self.db)
        self.settings = await self._refresh_expired_urls(raw_settings)

    async def _refresh_expired_urls(self, settings):
        """
        Ensure R2 image URLs stored in settings never break.

        When a permanent public base URL is configured (``R2_PUBLIC_URL``), any
        stored presigned/direct R2 URL is rewritten to the permanent public URL
        (which never expires). Otherwise we fall back to regenerating presigned
        URLs that are expired or within 48 h of expiry. Fresh values are
        persisted so the rewrite happens at most once per object.
        """
        try:
            from core.storage import get_storage
            storage = get_storage()
            if not hasattr(storage, "r2_client"):
                return settings  # Local storage — nothing to refresh

            r2_client = storage.r2_client
            bucket_name = storage.bucket_name

            if getattr(storage, "public_url", None):
                # Permanent public URL configured: rewrite to it (no expiry).
                def transform(url: str) -> str:
                    return storage.to_public_url(url)
            else:
                # No public URL: regenerate presigned URLs nearing expiry.
                def transform(url: str) -> str:
                    if self._is_r2_presigned_url(url) and self._url_is_expiring_soon(url):
                        return self._regenerate_url(url, r2_client, bucket_name)
                    return url

            needs_commit = False
            result = []

            for s in settings:
                original = s.value or ""
                refreshed = self._refresh_value(original, transform)

                if refreshed != original:
                    s.value = refreshed  # mark ORM object dirty for batch commit
                    needs_commit = True
                    self.logger.info(f"Queued URL refresh for setting '{s.key}'")

                result.append(SettingSchema(
                    key=s.key,
                    value=s.value,
                    description=s.description,
                    type=s.type or "string",
                ))

            if needs_commit:
                await self.db.commit()
                self.logger.info("Committed refreshed presigned URLs to the database")

            return result

        except Exception as e:
            self.logger.warning(f"Presigned URL refresh skipped — {e}")
            return settings

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_data = {"settings": self.settings}

    async def process_flow(self):
        await self.get_settings_list()
        await self.generate_response()
