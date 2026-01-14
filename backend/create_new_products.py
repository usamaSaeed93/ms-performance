
import asyncio
from datetime import datetime
from decimal import Decimal
import random

from db.session import AsyncSessionMaker
from models.product import Product
from models.category import Category
from instance.config import config
from sqlalchemy import select

# List of successful uploaded images from logs (Signed URLs)
# Note: These URLs have expiration times (usually 7 days from generation)
AVAILABLE_IMAGES = [
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220136_813105b5_product-jpeg-500x500.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220138Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=9a76495d9e63fc5b515471964bf6a84000e84b3c7c73c1dd986dbc47c764f6f9",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220150_f48d1481_51wwRb0q-tL._AC_UF894%2C1000_QL80_.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220151Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=3d737c4bf3f3a63b7858a7006a633f59a70595d030172f15a9b227b5d4287e2a",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220151_a424653c_71fyP0vfFWL._AC_UF1000%2C1000_QL80_.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220153Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=58c1eb354b3a04932f1f09c8bdfb183b324ba18cf067f89cb99a55350d9b196f",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220153_50a5c793_81FEPZErlWL._AC_UF1000%2C1000_QL80_.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220154Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=fe2acc8620f9aebd0a5af07a363f22f68bd84aa480d121ef09765febe81674c0",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220155_0109bb96_20240601160633a2e789.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220157Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=683a62da789d6c12ed9af2def80d36d573d98f2b8012022042d197b43c0f5ad7",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220157_f53b9964_adfd931d8904d2c496e3a5839bbc7463.jpg_720x720q80.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220158Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=ad2be24b2af2aed7760479202c5d63b150e349ce976a9aa8637f7ee53048fe34",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220158_59b5e19b_car-exhaust-pipe-320w.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220159Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=089fa8e567f480ec8b94328c110d621988cf7935ba890dc86a0c968d759ce323",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220159_6d25ca0b_images_1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220200Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=3f5768e8577571e8a2e91779ae9263fe216158f663ff9ab6dd6b0decd1df5816",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220201_97b2a6ee_images_2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220201Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=2ec46ca2e7ddbe1993fe8836b4a32979560750c65c8fb900482bff589eed8acb",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220202_ad101c59_images_3.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220203Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=76fc36c199c85d9e2338de05528d710e4067dce025616a7742b94fd08af0bbe3",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220204_e18208d1_pngtree-stainless-steel-exhaust-system-perfect-for-efficient-flow-and-vehicle-noise-png-image_18463109.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220205Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=30cc448961e5aeb4068a0d34da1d3dd6c3bf5e7ce144a8403",
    "https://3e4c2fcf0015dae6a69788cd2aedffec.r2.cloudflarestorage.com/ms-performance/products/20260114_220206_73cc88ff_product-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=27daa7e7f5616cac3174cdabfc371add%2F20260114%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260114T220207Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a6f6cc0ace5d73b56d3655b4accf09cca5b7f0ad0ff281b79262750755d36399"
]

