"""
Script to seed product images from product image_url fields
Run with: poetry run python seed_product_images.py
"""
import asyncio
from sqlalchemy import select

from crud import product, product_image
from crud.schemas import ProductImageCreate
from instance.config import config
from db.session import AsyncSessionMaker
from models.product import Product


async def seed_product_images():
    """Seed product images from product image_url fields"""
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        print("🖼️  Starting product images seeding...\n")
        
        # Get all products
        print("1️⃣ Fetching all products...")
        stmt = select(Product).filter(Product.image_url.isnot(None)).filter(Product.image_url != "")
        result = await db.execute(stmt)
        products = result.scalars().all()
        
        print(f"   Found {len(products)} products with image URLs\n")
        
        if len(products) == 0:
            print("   ⚠️  No products with image URLs found. Skipping image seeding.")
            return
        
        # Create product images
        print("2️⃣ Creating product images...")
        created_count = 0
        skipped_count = 0
        
        for prod in products:
            # Check if product already has images
            from models.product_image import ProductImage
            check_stmt = select(ProductImage).filter(ProductImage.product_id == prod.id)
            check_result = await db.execute(check_stmt)
            existing_images = check_result.scalars().all()
            
            if len(existing_images) > 0:
                print(f"   ⏭️  Product '{prod.product_name}' already has images. Skipping.")
                skipped_count += 1
                continue
            
            # Create product image from product's image_url
            if prod.image_url:
                product_image_obj = ProductImageCreate(
                    product_id=prod.id,
                    image_url=prod.image_url,
                    alt_text=prod.product_name,
                    sort_order=0,
                    is_primary=True,
                )
                created_image = await product_image.create(db, obj_in=product_image_obj)
                created_count += 1
                print(f"   ✅ Created image for: {prod.product_name}")
        
        print(f"\n✅ Product images seeding completed!")
        print(f"   • Images created: {created_count}")
        print(f"   • Products skipped: {skipped_count}")
        
    except Exception as e:
        print(f"\n❌ Error seeding product images: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(seed_product_images())










