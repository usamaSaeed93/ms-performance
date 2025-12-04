"""
Exception Logging Middleware
Catches all unhandled exceptions and logs them with full tracebacks.
"""
import logging
import traceback
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger("app")


class ExceptionLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to catch and log all unhandled exceptions.
    Returns a clean JSON error response while logging full traceback.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            # Log the full exception with traceback
            logger.exception(
                f"Unhandled exception in {request.method} {request.url.path}: {str(e)}"
            )
            
            # Log traceback details
            logger.error(f"Traceback:\n{''.join(traceback.format_exc())}")
            
            # Return a clean JSON error response
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "status_code": 500,
                    "message": "An internal server error occurred. Please check the logs for details.",
                    "data": None,
                },
            )

