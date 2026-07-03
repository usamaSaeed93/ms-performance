"""
Google Places API — fetch reviews for a business.

Required env vars (add to .vars):
    GOOGLE_PLACES_API_KEY  – Google Maps / Places API key
    GOOGLE_PLACE_ID        – Your Google Place ID
                             (find it at https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)

Responses are cached in memory for CACHE_TTL_SECONDS so we don't
hammer the API on every page load.
"""
from __future__ import annotations

import asyncio
import json
import time
import urllib.request
import urllib.parse
import urllib.error
from functools import partial
from typing import Any

from instance.config import config
from core.logger import Logger

logger = Logger.get_logger(__file__, __name__)

PLACES_DETAIL_URL = "https://maps.googleapis.com/maps/api/place/details/json"
CACHE_TTL_SECONDS = 3600  # 1 hour

# Simple in-memory cache: (data, fetched_at_timestamp)
_cache: dict[str, tuple[Any, float]] = {}


def _fetch_sync(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=10) as resp:
        return json.loads(resp.read().decode())


async def _fetch_async(url: str) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(_fetch_sync, url))


async def get_google_reviews() -> list[dict]:
    """Return up to 5 Google reviews for the configured Place ID.

    Results are cached for CACHE_TTL_SECONDS.  Returns an empty list when
    the API key / Place ID are not configured or the request fails.
    """
    api_key: str = getattr(config, "GOOGLE_PLACES_API_KEY", "")
    place_id: str = getattr(config, "GOOGLE_PLACE_ID", "")

    if not api_key or not place_id:
        logger.warning("Google Places API key or Place ID not configured — returning empty reviews.")
        return []

    cache_key = place_id
    cached = _cache.get(cache_key)
    if cached:
        data, fetched_at = cached
        if time.time() - fetched_at < CACHE_TTL_SECONDS:
            return data

    params = urllib.parse.urlencode({
        "place_id": place_id,
        "fields": "reviews,rating,user_ratings_total",
        "key": api_key,
        "reviews_sort": "newest",
    })
    url = f"{PLACES_DETAIL_URL}?{params}"

    try:
        response = await _fetch_async(url)
        if response.get("status") != "OK":
            logger.error(f"Google Places API error: {response.get('status')} — {response.get('error_message', '')}")
            return []

        raw_reviews = response.get("result", {}).get("reviews", [])
        reviews = [
            {
                "author_name": r.get("author_name", "Anonymous"),
                "profile_photo_url": r.get("profile_photo_url", ""),
                "rating": r.get("rating", 5),
                "text": r.get("text", ""),
                "time": r.get("time", 0),
                "relative_time": r.get("relative_time_description", ""),
            }
            for r in raw_reviews
        ]

        _cache[cache_key] = (reviews, time.time())
        return reviews

    except Exception as exc:
        logger.error(f"Failed to fetch Google reviews: {exc}")
        return []
