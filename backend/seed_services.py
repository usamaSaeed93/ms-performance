import asyncio
from db.session import AsyncSessionMaker
from crud.service import create_service, get_service_by_title, update_service
from instance.config import config
from api.v1.schemas.services import ServiceSchema

async def seed_services():
    db = AsyncSessionMaker()
    db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
    
    services = [
        {
            "title": "ECU Remapping",
            "description": "Achieve unmatched performance with bespoke ECU calibrations.",
            "icon": "ECU",
            "link": "/services/ecu-remapping",
            "image_url": "/images/services/ecu-remap-card.png"
        },
        {
            "title": "Dyno Tests",
            "description": "Accurate performance assessment on our AWD dyno cells.",
            "icon": "DYNO",
            "link": "/services/dyno-tests",
            "image_url": None
        },
        {
            "title": "Custom Exhausts",
            "description": "Personalize tone and flow with hand-built exhaust systems.",
            "icon": "EXH",
            "link": "/services/custom-exhausts",
            "image_url": None
        },
        {
            "title": "DPF & EGR Services",
            "description": "Increase efficiency with precise DPF/EGR maintenance.",
            "icon": "DPF",
            "link": "/services/dpf-egr-services",
            "image_url": None
        },
        {
            "title": "Turbo Upgrades",
            "description": "Enhanced turbo systems for maximum power and reliability.",
            "icon": "TURBO",
            "link": "/services/turbo-upgrades",
            "image_url": None,
            "rename_from": "Servicing"   # rename old "Servicing" entry to this
        },
        {
            "title": "Servicing",
            "description": "Comprehensive vehicle servicing to keep your car running at its best.",
            "icon": "SVC",
            "link": "/services/servicing",
            "image_url": None
        },
        {
            "title": "Number Plates",
            "description": "Custom show plates and road-legal number plates made to order.",
            "icon": "PLATE",
            "link": "/services/number-plates",
            "image_url": None
        },
        {
            "title": "Adblue Solutions",
            "description": "Professional AdBlue system diagnostics, refill, and fault resolution.",
            "icon": "ADBLUE",
            "link": "/services/adblue-solutions",
            "image_url": None
        },
        {
            "title": "Performance Tuning",
            "description": "Professional engine tuning services.",
            "icon": "TUNE",
            "link": "/services/performance-tuning",
            "image_url": None
        },
        {
            "title": "ECU Diagnostics",
            "description": "Comprehensive ECU diagnostics.",
            "icon": "DIAG",
            "link": "/services/ecu-diagnostics",
            "image_url": None
        },
        {
            "title": "Stage Upgrades",
            "description": "Complete stage upgrade packages.",
            "icon": "STAGE",
            "link": "/services/stage-upgrades",
            "image_url": None
        },
    ]

    async with db as session:
        for index, service_data in enumerate(services):
            rename_from = service_data.pop("rename_from", None)

            # If this entry was previously stored under a different title, rename it
            if rename_from:
                old_service = await get_service_by_title(session, rename_from)
                if old_service:
                    print(f"Renaming service '{rename_from}' → '{service_data['title']}'")
                    await update_service(
                        session,
                        service_id=old_service.id,
                        title=service_data["title"],
                        link=service_data["link"],
                        description=service_data["description"],
                        icon=service_data.get("icon"),
                    )
                    old_service.display_order = index
                    session.add(old_service)
                    await session.commit()
                    continue

            existing_service = await get_service_by_title(session, service_data["title"])
            if not existing_service:
                print(f"Creating service: {service_data['title']}")
                await create_service(
                    session,
                    title=service_data["title"],
                    description=service_data["description"],
                    icon=service_data["icon"],
                    link=service_data["link"],
                    image_url=service_data["image_url"],
                    display_order=index
                )
            else:
                print(f"Service already exists: {service_data['title']}")
                # Ensure display order and link are correct
                if existing_service.display_order != index:
                    existing_service.display_order = index
                    session.add(existing_service)
                    await session.commit()
    
    await db.close()

if __name__ == "__main__":
    asyncio.run(seed_services())
