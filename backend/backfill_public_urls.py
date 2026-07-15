"""
One-off backfill: rewrite existing R2 presigned/direct URLs stored in the
database to the permanent public URL (``R2_PUBLIC_URL``).

New uploads already return the permanent public URL once ``R2_PUBLIC_URL`` is
set, and settings are rewritten on read by the settings endpoint. This script
fixes URLs that were persisted earlier (product images, products, services,
clients) so nothing keeps pointing at an expiring presigned URL.

Run once after configuring ``R2_PUBLIC_URL``:

    python backfill_public_urls.py
"""
import asyncio
import json

from sqlalchemy import select

from db.session import AsyncSessionMaker
from instance.config import config
from core.storage import get_storage

from models.product_image import ProductImage
from models.product import Product
from models.service import Service
from models.client import Client
from models.setting import Setting

# (model, attribute) pairs holding a single URL string.
URL_COLUMNS = [
    (ProductImage, "image_url"),
    (Product, "image_url"),
    (Product, "external_url"),
    (Service, "image_url"),
    (Client, "image_url"),
]


def _rewrite_setting_value(storage, value: str) -> str:
    """Settings may hold a plain URL or a JSON array of URLs (e.g. hero images)."""
    if not value:
        return value
    stripped = value.strip()
    if stripped.startswith("["):
        try:
            urls = json.loads(stripped)
            if isinstance(urls, list):
                return json.dumps([
                    storage.to_public_url(u) if isinstance(u, str) else u
                    for u in urls
                ])
        except Exception:
            return value
    return storage.to_public_url(value)


async def backfill():
    storage = get_storage()
    if not hasattr(storage, "to_public_url") or not getattr(storage, "public_url", None):
        print("R2_PUBLIC_URL is not configured (or storage is not R2). Nothing to do.")
        return

    db = AsyncSessionMaker()
    db.sync_session.set_bind_key(config.APP_ENVIRONMENT)

    changed = 0
    try:
        # Simple URL columns
        for model, attr in URL_COLUMNS:
            rows = (await db.execute(select(model))).scalars().all()
            for row in rows:
                original = getattr(row, attr)
                if not original:
                    continue
                rewritten = storage.to_public_url(original)
                if rewritten != original:
                    setattr(row, attr, rewritten)
                    changed += 1
                    print(f"{model.__name__}#{row.id}.{attr}: {original} -> {rewritten}")

        # Settings (plain URL or JSON array)
        settings = (await db.execute(select(Setting))).scalars().all()
        for s in settings:
            original = s.value or ""
            rewritten = _rewrite_setting_value(storage, original)
            if rewritten != original:
                s.value = rewritten
                changed += 1
                print(f"Setting[{s.key}]: updated")

        if changed:
            await db.commit()
            print(f"\nCommitted {changed} URL update(s).")
        else:
            print("No presigned/direct R2 URLs found to rewrite.")
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(backfill())
