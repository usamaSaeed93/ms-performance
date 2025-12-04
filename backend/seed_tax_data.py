"""
Seed script to populate default UK VAT tax classes and rates
Run this after migrations to set up default tax configuration
"""
import asyncio
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import AsyncSessionMaker
from instance.config import config
from crud import tax_class, tax_rate
from crud.schemas.tax import TaxClassCreate, TaxRateCreate


async def seed_tax_data():
    """Seed default UK VAT tax classes and rates"""
    db: AsyncSession = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        # Create default tax classes
        tax_classes = [
            {
                "name": "Standard Rate",
                "slug": "standard-rate",
                "description": "Standard UK VAT rate (20%)",
                "is_active": True
            },
            {
                "name": "Reduced Rate",
                "slug": "reduced-rate",
                "description": "Reduced UK VAT rate (5%)",
                "is_active": True
            },
            {
                "name": "Zero Rate",
                "slug": "zero-rate",
                "description": "Zero-rated items (0% VAT)",
                "is_active": True
            },
        ]
        
        created_classes = {}
        for class_data in tax_classes:
            # Check if tax class already exists
            existing = await tax_class.get_by_slug(db, slug=class_data["slug"])
            if not existing:
                tax_class_obj = await tax_class.create(
                    db, 
                    obj_in=TaxClassCreate(**class_data)
                )
                created_classes[class_data["slug"]] = tax_class_obj
                print(f"Created tax class: {tax_class_obj.name}")
            else:
                created_classes[class_data["slug"]] = existing
                print(f"Tax class already exists: {existing.name}")
        
        # Create default UK VAT rates
        standard_class_id = created_classes.get("standard-rate").id if created_classes.get("standard-rate") else None
        reduced_class_id = created_classes.get("reduced-rate").id if created_classes.get("reduced-rate") else None
        zero_class_id = created_classes.get("zero-rate").id if created_classes.get("zero-rate") else None
        
        tax_rates = [
            {
                "tax_class_id": None,  # Standard rate (no specific tax class)
                "name": "UK VAT Standard Rate",
                "country_code": "GB",
                "rate": Decimal("0.2000"),  # 20%
                "priority": 1,
                "compound": False,
                "shipping": True,
                "order": 1,
                "is_active": True
            },
        ]
        
        # Add tax class specific rates if classes were created
        if standard_class_id:
            tax_rates.append({
                "tax_class_id": standard_class_id,
                "name": "UK VAT Standard Rate (Standard Class)",
                "country_code": "GB",
                "rate": Decimal("0.2000"),  # 20%
                "priority": 1,
                "compound": False,
                "shipping": True,
                "order": 1,
                "is_active": True
            })
        
        if reduced_class_id:
            tax_rates.append({
                "tax_class_id": reduced_class_id,
                "name": "UK VAT Reduced Rate",
                "country_code": "GB",
                "rate": Decimal("0.0500"),  # 5%
                "priority": 1,
                "compound": False,
                "shipping": False,
                "order": 2,
                "is_active": True
            })
        
        if zero_class_id:
            tax_rates.append({
                "tax_class_id": zero_class_id,
                "name": "UK VAT Zero Rate",
                "country_code": "GB",
                "rate": Decimal("0.0000"),  # 0%
                "priority": 1,
                "compound": False,
                "shipping": False,
                "order": 3,
                "is_active": True
            })
        
        for rate_data in tax_rates:
            # Check if rate already exists (simple check by name and country)
            existing_rates = await tax_rate.get_by_country(
                db,
                country_code=rate_data["country_code"],
                tax_class_id=rate_data["tax_class_id"]
            )
            
            # Check if exact rate already exists
            rate_exists = any(
                r.rate == rate_data["rate"] and 
                r.name == rate_data["name"]
                for r in existing_rates
            )
            
            if not rate_exists:
                tax_rate_obj = await tax_rate.create(
                    db,
                    obj_in=TaxRateCreate(**rate_data)
                )
                print(f"Created tax rate: {tax_rate_obj.name} ({tax_rate_obj.rate * 100}%)")
            else:
                print(f"Tax rate already exists: {rate_data['name']}")
        
        await db.commit()
        print("\nTax data seeding completed!")
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(seed_tax_data())