# 10 Premium Car Exhaust Products (Different Brands)
PRODUCTS_DATA = [
    {
        "product_name": "Akrapovič Evolution Line Titanium Exhaust - BMW M3/M4",
        "price": 5499.00,
        "sale_price": None,
        "short_description": "Premium titanium exhaust system for BMW M3 (G80) and M4 (G82). Ultra-lightweight with signature sound.",
        "description": "The Akrapovič Evolution Line is the pinnacle of exhaust technology. Crafted entirely from high-grade titanium, this system reduces weight by over 10kg compared to stock while delivering an unmistakable deep racing tone. Includes carbon fiber tailpipes and optimized link pipes for maximum flow.\n\nGain +10.3 kW at 6000 rpm and +14.1 Nm at 6000 rpm.",
        "sku": "AKR-EVO-BMWM3",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 5,
        "weight": 11.5,
    },
    {
        "product_name": "Remus Sport Exhaust with Integrated Valves - VW Golf R",
        "price": 1899.00,
        "sale_price": 1750.00,
        "short_description": "Stainless steel sport exhaust with integrated valves for VW Golf R Mk8. Aggressive sound on demand.",
        "description": "Remus innovation delivers a 100% stainless steel cat-back system that integrates perfectly with the factory valve control. Switch between 'Comfort' and 'Race' modes instantly. Features shot-blasted surfaces and increased tailpipe diameter for reduced backpressure.",
        "sku": "REM-VW-R8",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 12,
        "weight": 18.2,
    },
    {
        "product_name": "Borla ATAK Cat-Back™ Exhaust - Ford Mustang GT",
        "price": 2150.99,
        "sale_price": None,
        "short_description": "The loudest, most aggressive exhaust in the Borla lineup for the 5.0L Coyote V8.",
        "description": "Borla's Acoustically Tuned Applied Kinetics (ATAK) technology produces the highest available decibel levels for street-legal exhaust systems. Designed specifically for the Mustang GT, this system eliminates drone while providing a raw, visceral V8 scream.",
        "sku": "BOR-ATAK-MUST",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 8,
        "weight": 22.0,
    },
    {
        "product_name": "MagnaFlow Street Series Performance Exhaust - Chevy Camaro SS",
        "price": 1650.00,
        "sale_price": None,
        "short_description": "Deep, smooth american muscle sound. Mandrel-bent tubing for improved airflow.",
        "description": "The MangaFlow Street Series provides a balanced, deep exhaust note that announces your arrival without being overly obnoxious. Constructed from 409 stainless steel with straight-through mufflers for unrestricted power gains.",
        "sku": "MGF-STR-CAM",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 15,
        "weight": 24.5,
    },
    {
        "product_name": "Armytrix Valvetronic Exhaust - Mercedes-AMG C63",
        "price": 4200.00,
        "sale_price": 3899.00,
        "short_description": "F1-inspired sound with smartphone app control. Unlock the fury of the AMG V8.",
        "description": "Armytrix brings cutting-edge technology to exhaust systems. Using the OBDII dongle and smartphone app, you can map the exhaust valves to open at specific RPMs or throttle positions. When open, it's a straight-pipe monster; closed, it's civilized for the commute.",
        "sku": "ARM-VALVE-C63",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 3,
        "weight": 19.0,
    },
    {
        "product_name": "HKS Hi-Power Spec-L II - Toyota GR86 / BRZ",
        "price": 1250.00,
        "sale_price": None,
        "short_description": "Super lightweight Japanese tuning exhaust. Reduces weight by 50% vs stock.",
        "description": "HKS designed the Spec-L II with one goal: weight reduction. Using ultra-thin stainless steel walls, they achieved a system that weighs half as much as the OEM exhaust, improving the power-to-weight ratio of the lightweight GR86 chassis. Distinctive carbon-wrapped tips.",
        "sku": "HKS-HIP-GR86",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 20,
        "weight": 9.8,
    },
    {
        "product_name": "Invidia Gemini R400 Titanium Tip Exhaust - Subaru WRX STI",
        "price": 1399.00,
        "sale_price": 1299.00,
        "short_description": "Quad titanium blue tips with a deep boxer rumble. Full 3-inch piping.",
        "description": "The Invidia R400 Gemini is the gold standard for Subaru owners. It features a unique muffler design that unleashes the classic boxer engine rumble without the highway drone. The quad titanium burnt tips look aggressive and resist corrosion.",
        "sku": "INV-R400-STI",
        "category_name": "Exhaust Systems",
        "stock_status": "out_of_stock",
        "quantity": 0,
        "weight": 21.0,
    },
    {
        "product_name": "Milltek Sport Non-Resonated System - Audi RS3",
        "price": 2800.00,
        "sale_price": None,
        "short_description": "The ultimate 5-cylinder soundtrack. Non-resonated for maximum volume and pops.",
        "description": "Let the 5-cylinder engine sing. This Milltek system removes the factory resonators to provide a raw, rally-inspired sound including the famous DSG 'farts' and overrun crackles. Made in the UK from aircraft-grade T304 stainless steel.",
        "sku": "MIL-NONRES-RS3",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 7,
        "weight": 16.5,
    },
    {
        "product_name": "Capristo Exhaust System with Programmable Remote - Ferrari 488",
        "price": 7500.00,
        "sale_price": None,
        "short_description": "Exotic high-pitched wail for the twin-turbo V8. Includes heat shielding.",
        "description": "Capristo is world-renowned for making turbocharged Ferraris sound like naturally aspirated F1 cars. This system includes their patented programmable control unit (CES-3) which monitors backpressure to optimize performance and protect the engine.",
        "sku": "CAP-FER-488",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 1,
        "weight": 14.0,
    },
    {
        "product_name": "Flowmaster American Thunder Crossmember Back - C3 Corvette",
        "price": 950.00,
        "sale_price": None,
        "short_description": "Classic muscle car sound for vintage restoration builds. 2.5-inch tubing.",
        "description": "Restore the roar of the past. The American Thunder system is designed for classic C3 Corvettes, offering a moderate to aggressive exterior exhaust tone. Features Delta Flow technology for improved scavenging and performance.",
        "sku": "FLOW-AMER-C3",
        "category_name": "Exhaust Systems",
        "stock_status": "in_stock",
        "quantity": 10,
        "weight": 28.0,
    }
]

