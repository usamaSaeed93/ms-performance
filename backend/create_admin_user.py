"""
Script to create an admin user
Run with: poetry run python create_admin_user.py
"""
import asyncio
from crud.user import user
from crud.schemas import UserCreate
from instance.config import config
from db.session import AsyncSessionMaker


async def create_admin_user():
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        admin_email = "admin@admin.com"
        
        # Check if admin already exists
        existing_user = await user.get_by_email(db, email=admin_email)
        if existing_user:
            if existing_user.role == "admin":
                print("Admin user already exists with admin role!")
                print(f"   Email: {existing_user.email}")
                print(f"   Role: {existing_user.role}")
                return
            else:
                print(f"User exists but has role '{existing_user.role}'. Updating to admin...")
                async with db as session:
                    existing_user.role = "admin"
                    session.add(existing_user)
                    await session.commit()
                    await session.refresh(existing_user)
                print(f"✅ Admin user updated successfully!")
                print(f"   Email: {admin_email}")
                print(f"   Password: Mohammad@941")
                print(f"   Role: admin")
                return
        
        # Create admin user
        admin_user = UserCreate(
            first_name="Admin",
            last_name="User",
            email=admin_email,
            password="Mohammad@941",
            timezone="UTC",
        )
        
        created_user = await user.create(db, obj_in=admin_user)
        
        # Update role to admin using direct database update
        async with db as session:
            created_user.role = "admin"
            session.add(created_user)
            await session.commit()
            await session.refresh(created_user)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Email: {admin_email}")
        print(f"   Password: Mohammad@941")
        print(f"   Role: admin")
        
    except Exception as e:
        import traceback
        print(f"❌ Error creating admin user: {e}")
        traceback.print_exc()
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(create_admin_user())

