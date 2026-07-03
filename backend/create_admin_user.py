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
        
        admin_email = "secure.admin@msperformance.co.uk"
        
        # Check if admin already exists
        existing_user = await user.get_by_email(db, email=admin_email)
        if existing_user:
            print(f"User exists. Updating to admin and resetting password...")
            from core.security import get_password_hash
            hashed_password = get_password_hash("X7m#9Pk$2Lv@5Nq!")
            
            async with db as session:
                existing_user.role = "admin"
                existing_user.hashed_password = hashed_password
                existing_user.email_confirmed = True
                session.add(existing_user)
                await session.commit()
                await session.refresh(existing_user)
                
            print(f"✅ Admin user updated successfully!")
            print(f"   Email: {admin_email}")
            print(f"   Password: X7m#9Pk$2Lv@5Nq!")
            print(f"   Role: admin")
            return
        
        # Create admin user
        admin_user = UserCreate(
            first_name="Admin",
            last_name="User",
            email=admin_email,
            password="X7m#9Pk$2Lv@5Nq!",
            timezone="UTC",
        )
        
        created_user = await user.create(db, obj_in=admin_user)
        
        # Update role to admin using direct database update
        async with db as session:
            created_user.role = "admin"
            created_user.email_confirmed = True
            session.add(created_user)
            await session.commit()
            await session.refresh(created_user)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Email: {admin_email}")
        print(f"   Password: X7m#9Pk$2Lv@5Nq!")
        print(f"   Role: admin")
        
    except Exception as e:
        import traceback
        print(f"❌ Error creating admin user: {e}")
        traceback.print_exc()
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(create_admin_user())

