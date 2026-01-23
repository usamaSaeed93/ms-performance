import asyncio
import jwt
from datetime import datetime, timedelta
from instance.config import config
from crud.user import user
from db.dependency import get_db

async def verify_auth():
    print(f"JWT Secret: {config.JWT_CONFIG.JWT_SECRET_KEY}")
    
    # 1. Create a token for the admin user (ID 16 from previous check)
    user_id = 16
    to_encode = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(minutes=60)}
    token = jwt.encode(to_encode, config.JWT_CONFIG.JWT_SECRET_KEY, algorithm=config.JWT_CONFIG.JWT_ALGORITHM)
    print(f"Generated Token: {token}")
    
    # 2. Decode it (simulating middleware)
    try:
        payload = jwt.decode(token, config.JWT_CONFIG.JWT_SECRET_KEY, algorithms=[config.JWT_CONFIG.JWT_ALGORITHM])
        print(f"Decoded Payload: {payload}")
    except Exception as e:
        print(f"FAILED to decode: {e}")
        return

    # 3. Lookup user in DB
    _db = get_db()
    db = await anext(_db)
    try:
        db_user = await user.get(db, id=payload["user_id"])
        if db_user:
            print(f"SUCCESS: Found user: {db_user.email} (Role: {db_user.role})")
        else:
            print(f"FAILED: User not found for ID {payload['user_id']}")
    except Exception as e:
        print(f"FAILED DB Lookup: {e}")
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(verify_auth())
