import asyncio
from typing import Callable, Awaitable, Any
from collections import deque
from core.logger import Logger

logger = Logger.get_logger(__file__, __name__)


class EmailQueue:
    """Simple async email queue for background email processing."""
    
    def __init__(self):
        self.queue: deque = deque()
        self.processing = False
        self._worker_task = None
    
    async def add_email_task(self, email_func: Callable[..., Awaitable[bool]], *args, **kwargs):
        """Add an email task to the queue."""
        self.queue.append((email_func, args, kwargs))
        print(f"[EMAIL_QUEUE] Email task added to queue. Queue size: {len(self.queue)}")  # Immediate output
        logger.info(f"Email task added to queue. Queue size: {len(self.queue)}")
        
        # Start worker if not already running
        if not self.processing:
            print(f"[EMAIL_QUEUE] Starting worker (processing={self.processing})")  # Immediate output
            self._start_worker()
        else:
            print(f"[EMAIL_QUEUE] Worker already running, skipping start")  # Immediate output
    
    def _start_worker(self):
        """Start the background worker task."""
        try:
            loop = asyncio.get_event_loop()
            if self._worker_task is None or (hasattr(self._worker_task, 'done') and self._worker_task.done()):
                print("[EMAIL_QUEUE] Creating worker task...")  # Immediate output
                logger.info("Starting email queue worker task...")
                self._worker_task = loop.create_task(self._worker())
                print(f"[EMAIL_QUEUE] Worker task created: {self._worker_task}")  # Immediate output
                logger.info("Email queue worker task created")
            else:
                print(f"[EMAIL_QUEUE] Worker task already exists: {self._worker_task}")  # Immediate output
        except Exception as e:
            import traceback
            print(f"[EMAIL_QUEUE ERROR] Failed to start worker: {str(e)}")  # Immediate output
            logger.error(f"Failed to start email queue worker: {str(e)}")
            logger.error(f"Traceback: {''.join(traceback.format_exc())}")
    
    async def _worker(self):
        """Background worker that processes email tasks."""
        self.processing = True
        print("[EMAIL_QUEUE] Worker started processing")  # Immediate output
        logger.info("Email queue worker started")
        
        while self.queue:
            try:
                email_func, args, kwargs = self.queue.popleft()
                print(f"[EMAIL_QUEUE] Processing email task. Queue size: {len(self.queue)}")  # Immediate output
                logger.info(f"Processing email task. Queue size: {len(self.queue)}")
                logger.debug(f"Email function: {email_func.__name__}, Args: {args}, Kwargs keys: {list(kwargs.keys())}")
                print(f"[EMAIL_QUEUE] Calling email function: {email_func.__name__} with kwargs: {list(kwargs.keys())}")  # Immediate output
                
                # Execute the email function
                print(f"[EMAIL_QUEUE] Executing email function now...")  # Immediate output
                result = await email_func(*args, **kwargs)
                print(f"[EMAIL_QUEUE] Email function returned: {result}")  # Immediate output
                
                if result:
                    print(f"[EMAIL_QUEUE] Email task completed successfully!")  # Immediate output
                    logger.info(f"Email task completed successfully")
                else:
                    print(f"[EMAIL_QUEUE] WARNING: Email task returned False")  # Immediate output
                    logger.warning(f"Email task returned False - email may not have been sent")
                
                # Small delay to avoid overwhelming the SMTP server
                await asyncio.sleep(0.5)
                
            except Exception as e:
                import traceback
                logger.error(f"Error processing email task: {str(e)}")
                logger.error(f"Error type: {type(e).__name__}")
                logger.error(f"Full traceback:\n{''.join(traceback.format_exc())}")
                # Continue processing other emails even if one fails
                continue
        
        self.processing = False
        logger.info("Email queue worker finished")
    
    async def shutdown(self):
        """Shutdown the email queue and wait for all tasks to complete."""
        logger.info("Shutting down email queue...")
        # Wait for queue to empty
        while self.queue:
            await asyncio.sleep(0.1)
        # Wait for worker to finish
        if self._worker_task:
            await self._worker_task
        logger.info("Email queue shut down complete")


# Global email queue instance
email_queue = EmailQueue()

