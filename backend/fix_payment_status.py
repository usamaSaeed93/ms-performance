"""
Script to fix payment_status for existing orders that have payment_intent_id
but payment_status is still "pending". These orders were paid via Stripe
but the payment_status wasn't set correctly due to the schema issue.
"""
import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db.session import AsyncSessionMaker
from models.sale import Sale
from sqlalchemy import select, update
from instance.config import config

async def fix_payment_status():
    """Update payment_status for orders with payment_intent_id but status is pending."""
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        # Find all orders with payment_intent_id but payment_status is "pending"
        stmt = select(Sale).where(
            Sale.payment_intent_id.isnot(None),
            Sale.payment_status == "pending"
        )
        
        result = await db.execute(stmt)
        orders = result.scalars().all()
        
        print(f"Found {len(orders)} orders to update")
        
        if orders:
            # Update all matching orders
            update_stmt = update(Sale).where(
                Sale.payment_intent_id.isnot(None),
                Sale.payment_status == "pending"
            ).values(
                payment_status="paid",
                payment_method="stripe",
                order_status="processing"  # Set to processing if it's still pending
            )
            
            await db.execute(update_stmt)
            await db.commit()
            
            print(f"Successfully updated {len(orders)} orders:")
            for order in orders:
                print(f"  - Order #{order.id} ({order.order_number or f'ORD-{order.id}'}): Payment Intent {order.payment_intent_id}")
        else:
            print("No orders need updating")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        await db.rollback()
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(fix_payment_status())

