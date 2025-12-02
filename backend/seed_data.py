"""
Script to seed the database with sample data
Run with: poetry run python seed_data.py
"""
import asyncio
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta

from crud import user, category, product, discount
from crud.schemas import (
    UserCreate,
    CategoryCreate,
    ProductCreate,
    DiscountCreate,
)
from instance.config import config
from db.session import AsyncSessionMaker


async def seed_data():
    """Seed the database with sample data"""
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        print("🌱 Starting database seeding...\n")
        
        # 1. Create Admin User
        print("1️⃣ Creating admin user...")
        admin_email = "admin@gmail.com"
        existing_admin = await user.get_by_email(db, email=admin_email)
        if not existing_admin:
            admin_user = UserCreate(
                first_name="Admin",
                last_name="User",
                email=admin_email,
                password="Mohammad@941",
                timezone="UTC",
            )
            created_admin = await user.create(db, obj_in=admin_user)
            async with db as session:
                created_admin.role = "admin"
                session.add(created_admin)
                await session.commit()
                await session.refresh(created_admin)
            print(f"   ✅ Admin user created: {admin_email}")
        else:
            if existing_admin.role != "admin":
                async with db as session:
                    existing_admin.role = "admin"
                    session.add(existing_admin)
                    await session.commit()
                print(f"   ✅ Admin user updated: {admin_email}")
            else:
                print(f"   ⏭️  Admin user already exists: {admin_email}")
        
        # 2. Create Customer Users
        print("\n2️⃣ Creating customer users...")
        customers_data = [
            {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "password": "Password123!",
            },
            {
                "first_name": "Jane",
                "last_name": "Smith",
                "email": "jane.smith@example.com",
                "password": "Password123!",
            },
            {
                "first_name": "Bob",
                "last_name": "Johnson",
                "email": "bob.johnson@example.com",
                "password": "Password123!",
            },
        ]
        
        created_customers = []
        for customer_data in customers_data:
            existing_customer = await user.get_by_email(db, email=customer_data["email"])
            if not existing_customer:
                customer = UserCreate(
                    first_name=customer_data["first_name"],
                    last_name=customer_data["last_name"],
                    email=customer_data["email"],
                    password=customer_data["password"],
                    timezone="UTC",
                )
                created_customer = await user.create(db, obj_in=customer)
                created_customers.append(created_customer)
                print(f"   ✅ Customer created: {customer_data['email']}")
            else:
                created_customers.append(existing_customer)
                print(f"   ⏭️  Customer already exists: {customer_data['email']}")
        
        # 3. Create Categories
        print("\n3️⃣ Creating categories...")
        categories_data = [
            {
                "category_name": "Electronics",
                "category_slug": "electronics",
                "description": "Electronic devices and gadgets",
            },
            {
                "category_name": "Clothing",
                "category_slug": "clothing",
                "description": "Apparel and fashion items",
            },
            {
                "category_name": "Books",
                "category_slug": "books",
                "description": "Books and reading materials",
            },
            {
                "category_name": "Home & Garden",
                "category_slug": "home-garden",
                "description": "Home improvement and garden supplies",
            },
            {
                "category_name": "Sports & Outdoors",
                "category_slug": "sports-outdoors",
                "description": "Sports equipment and outdoor gear",
            },
        ]
        
        created_category_ids = []
        for cat_data in categories_data:
            # Check if category exists by slug
            existing_cat = await category.get_by_slug(db, slug=cat_data["category_slug"])
            if not existing_cat:
                category_obj = CategoryCreate(**cat_data)
                created_cat = await category.create(db, obj_in=category_obj)
                created_category_ids.append(created_cat.id)
                print(f"   ✅ Category created: {cat_data['category_name']}")
            else:
                created_category_ids.append(existing_cat.id)
                print(f"   ⏭️  Category already exists: {cat_data['category_name']}")
        
        # 4. Create Products
        print("\n4️⃣ Creating products...")
        products_data = [
            # Electronics
            {
                "product_name": "iPhone 15 Pro",
                "description": "Latest iPhone with A17 Pro chip, 256GB storage",
                "category_id": created_category_ids[0],
                "price": Decimal("999.99"),
                "sku": "IPH15PRO256",
                "quantity": 50,
                "weight": Decimal("0.19").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
                "is_active": True,
            },
            {
                "product_name": "Samsung Galaxy S24",
                "description": "Flagship Android smartphone with 128GB storage",
                "category_id": created_category_ids[0],
                "price": Decimal("799.99"),
                "sku": "SGS24128",
                "quantity": 30,
                "weight": Decimal("0.17").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
                "is_active": True,
            },
            {
                "product_name": "MacBook Pro 14\"",
                "description": "Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD",
                "category_id": created_category_ids[0],
                "price": Decimal("1999.99"),
                "sku": "MBP14M3",
                "quantity": 20,
                "weight": Decimal("1.6"),
                "is_active": True,
            },
            {
                "product_name": "Sony WH-1000XM5 Headphones",
                "description": "Premium noise-cancelling wireless headphones",
                "category_id": created_category_ids[0],
                "price": Decimal("399.99"),
                "sku": "SONYWH1000XM5",
                "quantity": 75,
                "weight": Decimal("0.25"),
                "is_active": True,
            },
            # Clothing
            {
                "product_name": "Classic White T-Shirt",
                "description": "100% cotton, comfortable fit, available in multiple sizes",
                "category_id": created_category_ids[1],
                "price": Decimal("19.99"),
                "sku": "TSHIRT-WHT",
                "quantity": 200,
                "weight": Decimal("0.15"),
                "is_active": True,
            },
            {
                "product_name": "Denim Jeans",
                "description": "Classic blue denim jeans, regular fit",
                "category_id": created_category_ids[1],
                "price": Decimal("49.99"),
                "sku": "JEANS-DENIM",
                "quantity": 150,
                "weight": Decimal("0.5"),
                "is_active": True,
            },
            {
                "product_name": "Leather Jacket",
                "description": "Genuine leather jacket, black color",
                "category_id": created_category_ids[1],
                "price": Decimal("299.99"),
                "sku": "JACKET-LEATHER",
                "quantity": 25,
                "weight": Decimal("1.2"),
                "is_active": True,
            },
            # Books
            {
                "product_name": "The Great Gatsby",
                "description": "Classic American novel by F. Scott Fitzgerald",
                "category_id": created_category_ids[2],
                "price": Decimal("12.99"),
                "sku": "BOOK-GATSBY",
                "quantity": 100,
                "weight": Decimal("0.3"),
                "is_active": True,
            },
            {
                "product_name": "Python Programming Guide",
                "description": "Comprehensive guide to Python programming",
                "category_id": created_category_ids[2],
                "price": Decimal("39.99"),
                "sku": "BOOK-PYTHON",
                "quantity": 80,
                "weight": Decimal("0.8"),
                "is_active": True,
            },
            # Home & Garden
            {
                "product_name": "Coffee Maker",
                "description": "12-cup programmable coffee maker",
                "category_id": created_category_ids[3],
                "price": Decimal("79.99"),
                "sku": "COFFEE-MAKER",
                "quantity": 60,
                "weight": Decimal("2.5"),
                "is_active": True,
            },
            {
                "product_name": "Garden Tool Set",
                "description": "Complete set of gardening tools",
                "category_id": created_category_ids[3],
                "price": Decimal("49.99"),
                "sku": "GARDEN-TOOLS",
                "quantity": 40,
                "weight": Decimal("3.0"),
                "is_active": True,
            },
            # Sports & Outdoors
            {
                "product_name": "Yoga Mat",
                "description": "Premium non-slip yoga mat, 6mm thick",
                "category_id": created_category_ids[4],
                "price": Decimal("29.99"),
                "sku": "YOGA-MAT",
                "quantity": 120,
                "weight": Decimal("1.0"),
                "is_active": True,
            },
            {
                "product_name": "Running Shoes",
                "description": "Comfortable running shoes for daily exercise",
                "category_id": created_category_ids[4],
                "price": Decimal("89.99"),
                "sku": "SHOES-RUNNING",
                "quantity": 90,
                "weight": Decimal("0.6"),
                "is_active": True,
            },
        ]
        
        created_products = []
        for prod_data in products_data:
            # Extract quantity before creating product (ProductCreate doesn't include quantity)
            quantity = prod_data.pop("quantity", 0)
            
            try:
                # Rollback any previous failed transaction
                async with db as session:
                    await session.rollback()
                
                product_obj = ProductCreate(**prod_data)
                created_prod = await product.create(db, obj_in=product_obj)
                
                # Update quantity directly on the product
                if quantity > 0:
                    async with db as session:
                        created_prod.quantity = quantity
                        session.add(created_prod)
                        await session.commit()
                        await session.refresh(created_prod)
                
                created_products.append(created_prod)
                print(f"   ✅ Product created: {prod_data['product_name']} (Qty: {quantity})")
            except Exception as e:
                # Rollback failed transaction
                try:
                    async with db as session:
                        await session.rollback()
                except:
                    pass
                
                error_msg = str(e)
                if "Duplicate entry" in error_msg or "already exists" in error_msg.lower():
                    print(f"   ⏭️  Product already exists: {prod_data['product_name']}")
                else:
                    print(f"   ⚠️  Error creating product {prod_data['product_name']}: {error_msg[:100]}")
                # Restore quantity for next iteration
                prod_data["quantity"] = quantity
        
        # 5. Create Discounts
        print("\n5️⃣ Creating discounts...")
        discounts_data = [
            {
                "code": "WELCOME10",
                "name": "Welcome Discount",
                "description": "10% off for new customers",
                "discount_type": "percentage",
                "discount_value": Decimal("10.00"),
                "minimum_order_amount": Decimal("50.00"),
                "maximum_discount_amount": Decimal("20.00"),
                "usage_limit": 1000,
                "per_user_limit": 1,
                "valid_from": datetime.utcnow(),
                "valid_until": datetime.utcnow() + timedelta(days=365),
                "is_active": True,
            },
            {
                "code": "SAVE20",
                "name": "20% Off Sale",
                "description": "20% off on all electronics",
                "discount_type": "percentage",
                "discount_value": Decimal("20.00"),
                "minimum_order_amount": Decimal("100.00"),
                "maximum_discount_amount": Decimal("50.00"),
                "usage_limit": 500,
                "per_user_limit": 2,
                "product_id": None,
                "category_id": created_category_ids[0],  # Electronics
                "valid_from": datetime.utcnow(),
                "valid_until": datetime.utcnow() + timedelta(days=30),
                "is_active": True,
            },
            {
                "code": "FIXED15",
                "name": "£15 Off",
                "description": "£15 off on orders over £100",
                "discount_type": "fixed",
                "discount_value": Decimal("15.00"),
                "minimum_order_amount": Decimal("100.00"),
                "usage_limit": 200,
                "per_user_limit": 1,
                "valid_from": datetime.utcnow(),
                "valid_until": datetime.utcnow() + timedelta(days=60),
                "is_active": True,
            },
            {
                "code": "BOOKS25",
                "name": "Books Sale",
                "description": "25% off on all books",
                "discount_type": "percentage",
                "discount_value": Decimal("25.00"),
                "minimum_order_amount": Decimal("30.00"),
                "usage_limit": None,
                "per_user_limit": None,
                "category_id": created_category_ids[2],  # Books
                "valid_from": datetime.utcnow(),
                "valid_until": datetime.utcnow() + timedelta(days=90),
                "is_active": True,
            },
        ]
        
        for discount_data in discounts_data:
            try:
                # Rollback any previous failed transaction
                async with db as session:
                    await session.rollback()
                
                discount_obj = DiscountCreate(**discount_data)
                created_discount = await discount.create(db, obj_in=discount_obj)
                print(f"   ✅ Discount created: {discount_data['code']} - {discount_data['name']}")
            except Exception as e:
                # Rollback failed transaction
                try:
                    async with db as session:
                        await session.rollback()
                except:
                    pass
                
                error_msg = str(e)
                if "Duplicate entry" in error_msg or "already exists" in error_msg.lower():
                    print(f"   ⏭️  Discount already exists: {discount_data['code']}")
                else:
                    print(f"   ⚠️  Error creating discount {discount_data['code']}: {error_msg[:100]}")
        
        print("\n✅ Database seeding completed successfully!")
        print("\n📊 Summary:")
        print(f"   • Admin users: 1")
        print(f"   • Customer users: {len(created_customers)}")
        print(f"   • Categories: {len(created_category_ids)}")
        print(f"   • Products: {len(created_products)}")
        print(f"   • Discounts: {len(discounts_data)}")
        print("\n🔑 Admin Login:")
        print(f"   Email: {admin_email}")
        print(f"   Password: Mohammad@941")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(seed_data())

