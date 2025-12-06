"""
Script to fix blog content column from TEXT to LONGTEXT
Run this script to update the database column directly
"""
import asyncio
from sqlalchemy import text
from db.session import AsyncSessionMaker
from instance.config import config


async def fix_blog_content_column():
    """Alter the blog content column from TEXT to LONGTEXT"""
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
            # Check current column type
            result = await db.execute(text("""
                SELECT COLUMN_TYPE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'blog' 
                AND COLUMN_NAME = 'content'
            """))
            current_type = result.scalar()
            print(f"Current column type: {current_type}")
            
            if 'longtext' in current_type.lower():
                print("Column is already LONGTEXT. No changes needed.")
                return
            
            # Alter the column to LONGTEXT
            print("Altering column from TEXT to LONGTEXT...")
            await db.execute(text("ALTER TABLE blog MODIFY COLUMN content LONGTEXT NOT NULL"))
            await db.commit()
            print("✅ Successfully changed blog.content column to LONGTEXT!")
            
            # Verify the change
            result = await db.execute(text("""
                SELECT COLUMN_TYPE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'blog' 
                AND COLUMN_NAME = 'content'
            """))
            new_type = result.scalar()
            print(f"New column type: {new_type}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            await db.rollback()
            raise
    finally:
        await db.close()


if __name__ == "__main__":
    print("Fixing blog content column...")
    asyncio.run(fix_blog_content_column())
    print("Done!")