async def seed_products():
    db = AsyncSessionMaker()
    db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
    
    try:
        print("🌱 Starting product seed (Exhausts with Images)...")
        
        # Shuffle images to randomise assignment
        random.shuffle(AVAILABLE_IMAGES)
        
        async with db as session:
            # 1. Create Categories first (if they don't exist)
            categories_map = {}
            
            # Prepare data with random images
            products_to_create = []
            for i, p_data in enumerate(PRODUCTS_DATA):
                # Assign a random image from the pool, looping if necessary
                image_url = AVAILABLE_IMAGES[i % len(AVAILABLE_IMAGES)]
                p_data["image_url"] = image_url
                products_to_create.append(p_data)

            # Process products
            for p_data in products_to_create:
                cat_name = p_data.get("category_name")
                
                if cat_name not in categories_map:
                    # Check DB
                    result = await session.execute(select(Category).where(Category.category_name == cat_name))
                    category = result.scalars().first()
                    
                    if not category:
                        print(f"   Creating category: {cat_name}")
                        category = Category(
                            category_name=cat_name,
                            category_slug=cat_name.lower().replace(" ", "-"),
                            description=f"Performance {cat_name} for your vehicle."
                        )
                        session.add(category)
                        await session.flush() # Flush to get ID
                        
                    categories_map[cat_name] = category.id

                # Remove category_name key before creating Product object
                product_data_copy = p_data.copy()
                product_data_copy.pop("category_name", None)

                # Check if product exists by SKU
                sku = product_data_copy["sku"]
                result = await session.execute(select(Product).where(Product.sku == sku))
                existing_product = result.scalars().first()
                
                if existing_product:
                    print(f"   ⚠️ Product {sku} already exists. Updating image...")
                    # Update image only
                    existing_product.image_url = product_data_copy["image_url"]
                    session.add(existing_product)
                    continue
                
                # Create Product
                print(f"   Creating product: {product_data_copy['product_name']}")
                new_product = Product(
                    **product_data_copy,
                    category_id=categories_map[cat_name],
                    slug=product_data_copy["product_name"].lower().replace(" ", "-").replace("(", "").replace(")", "").replace("/", "").replace("™", ""),
                    status="published",
                    is_active=1,
                    is_featured=random.choice([True, False])
                )
                session.add(new_product)
            
            await session.commit()
            print("✅ Product seeding complete!")

    except Exception as e:
        import traceback
        print(f"❌ Error seeding products: {e}")
        traceback.print_exc()
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(seed_products())
