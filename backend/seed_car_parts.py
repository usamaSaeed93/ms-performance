"""
Script to seed the database with car parts data
Run with: poetry run python seed_car_parts.py
"""
import asyncio
from decimal import Decimal, ROUND_HALF_UP

from crud import category, product
from crud.schemas import CategoryCreate, ProductCreate
from instance.config import config
from db.session import AsyncSessionMaker


async def seed_car_parts():
    """Seed the database with car parts data"""
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        print("🚗 Starting car parts database seeding...\n")
        
        # 1. Create Categories
        print("1️⃣ Creating car parts categories...")
        categories_data = [
            {
                "category_name": "Engine Parts",
                "category_slug": "engine-parts",
                "description": "Engine components and accessories",
            },
            {
                "category_name": "Exhaust Systems",
                "category_slug": "exhaust-systems",
                "description": "Exhaust pipes, mufflers, and catalytic converters",
            },
            {
                "category_name": "Brake Systems",
                "category_slug": "brake-systems",
                "description": "Brake pads, rotors, calipers, and brake lines",
            },
            {
                "category_name": "Suspension",
                "category_slug": "suspension",
                "description": "Shocks, struts, springs, and suspension components",
            },
            {
                "category_name": "Turbo & Superchargers",
                "category_slug": "turbo-superchargers",
                "description": "Turbochargers, superchargers, and related components",
            },
            {
                "category_name": "ECU & Tuning",
                "category_slug": "ecu-tuning",
                "description": "ECU remapping, tuning chips, and performance modules",
            },
            {
                "category_name": "Air Intake Systems",
                "category_slug": "air-intake-systems",
                "description": "Cold air intakes, filters, and intake manifolds",
            },
            {
                "category_name": "Ignition Systems",
                "category_slug": "ignition-systems",
                "description": "Spark plugs, ignition coils, and wires",
            },
            {
                "category_name": "Cooling Systems",
                "category_slug": "cooling-systems",
                "description": "Radiators, intercoolers, and cooling components",
            },
            {
                "category_name": "Transmission",
                "category_slug": "transmission",
                "description": "Transmission parts, clutches, and gear components",
            },
            {
                "category_name": "Body & Exterior",
                "category_slug": "body-exterior",
                "description": "Body panels, bumpers, and exterior accessories",
            },
            {
                "category_name": "Interior Parts",
                "category_slug": "interior-parts",
                "description": "Seats, dashboards, and interior accessories",
            },
            {
                "category_name": "Wheels & Tires",
                "category_slug": "wheels-tires",
                "description": "Alloy wheels, tires, and wheel accessories",
            },
            {
                "category_name": "Electrical",
                "category_slug": "electrical",
                "description": "Batteries, alternators, and electrical components",
            },
            {
                "category_name": "Filters & Fluids",
                "category_slug": "filters-fluids",
                "description": "Oil filters, air filters, and automotive fluids",
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
        
        # 2. Create Products
        print("\n2️⃣ Creating car parts products...")
        products_data = [
            # Engine Parts
            {
                "product_name": "Uprated Throttle Actuators - BMW E90 | E92 | E93 M3 (PAIR)",
                "description": "High-performance throttle actuators for BMW M3. Direct replacement for improved throttle response.",
                "category_id": created_category_ids[0],
                "price": Decimal("145.00"),
                "sale_price": Decimal("120.00"),
                "sku": "THR-ACT-BMW-M3",
                "quantity": 15,
                "weight": Decimal("0.8"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Performance Camshaft Set - VW Golf GTI",
                "description": "High-lift camshafts for increased power and torque. CNC machined from billet steel.",
                "category_id": created_category_ids[0],
                "price": Decimal("450.00"),
                "sku": "CAM-VW-GTI",
                "quantity": 8,
                "weight": Decimal("2.5"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Forged Pistons - Subaru WRX STI",
                "description": "Forged aluminum pistons for high-performance builds. Compatible with EJ25 engine.",
                "category_id": created_category_ids[0],
                "price": Decimal("680.00"),
                "sku": "PST-SUB-WRX",
                "quantity": 5,
                "weight": Decimal("1.2"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCah2SDaCsuwv54-cRUSPcssZu6nvMKrDZUcVNt1TDR5aWWKe4t81HjY&s",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Performance Connecting Rods - Honda Civic Type R",
                "description": "H-beam connecting rods for high-revving engines. Rated for 800+ HP.",
                "category_id": created_category_ids[0],
                "price": Decimal("520.00"),
                "sku": "ROD-HON-CTR",
                "quantity": 6,
                "weight": Decimal("1.5"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8R63prrouoCqPT10aMefb0drCeDEVev0P-86zHX1mOqJM2bnOspUBdg&s",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Exhaust Systems
            {
                "product_name": "Cat-Back Exhaust System - Audi S3 8V",
                "description": "Stainless steel cat-back exhaust system. 3-inch diameter, dual exit tips.",
                "category_id": created_category_ids[1],
                "price": Decimal("850.00"),
                "sale_price": Decimal("720.00"),
                "sku": "EXH-AUD-S3",
                "quantity": 12,
                "weight": Decimal("18.5"),
                "image_url": "https://img.freepik.com/free-photo/various-work-tools-worktop_1170-1505.jpg?semt=ais_hybrid&w=740&q=80",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Downpipe with Sports Cat - VW Golf R",
                "description": "3-inch downpipe with 200-cell sports catalytic converter. Gains 30-40 HP.",
                "category_id": created_category_ids[1],
                "price": Decimal("420.00"),
                "sku": "DP-VW-GR",
                "quantity": 10,
                "weight": Decimal("8.2"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Titanium Exhaust System - Nissan GT-R",
                "description": "Full titanium exhaust system. 50% weight reduction over stock.",
                "category_id": created_category_ids[1],
                "price": Decimal("3200.00"),
                "sku": "EXH-TI-GTR",
                "quantity": 3,
                "weight": Decimal("12.0"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": True,
            },
            
            # Brake Systems
            {
                "product_name": "Performance Brake Pad Set - Front & Rear",
                "description": "High-performance brake pads. Low dust, excellent stopping power.",
                "category_id": created_category_ids[2],
                "price": Decimal("180.00"),
                "sku": "BRK-PAD-PERF",
                "quantity": 25,
                "weight": Decimal("2.8"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCah2SDaCsuwv54-cRUSPcssZu6nvMKrDZUcVNt1TDR5aWWKe4t81HjY&s",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Slotted & Drilled Brake Rotors - Front Pair",
                "description": "Slotted and cross-drilled rotors for improved cooling and performance.",
                "category_id": created_category_ids[2],
                "price": Decimal("320.00"),
                "sku": "BRK-ROT-SD",
                "quantity": 18,
                "weight": Decimal("12.5"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8R63prrouoCqPT10aMefb0drCeDEVev0P-86zHX1mOqJM2bnOspUBdg&s",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Big Brake Kit - 6 Piston Calipers",
                "description": "Complete big brake kit with 6-piston calipers and 380mm rotors.",
                "category_id": created_category_ids[2],
                "price": Decimal("1850.00"),
                "sku": "BRK-KIT-6P",
                "quantity": 4,
                "weight": Decimal("28.0"),
                "image_url": "https://img.freepik.com/free-photo/various-work-tools-worktop_1170-1505.jpg?semt=ais_hybrid&w=740&q=80",
                "is_active": 1,
                "is_featured": True,
            },
            
            # Suspension
            {
                "product_name": "Coilover Suspension Kit - Height Adjustable",
                "description": "Fully adjustable coilover kit. 32-way damping adjustment.",
                "category_id": created_category_ids[3],
                "price": Decimal("950.00"),
                "sku": "SUS-COIL-ADJ",
                "quantity": 14,
                "weight": Decimal("22.0"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Lowering Springs - 40mm Drop",
                "description": "Progressive rate lowering springs. 40mm drop, improved handling.",
                "category_id": created_category_ids[3],
                "price": Decimal("220.00"),
                "sku": "SUS-SPR-40",
                "quantity": 20,
                "weight": Decimal("5.5"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Turbo & Superchargers
            {
                "product_name": "Hybrid Turbo Upgrade - TD04",
                "description": "Hybrid turbocharger upgrade. 30% more airflow, stock fitment.",
                "category_id": created_category_ids[4],
                "price": Decimal("1250.00"),
                "sku": "TUR-HYB-TD04",
                "quantity": 7,
                "weight": Decimal("8.5"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCah2SDaCsuwv54-cRUSPcssZu6nvMKrDZUcVNt1TDR5aWWKe4t81HjY&s",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Turbo Manifold - T3/T4 Flange",
                "description": "Stainless steel turbo manifold. T3/T4 turbo flange.",
                "category_id": created_category_ids[4],
                "price": Decimal("580.00"),
                "sku": "TUR-MAN-T3",
                "quantity": 9,
                "weight": Decimal("6.8"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8R63prrouoCqPT10aMefb0drCeDEVev0P-86zHX1mOqJM2bnOspUBdg&s",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Supercharger Kit - Rotrex C38",
                "description": "Complete supercharger kit with intercooler. 50% power increase.",
                "category_id": created_category_ids[4],
                "price": Decimal("4500.00"),
                "sku": "SC-KIT-ROT",
                "quantity": 2,
                "weight": Decimal("35.0"),
                "image_url": "https://img.freepik.com/free-photo/various-work-tools-worktop_1170-1505.jpg?semt=ais_hybrid&w=740&q=80",
                "is_active": 1,
                "is_featured": True,
            },
            
            # ECU & Tuning
            {
                "product_name": "Stage 1 ECU Remap - Generic",
                "description": "Stage 1 ECU remap. 20-30% power increase, safe for stock hardware.",
                "category_id": created_category_ids[5],
                "price": Decimal("350.00"),
                "sku": "ECU-STG1",
                "quantity": 50,
                "weight": Decimal("0.1"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Stage 2 ECU Remap - With Hardware",
                "description": "Stage 2 ECU remap. Requires intake and exhaust modifications.",
                "category_id": created_category_ids[5],
                "price": Decimal("450.00"),
                "sku": "ECU-STG2",
                "quantity": 35,
                "weight": Decimal("0.1"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Piggyback ECU - Plug & Play",
                "description": "Plug and play piggyback ECU. Adjustable boost and fuel mapping.",
                "category_id": created_category_ids[5],
                "price": Decimal("680.00"),
                "sku": "ECU-PIGGY",
                "quantity": 12,
                "weight": Decimal("0.3"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCah2SDaCsuwv54-cRUSPcssZu6nvMKrDZUcVNt1TDR5aWWKe4t81HjY&s",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Air Intake Systems
            {
                "product_name": "Cold Air Intake System - Universal",
                "description": "Cold air intake with high-flow filter. 10-15 HP gain.",
                "category_id": created_category_ids[6],
                "price": Decimal("280.00"),
                "sku": "INT-CAI-UNI",
                "quantity": 22,
                "weight": Decimal("3.2"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8R63prrouoCqPT10aMefb0drCeDEVev0P-86zHX1mOqJM2bnOspUBdg&s",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Performance Air Filter - Panel Type",
                "description": "High-flow panel air filter. Washable and reusable.",
                "category_id": created_category_ids[6],
                "price": Decimal("45.00"),
                "sku": "INT-FLT-PAN",
                "quantity": 45,
                "weight": Decimal("0.4"),
                "image_url": "https://img.freepik.com/free-photo/various-work-tools-worktop_1170-1505.jpg?semt=ais_hybrid&w=740&q=80",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Ignition Systems
            {
                "product_name": "Performance Spark Plugs - Iridium",
                "description": "Iridium spark plugs. Better combustion, longer life.",
                "category_id": created_category_ids[7],
                "price": Decimal("65.00"),
                "sku": "IGN-PLG-IR",
                "quantity": 40,
                "weight": Decimal("0.2"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Performance Ignition Coils - Set of 4",
                "description": "High-performance ignition coils. Improved spark energy.",
                "category_id": created_category_ids[7],
                "price": Decimal("180.00"),
                "sku": "IGN-COIL-4",
                "quantity": 18,
                "weight": Decimal("1.2"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": True,
            },
            
            # Cooling Systems
            {
                "product_name": "Front Mount Intercooler - Universal",
                "description": "Large front mount intercooler. 600x300x76mm core.",
                "category_id": created_category_ids[8],
                "price": Decimal("420.00"),
                "sku": "COOL-FMIC-UNI",
                "quantity": 11,
                "weight": Decimal("8.5"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCah2SDaCsuwv54-cRUSPcssZu6nvMKrDZUcVNt1TDR5aWWKe4t81HjY&s",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Aluminum Radiator - Performance",
                "description": "High-performance aluminum radiator. 50% more cooling capacity.",
                "category_id": created_category_ids[8],
                "price": Decimal("380.00"),
                "sku": "COOL-RAD-AL",
                "quantity": 13,
                "weight": Decimal("6.2"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8R63prrouoCqPT10aMefb0drCeDEVev0P-86zHX1mOqJM2bnOspUBdg&s",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Transmission
            {
                "product_name": "Performance Clutch Kit - Stage 2",
                "description": "Stage 2 clutch kit. Handles 400+ HP, organic disc.",
                "category_id": created_category_ids[9],
                "price": Decimal("580.00"),
                "sku": "TRN-CLT-STG2",
                "quantity": 9,
                "weight": Decimal("12.0"),
                "image_url": "https://img.freepik.com/free-photo/various-work-tools-worktop_1170-1505.jpg?semt=ais_hybrid&w=740&q=80",
                "is_active": 1,
                "is_featured": True,
            },
            {
                "product_name": "Short Shifter Kit",
                "description": "Short shifter kit. 40% reduction in throw distance.",
                "category_id": created_category_ids[9],
                "price": Decimal("220.00"),
                "sku": "TRN-SHFT-SHRT",
                "quantity": 16,
                "weight": Decimal("1.8"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Body & Exterior
            {
                "product_name": "Carbon Fiber Hood - Vented",
                "description": "Carbon fiber vented hood. 60% weight reduction.",
                "category_id": created_category_ids[10],
                "price": Decimal("850.00"),
                "sku": "BOD-HOOD-CF",
                "quantity": 5,
                "weight": Decimal("4.5"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": True,
            },
            
            # Interior Parts
            {
                "product_name": "Racing Seats - Bucket Type",
                "description": "FIA approved bucket racing seats. Lightweight and supportive.",
                "category_id": created_category_ids[11],
                "price": Decimal("680.00"),
                "sku": "INT-SEAT-BKT",
                "quantity": 8,
                "weight": Decimal("8.5"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCah2SDaCsuwv54-cRUSPcssZu6nvMKrDZUcVNt1TDR5aWWKe4t81HjY&s",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Wheels & Tires
            {
                "product_name": "Alloy Wheels - 18\" x 8.5\"",
                "description": "Lightweight alloy wheels. 5x112 PCD, ET35 offset.",
                "category_id": created_category_ids[12],
                "price": Decimal("950.00"),
                "sku": "WHE-ALY-18",
                "quantity": 6,
                "weight": Decimal("22.0"),
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8R63prrouoCqPT10aMefb0drCeDEVev0P-86zHX1mOqJM2bnOspUBdg&s",
                "is_active": 1,
                "is_featured": True,
            },
            
            # Electrical
            {
                "product_name": "Performance Battery - AGM Type",
                "description": "AGM performance battery. 70Ah, high CCA rating.",
                "category_id": created_category_ids[13],
                "price": Decimal("180.00"),
                "sku": "ELC-BAT-AGM",
                "quantity": 15,
                "weight": Decimal("18.5"),
                "image_url": "https://img.freepik.com/free-photo/various-work-tools-worktop_1170-1505.jpg?semt=ais_hybrid&w=740&q=80",
                "is_active": 1,
                "is_featured": False,
            },
            
            # Filters & Fluids
            {
                "product_name": "Performance Oil Filter - High Flow",
                "description": "High-flow oil filter. Extended service intervals.",
                "category_id": created_category_ids[14],
                "price": Decimal("25.00"),
                "sku": "FLT-OIL-HF",
                "quantity": 50,
                "weight": Decimal("0.3"),
                "image_url": "https://backend.orbitvu.com/sites/default/files/image/spare-parts-mini.jpg",
                "is_active": 1,
                "is_featured": False,
            },
            {
                "product_name": "Synthetic Engine Oil - 5W-40 (5L)",
                "description": "Fully synthetic engine oil. 5W-40 grade, 5 liter bottle.",
                "category_id": created_category_ids[14],
                "price": Decimal("45.00"),
                "sku": "OIL-SYN-5W40",
                "quantity": 30,
                "weight": Decimal("5.2"),
                "image_url": "https://media.istockphoto.com/id/478107962/photo/auto-parts.jpg?s=612x612&w=0&k=20&c=C31mE-cVYFlLqJp9smDKUczPoBEtoYl5gaGxdvH0lmM=",
                "is_active": 1,
                "is_featured": True,
            },
        ]
        
        created_products = []
        for prod_data in products_data:
            # Generate slug from product name
            base_slug = product.slugify(prod_data["product_name"])
            unique_slug = await product.generate_unique_slug(db, base_slug=base_slug)
            
            product_obj = ProductCreate(
                product_name=prod_data["product_name"],
                slug=unique_slug,
                description=prod_data["description"],
                category_id=prod_data["category_id"],
                price=prod_data["price"],
                sale_price=prod_data.get("sale_price"),
                sku=prod_data["sku"],
                quantity=prod_data["quantity"],
                weight=prod_data["weight"],
                image_url=prod_data.get("image_url"),
                is_active=bool(prod_data.get("is_active", 1)),
                is_featured=prod_data.get("is_featured", False),
            )
            created_prod = await product.create(db, obj_in=product_obj)
            created_products.append(created_prod)
            print(f"   ✅ Product created: {prod_data['product_name']}")
        
        print("\n✅ Car parts seeding completed!")
        print(f"   • Categories: {len(created_category_ids)}")
        print(f"   • Products: {len(created_products)}")
        
    except Exception as e:
        print(f"\n❌ Error seeding car parts: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(seed_car_parts())

