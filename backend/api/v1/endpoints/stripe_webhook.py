import os
import json
import stripe
from fastapi import Request, status, BackgroundTasks
from fastapi.responses import JSONResponse

import crud
from db.dependency import get_db
from db.session import AsyncSessionMaker
from instance.config import config
from core.tax import TaxCalculator
from decimal import Decimal

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
stripe_webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")


async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Handle Stripe webhook events.
    This endpoint should be added to Stripe dashboard webhooks.
    URL: https://mustang-workable-snake.ngrok-free.app/ecommerce/v1/stripe/webhook
    
    Returns 200 immediately after verifying the signature, then processes the event in the background.
    This prevents Stripe from timing out due to long processing times.
    
    Features:
    - Event deduplication (prevents processing same event twice)
    - Idempotency checks (prevents duplicate orders)
    - Database transactions (ensures data consistency)
    - Task queue with retries (ensures reliability)
    """
    import logging
    import json
    from starlette.requests import ClientDisconnect
    logger = logging.getLogger("stripe.webhook")
    
    # Read body immediately - this must happen before any processing
    try:
        payload = await request.body()
        if not payload:
            logger.error("Webhook received with empty body")
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error": "Empty request body"},
            )
        logger.debug(f"Webhook body read successfully, size: {len(payload)} bytes")
    except ClientDisconnect as e:
        logger.error(f"Client disconnected before body could be read: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Client disconnected"},
        )
    except Exception as e:
        logger.error(f"Failed to read request body: {type(e).__name__}: {str(e)}")
        import traceback
        logger.error(f"Traceback: {''.join(traceback.format_exc())}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Failed to read request body"},
        )
    
    sig_header = request.headers.get("stripe-signature")

    logger.info(f"Webhook received - Signature: {sig_header[:20] if sig_header else 'None'}...")

    if not stripe_webhook_secret:
        logger.error("Webhook secret not configured")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Webhook secret not configured"},
        )

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe_webhook_secret
        )
        event_id = event.get("id")
        event_type = event.get("type")
        logger.info(f"Webhook event verified - Type: {event_type}, ID: {event_id}")
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": f"Invalid payload: {str(e)}"},
        )
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid webhook signature: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": f"Invalid signature: {str(e)}"},
        )

    # Check for event deduplication
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        # Check if event was already processed
        existing_event = await crud.webhook_event.get_by_event_id(db, event_id=event_id)
        if existing_event and existing_event.processed:
            logger.info(f"Event {event_id} already processed, skipping")
            await db.close()
            return JSONResponse(status_code=status.HTTP_200_OK, content={"received": True, "duplicate": True})
        
        # Create or update webhook event record
        if not existing_event:
            from models.webhook_event import WebhookEvent
            webhook_event_obj = WebhookEvent(
                event_id=event_id,
                event_type=event_type,
                payment_intent_id=event.get("data", {}).get("object", {}).get("id") if event_type.startswith("payment_intent") else None,
                processed=False
            )
            db.add(webhook_event_obj)
        else:
            existing_event.retry_count += 1
            db.add(existing_event)
        
        # Create task in queue for processing
        from models.webhook_task import WebhookTask
        task = WebhookTask(
            event_id=event_id,
            event_type=event_type,
            event_data=json.loads(json.dumps(event)),  # Convert to JSON-serializable dict
            status="pending"
        )
        db.add(task)
        await db.commit()
        
        logger.info(f"Event {event_id} queued for processing")
    except Exception as e:
        logger.error(f"Error creating webhook event/task record: {str(e)}")
        import traceback
        logger.error(f"Traceback: {''.join(traceback.format_exc())}")
        await db.rollback()
    finally:
        await db.close()

    # Handle the event in the background to avoid timeout
    logger.info(f"Queueing webhook event for background processing: {event_type}")
    
    # Process event in background
    background_tasks.add_task(process_webhook_event, event)
    
    # Return immediately to prevent Stripe timeout
    return JSONResponse(status_code=status.HTTP_200_OK, content={"received": True})


async def process_webhook_event(event: dict):
    """
    Process webhook event in the background.
    This function is called asynchronously after the webhook response is sent.
    
    Features:
    - Updates task status in queue
    - Marks events as processed
    - Handles retries on failure
    """
    import logging
    logger = logging.getLogger("stripe.webhook")
    
    event_id = event.get("id")
    event_type = event.get("type")
    logger.info(f"Processing webhook event in background: {event_type}, Event ID: {event_id}")
    
    db = AsyncSessionMaker()
    task = None
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        # Get task from queue
        task = await crud.webhook_task.get_by_event_id(db, event_id=event_id)
        if task:
            await crud.webhook_task.mark_as_processing(db, task_id=task.id)
            await db.commit()
        
        # Process the event
        if event_type == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            payment_intent_id = payment_intent.get("id")
            logger.info(f"Payment succeeded - Payment Intent ID: {payment_intent_id}")
            # Store event_id in metadata for tracking
            payment_intent["_event_id"] = event_id
            await handle_payment_success(payment_intent)
        elif event_type == "checkout.session.completed":
            # Handle Stripe Checkout session completion
            checkout_session = event["data"]["object"]
            session_id = checkout_session.get("id")
            logger.info(f"Checkout session completed - Session ID: {session_id}")
            checkout_session["_event_id"] = event_id
            await handle_checkout_session_completed(checkout_session)
        elif event_type == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            payment_intent_id = payment_intent.get("id")
            logger.warning(f"Payment failed - Payment Intent ID: {payment_intent_id}")
            await handle_payment_failure(payment_intent)
        elif event_type == "charge.refunded":
            charge = event["data"]["object"]
            charge_id = charge.get("id")
            logger.info(f"Charge refunded - Charge ID: {charge_id}")
            await handle_refund(charge)
        else:
            logger.info(f"Unhandled webhook event type: {event_type}")
        
        # Mark event and task as completed
        if task:
            await crud.webhook_task.mark_as_completed(db, task_id=task.id)
        await crud.webhook_event.mark_as_processed(db, event_id=event_id)
        await db.commit()
        
        logger.info(f"Event {event_id} processed successfully")
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error processing webhook event {event_type} (ID: {event_id}): {error_message}")
        import traceback
        logger.error(f"Traceback: {''.join(traceback.format_exc())}")
        
        # Mark task as failed and schedule retry
        if task:
            try:
                await crud.webhook_task.mark_as_failed(
                    db, 
                    task_id=task.id, 
                    error_message=error_message,
                    retry=True
                )
                await crud.webhook_event.mark_as_processed(
                    db, 
                    event_id=event_id, 
                    error_message=error_message
                )
                await db.commit()
            except Exception as db_error:
                logger.error(f"Error updating task status: {str(db_error)}")
                await db.rollback()
        
        # Re-raise to allow FastAPI BackgroundTasks to log it
        raise
    finally:
        await db.close()


async def handle_payment_success(payment_intent):
    """
    Handle successful payment and create order.
    
    Features:
    - Idempotency check (prevents duplicate orders)
    - Database transaction (ensures data consistency)
    - Payment amount validation
    """
    import logging
    logger = logging.getLogger("stripe.webhook")
    
    payment_intent_id = payment_intent.get("id")
    logger.info(f"Processing payment success for Payment Intent: {payment_intent_id}")
    
    metadata = payment_intent.get("metadata", {})
    user_id = int(metadata.get("user_id", 0))
    
    if not user_id:
        logger.error(f"No user_id in payment intent metadata for Payment Intent: {payment_intent_id}")
        return
    
    logger.info(f"Creating order for user_id: {user_id}, Payment Intent: {payment_intent_id}")

    # Get database session
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        # IDEMPOTENCY CHECK: Check if order already exists for this payment_intent_id
        # Use a separate query session for this check to avoid transaction conflicts
        existing_sale = await crud.sale.get_by_payment_intent_id(db, payment_intent_id=payment_intent_id)
        if existing_sale:
            logger.info(f"Order already exists for Payment Intent {payment_intent_id}: Sale ID {existing_sale.id}, Order Number {existing_sale.order_number or f'ORD-{existing_sale.id}'}")
            await db.close()
            return existing_sale
        
        # Parse items from metadata
        import ast
        items = ast.literal_eval(metadata.get("items", "[]"))
        shipping_cost = Decimal(metadata.get("shipping_cost", "0"))
        country_code = metadata.get("country_code", "GB")
        state_code = metadata.get("state_code") or None
        postcode = metadata.get("postcode") or None
        city = metadata.get("city") or None
        shipping_address = metadata.get("shipping_address") or None

        # Process items and calculate totals (read-only operations before transaction)
        successful_purchases = []
        products_cache = {}
        inventory_updates = []  # Store inventory updates for transaction

        for item_data in items:
            product_id = item_data["product_id"]
            quantity = item_data["quantity"]

            # Get product
            if product_id in products_cache:
                product = products_cache[product_id]
            else:
                product = await crud.product.get(db, id=product_id)
                if not product:
                    continue
                products_cache[product_id] = product

            # Check stock
            if product.quantity < quantity:
                logger.warning(f"Insufficient stock for product {product_id}: requested {quantity}, available {product.quantity}")
                continue

            # Calculate price
            price_per_unit = product.sale_price if product.sale_price else product.price

            # Calculate tax
            tax_calculation = await TaxCalculator.calculate_line_item_tax(
                db=db,
                product=product,
                quantity=quantity,
                price_per_unit=price_per_unit,
                country_code=country_code,
                state_code=state_code,
                postcode=postcode,
                city=city,
            )

            # Create sale item
            from crud.schemas import SaleItemCreate
            sale_item = SaleItemCreate(
                sale_id=0,  # Will be set after sale creation
                product_id=product_id,
                quantity=quantity,
                price_per_unit=price_per_unit,
                tax_rate=tax_calculation["tax_rate"],
                tax_amount=tax_calculation["tax_amount"],
                line_total=tax_calculation["line_total"],
            )

            successful_purchases.append({
                "sale_item": sale_item,
                "line_subtotal": tax_calculation["line_subtotal"],
                "tax_amount": tax_calculation["tax_amount"],
                "product": product,  # Store product for inventory update
            })

            # Store inventory updates (will be applied in transaction)
            if product.manage_stock:
                inventory_updates.append({
                    "product": product,
                    "quantity": quantity,
                })

        if not successful_purchases:
            logger.warning("No successful purchases to create")
            await db.close()
            return

        # Calculate totals
        subtotal = sum([x["line_subtotal"] for x in successful_purchases])
        total_tax = sum([x["tax_amount"] for x in successful_purchases])

        # Calculate shipping tax
        shipping_tax_calc = await TaxCalculator.calculate_shipping_tax(
            db=db,
            shipping_cost=shipping_cost,
            country_code=country_code,
            state_code=state_code,
            postcode=postcode,
            city=city,
            shipping_taxable=True,
        )

        shipping_tax = shipping_tax_calc["tax_amount"]
        total_amount = subtotal + total_tax + shipping_cost + shipping_tax

        # VALIDATE PAYMENT AMOUNT: Verify payment amount matches calculated total
        payment_amount = Decimal(payment_intent.get("amount", 0)) / 100  # Stripe amounts are in cents
        amount_difference = abs(payment_amount - total_amount)
        if amount_difference > Decimal("0.01"):  # Allow 1 cent difference for rounding
            logger.error(
                f"Payment amount mismatch for Payment Intent {payment_intent_id}: "
                f"Payment amount: {payment_amount}, Calculated total: {total_amount}, Difference: {amount_difference}"
            )
            raise ValueError(f"Payment amount ({payment_amount}) doesn't match order total ({total_amount})")

        # DATABASE TRANSACTION: All write operations in a single transaction
        # Create sale
        from crud.schemas import SaleCreate
        sale_data = SaleCreate(
            user_id=user_id,
            subtotal=subtotal,
            tax=total_tax,
            shipping_cost=shipping_cost,
            shipping_tax=shipping_tax,
            total_amount=total_amount,
            payment_status="paid",
            payment_method="stripe",
            order_status="processing",
            payment_intent_id=payment_intent_id,
        )
        
        # Create sale object directly (not using CRUD to avoid auto-commit)
        from models.sale import Sale
        sale = Sale(**sale_data.model_dump())
        db.add(sale)
        await db.flush()  # Get the ID without committing
        
        # Create sale items
        from models.sale_item import SaleItem
        for purchase_data in successful_purchases:
            sale_item_data = purchase_data["sale_item"]
            sale_item_obj = SaleItem(
                sale_id=sale.id,
                product_id=sale_item_data.product_id,
                quantity=sale_item_data.quantity,
                price_per_unit=sale_item_data.price_per_unit,
                tax_rate=sale_item_data.tax_rate,
                tax_amount=sale_item_data.tax_amount,
                line_total=sale_item_data.line_total,
            )
            db.add(sale_item_obj)
        
        # Update inventory (all in same transaction)
        for inv_update in inventory_updates:
            product = inv_update["product"]
            quantity = inv_update["quantity"]
            
            inventory = await crud.inventory.get_by_product_id(db, product_id=product.id)
            if inventory:
                inventory.quantity = max(0, inventory.quantity - quantity)
                db.add(inventory)
            
            # Update product quantity
            product.quantity = max(0, product.quantity - quantity)
            db.add(product)
        
        # Commit all changes in a single transaction
        await db.commit()
        await db.refresh(sale)

        # Send order confirmation email
        user_obj = await crud.user.get(db, id=user_id)
        if user_obj:
            from core.email_queue import email_queue
            from core.email import email_service

            order_items = []
            for purchase_data in successful_purchases:
                product = await crud.product.get(db, id=purchase_data["sale_item"].product_id)
                if product:
                    order_items.append({
                        "name": product.product_name,
                        "quantity": purchase_data["sale_item"].quantity,
                        "price": float(purchase_data["sale_item"].price_per_unit),
                        "total": float(purchase_data["sale_item"].line_total),
                    })

            await email_queue.add_email_task(
                email_service.send_order_confirmation_email,
                to_email=user_obj.email,
                first_name=user_obj.first_name,
                order_number=sale.order_number or f"ORD-{sale.id}",
                order_items=order_items,
                subtotal=float(sale.subtotal),
                tax=float(sale.tax),
                shipping_cost=float(sale.shipping_cost or 0),
                total=float(sale.total_amount),
            )

        logger.info(f"Order created successfully - Sale ID: {sale.id}, Order Number: {sale.order_number or f'ORD-{sale.id}'}")
    except Exception as e:
        logger.error(f"Error processing payment success for Payment Intent {payment_intent_id}: {str(e)}")
        import traceback
        logger.error(f"Traceback: {''.join(traceback.format_exc())}")
        # Rollback transaction on error
        try:
            await db.rollback()
        except Exception:
            pass  # Ignore rollback errors
        # Re-raise to trigger task retry
        raise
    finally:
        await db.close()


async def handle_checkout_session_completed(checkout_session):
    """
    Handle Stripe Checkout session completion.
    This is called when a user completes payment via Stripe Checkout.
    
    The checkout session contains metadata with order details.
    """
    import logging
    logger = logging.getLogger("stripe.webhook")
    
    session_id = checkout_session.get("id")
    payment_intent_id = checkout_session.get("payment_intent")
    payment_status = checkout_session.get("payment_status")
    
    logger.info(f"Processing checkout session: {session_id}, Payment Intent: {payment_intent_id}, Status: {payment_status}")
    
    # Only process if payment succeeded
    if payment_status != "paid":
        logger.info(f"Checkout session {session_id} payment status is {payment_status}, skipping")
        return
    
    # Get metadata from checkout session
    metadata = checkout_session.get("metadata", {})
    user_id = int(metadata.get("user_id", 0))
    
    if not user_id:
        logger.error(f"No user_id in checkout session metadata for Session: {session_id}")
        return
    
    logger.info(f"Creating order for user_id: {user_id}, Session: {session_id}")
    
    # Get database session
    db = AsyncSessionMaker()
    try:
        db.sync_session.set_bind_key(config.APP_ENVIRONMENT)
        
        # IDEMPOTENCY CHECK: Check if order already exists for this payment_intent_id or session_id
        existing_sale = await crud.sale.get_by_payment_intent_id(db, payment_intent_id=payment_intent_id)
        if existing_sale:
            logger.info(f"Order already exists for Payment Intent {payment_intent_id}: Sale ID {existing_sale.id}")
            await db.close()
            return existing_sale
        
        # Parse items from metadata
        import ast
        items = ast.literal_eval(metadata.get("items", "[]"))
        shipping_cost = Decimal(metadata.get("shipping_cost", "0"))
        country_code = metadata.get("country_code", "GB")
        state_code = metadata.get("state_code") or None
        postcode = metadata.get("postcode") or None
        city = metadata.get("city") or None
        shipping_address = metadata.get("shipping_address") or None
        
        # Get customer shipping address from Stripe if provided
        shipping_details = checkout_session.get("shipping_details")
        if shipping_details and not shipping_address:
            address = shipping_details.get("address", {})
            shipping_address = ", ".join(filter(None, [
                address.get("line1"),
                address.get("line2"),
                address.get("city"),
                address.get("state"),
                address.get("postal_code"),
                address.get("country"),
            ]))

        # Process items and calculate totals
        successful_purchases = []
        products_cache = {}
        inventory_updates = []

        for item_data in items:
            product_id = item_data["product_id"]
            quantity = item_data["quantity"]

            if product_id in products_cache:
                product = products_cache[product_id]
            else:
                product = await crud.product.get(db, id=product_id)
                if not product:
                    continue
                products_cache[product_id] = product

            if product.quantity < quantity:
                logger.warning(f"Insufficient stock for product {product_id}")
                continue

            price_per_unit = product.sale_price if product.sale_price else product.price

            tax_calculation = await TaxCalculator.calculate_line_item_tax(
                db=db,
                product=product,
                quantity=quantity,
                price_per_unit=price_per_unit,
                country_code=country_code,
                state_code=state_code,
                postcode=postcode,
                city=city,
            )

            from crud.schemas import SaleItemCreate
            sale_item = SaleItemCreate(
                sale_id=0,
                product_id=product_id,
                quantity=quantity,
                price_per_unit=price_per_unit,
                tax_rate=tax_calculation["tax_rate"],
                tax_amount=tax_calculation["tax_amount"],
                line_total=tax_calculation["line_total"],
            )

            successful_purchases.append({
                "sale_item": sale_item,
                "line_subtotal": tax_calculation["line_subtotal"],
                "tax_amount": tax_calculation["tax_amount"],
                "product": product,
            })

            if product.manage_stock:
                inventory_updates.append({
                    "product": product,
                    "quantity": quantity,
                })

        if not successful_purchases:
            logger.warning("No successful purchases to create")
            await db.close()
            return

        # Calculate totals
        subtotal = sum([x["line_subtotal"] for x in successful_purchases])
        total_tax = sum([x["tax_amount"] for x in successful_purchases])

        shipping_tax_calc = await TaxCalculator.calculate_shipping_tax(
            db=db,
            shipping_cost=shipping_cost,
            country_code=country_code,
            state_code=state_code,
            postcode=postcode,
            city=city,
            shipping_taxable=True,
        )

        shipping_tax = shipping_tax_calc["tax_amount"]
        total_amount = subtotal + total_tax + shipping_cost + shipping_tax

        # Create sale
        from crud.schemas import SaleCreate
        from models.sale import Sale
        from models.sale_item import SaleItem
        
        sale_data = SaleCreate(
            user_id=user_id,
            subtotal=subtotal,
            tax=total_tax,
            shipping_cost=shipping_cost,
            shipping_tax=shipping_tax,
            total_amount=total_amount,
            payment_status="paid",
            payment_method="stripe",
            order_status="processing",
            payment_intent_id=payment_intent_id,
        )
        
        sale = Sale(**sale_data.model_dump())
        db.add(sale)
        await db.flush()
        
        # Create sale items
        for purchase_data in successful_purchases:
            sale_item_data = purchase_data["sale_item"]
            sale_item_obj = SaleItem(
                sale_id=sale.id,
                product_id=sale_item_data.product_id,
                quantity=sale_item_data.quantity,
                price_per_unit=sale_item_data.price_per_unit,
                tax_rate=sale_item_data.tax_rate,
                tax_amount=sale_item_data.tax_amount,
                line_total=sale_item_data.line_total,
            )
            db.add(sale_item_obj)
        
        # Update inventory
        for inv_update in inventory_updates:
            product = inv_update["product"]
            quantity = inv_update["quantity"]
            
            inventory = await crud.inventory.get_by_product_id(db, product_id=product.id)
            if inventory:
                inventory.quantity = max(0, inventory.quantity - quantity)
                db.add(inventory)
            
            product.quantity = max(0, product.quantity - quantity)
            db.add(product)
        
        await db.commit()
        await db.refresh(sale)

        # Send order confirmation email
        user_obj = await crud.user.get(db, id=user_id)
        if user_obj:
            from core.email_queue import email_queue
            from core.email import email_service

            order_items = []
            for purchase_data in successful_purchases:
                product = await crud.product.get(db, id=purchase_data["sale_item"].product_id)
                if product:
                    order_items.append({
                        "name": product.product_name,
                        "quantity": purchase_data["sale_item"].quantity,
                        "price": float(purchase_data["sale_item"].price_per_unit),
                        "total": float(purchase_data["sale_item"].line_total),
                    })

            await email_queue.add_email_task(
                email_service.send_order_confirmation_email,
                to_email=user_obj.email,
                first_name=user_obj.first_name,
                order_number=sale.order_number or f"ORD-{sale.id}",
                order_items=order_items,
                subtotal=float(sale.subtotal),
                tax=float(sale.tax),
                shipping_cost=float(sale.shipping_cost or 0),
                total=float(sale.total_amount),
            )

        logger.info(f"Order created from Checkout Session - Sale ID: {sale.id}, Order Number: {sale.order_number or f'ORD-{sale.id}'}")
    except Exception as e:
        logger.error(f"Error processing checkout session {session_id}: {str(e)}")
        import traceback
        logger.error(f"Traceback: {''.join(traceback.format_exc())}")
        try:
            await db.rollback()
        except Exception:
            pass
        raise
    finally:
        await db.close()


async def handle_payment_failure(payment_intent):
    """Handle failed payment."""
    print(f"Payment failed: {payment_intent.get('id')}")
    # You can log this or send notification to user
    pass


async def handle_refund(charge):
    """Handle refund."""
    payment_intent_id = charge.get("payment_intent")
    if not payment_intent_id:
        return

    from db.session import AsyncSessionLocal
    db = AsyncSessionLocal()
    try:
        # Find sale by payment intent ID (you may need to store this)
        # For now, we'll update based on amount
        # You might want to add a stripe_payment_intent_id field to Sale model
        print(f"Refund processed for charge: {charge.get('id')}")
    except Exception as e:
        print(f"Error processing refund: {str(e)}")
    finally:
        await db.close()

