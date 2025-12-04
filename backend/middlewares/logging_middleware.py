"""
Request and Response Logging Middleware
Logs all incoming requests and outgoing responses with detailed information.
"""
import json
import logging
import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import StreamingResponse

logger = logging.getLogger("request")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all HTTP requests and responses.
    Captures method, path, headers, query params, body, and response details.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Start timing
        start_time = time.time()
        
        # Get request details
        method = request.method
        path = str(request.url.path)
        query_params = dict(request.query_params)
        client_ip = request.client.host if request.client else "unknown"
        
        # Log incoming request
        logger.info(f"{method} {path} - Client: {client_ip}")
        logger.debug(f"Query params: {query_params}")
        
        # Log headers (excluding sensitive information)
        headers_dict = dict(request.headers)
        # Remove sensitive headers for logging
        sensitive_headers = ["authorization", "cookie", "x-api-key"]
        safe_headers = {
            k: v if k.lower() not in sensitive_headers else "***REDACTED***"
            for k, v in headers_dict.items()
        }
        logger.debug(f"Headers: {json.dumps(safe_headers, indent=2)}")
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log response
            status_code = response.status_code
            logger.info(f"{method} {path} - Status: {status_code} - Time: {process_time:.3f}s")
            
            # Log response headers (excluding sensitive ones)
            try:
                response_headers = dict(response.headers)
                sensitive_response_headers = ["set-cookie", "authorization"]
                safe_response_headers = {
                    k: v if k.lower() not in sensitive_response_headers else "***REDACTED***"
                    for k, v in response_headers.items()
                }
                logger.debug(f"Response headers: {json.dumps(safe_response_headers, indent=2)}")
            except Exception as e:
                logger.debug(f"Could not log response headers: {e}")
            
            # Response body logging is handled by BaseResource logger
            # Don't try to read response body here to avoid blocking
            
            return response
            
        except Exception as e:
            # Log exception details
            process_time = time.time() - start_time
            logger.exception(
                f"Exception in {method} {path} - Time: {process_time:.3f}s - Error: {str(e)}"
            )
            raise

