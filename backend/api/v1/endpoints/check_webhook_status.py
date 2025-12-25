from api.base_resource import GetResource
from fastapi import status
from sqlalchemy import select
import crud
from ..schemas.check_order_status import CheckOrderStatusRequest


class CheckWebhookStatus(GetResource):
    """
    Check webhook processing status for a payment intent.
    Returns information about whether the webhook was processed successfully or if there were errors.
    """
    api_name = "check_webhook_status"
    api_url = "check_webhook_status"
    request_schema = CheckOrderStatusRequest
    authentication_required = True

    async def process_flow(self):
        payment_intent_id = self.request_data.payment_intent_id

        db = self.db
        
        # Check if order exists
        sale = await crud.sale.get_by_payment_intent_id(db, payment_intent_id=payment_intent_id)
        
        if sale:
            # Order exists - webhook succeeded
            self.status_code = status.HTTP_200_OK
            self.response_message = "Order processed successfully"
            self.response_data = {
                "status": "success",
                "order_exists": True,
                "order_id": sale.id,
                "order_number": sale.order_number,
                "error": None,
            }
            return
        
        # Order doesn't exist - check webhook task status
        # First, try to find webhook event by payment_intent_id
        from models.webhook_event import WebhookEvent
        from models.webhook_task import WebhookTask
        import json
        
        # Find webhook event by payment_intent_id
        event_stmt = select(WebhookEvent).where(
            WebhookEvent.payment_intent_id == payment_intent_id
        ).order_by(WebhookEvent.created_at.desc())
        
        event_result = await db.execute(event_stmt)
        webhook_event = event_result.scalar_one_or_none()
        
        # If we found the event, get the associated task
        task = None
        if webhook_event:
            task_stmt = select(WebhookTask).where(
                WebhookTask.event_id == webhook_event.event_id
            ).order_by(WebhookTask.created_at.desc())
            
            task_result = await db.execute(task_stmt)
            task = task_result.scalar_one_or_none()
        
        # If no task found via event, search all payment_intent tasks
        if not task:
            task_stmt = select(WebhookTask).where(
                WebhookTask.event_type.like("payment_intent%")
            ).order_by(WebhookTask.created_at.desc())
            
            task_result = await db.execute(task_stmt)
            tasks = task_result.scalars().all()
            
            # Find task with matching payment_intent_id in event_data
            for t in tasks:
                try:
                    event_data = t.event_data if isinstance(t.event_data, dict) else json.loads(t.event_data) if isinstance(t.event_data, str) else {}
                    payment_intent = event_data.get("data", {}).get("object", {})
                    if payment_intent.get("id") == payment_intent_id:
                        task = t
                        break
                except Exception:
                    continue
        
        if task:
            task_obj = task[0] if isinstance(task, tuple) else task
            self.status_code = status.HTTP_200_OK
            
            if task_obj.status == "completed":
                self.response_message = "Webhook processed successfully"
                self.response_data = {
                    "status": "success",
                    "order_exists": False,  # Might be a race condition
                    "order_id": None,
                    "order_number": None,
                    "error": None,
                }
            elif task_obj.status == "failed":
                self.response_message = "Webhook processing failed"
                self.response_data = {
                    "status": "failed",
                    "order_exists": False,
                    "order_id": None,
                    "order_number": None,
                    "error": task_obj.error_message or "Unknown error",
                    "retry_count": task_obj.retry_count,
                    "max_retries": task_obj.max_retries,
                    "can_retry": task_obj.retry_count < task_obj.max_retries,
                }
            elif task_obj.status == "processing":
                self.response_message = "Webhook is being processed"
                self.response_data = {
                    "status": "processing",
                    "order_exists": False,
                    "order_id": None,
                    "order_number": None,
                    "error": None,
                }
            else:  # pending
                self.response_message = "Webhook is pending processing"
                self.response_data = {
                    "status": "pending",
                    "order_exists": False,
                    "order_id": None,
                    "order_number": None,
                    "error": None,
                }
        else:
            # No task found - webhook might not have been received yet
            self.status_code = status.HTTP_200_OK
            self.response_message = "Webhook not yet received"
            self.response_data = {
                "status": "pending",
                "order_exists": False,
                "order_id": None,
                "order_number": None,
                "error": None,
            }

