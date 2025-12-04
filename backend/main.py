from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from starlette.middleware.base import BaseHTTPMiddleware
from starlette_context import plugins
from starlette_context.middleware import RawContextMiddleware

# Configure logging FIRST before anything else
from core.logging_config import configure_logging
configure_logging()

from api.v1.routing import RoutingV1
from middlewares import (
    RequestPreProcessor,
    AuthenticationContext,
    LoggingMiddleware,
    ExceptionLoggingMiddleware,
)
from instance.config import config

# Global app variable
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Touch Pydantic Encoders
from core import json

json.ENCODERS_BY_TYPE

# Middlewares
"""
Order of precedence is important here.
Middleware is executed in REVERSE order (last added = first executed)
So we add them in reverse of execution order:

Execution order (from outermost to innermost):
1. Exception Logging Middleware (catches all errors)
2. Logging Middleware (logs requests/responses)
3. Request Preprocessor Middleware (processes request body)
4. Context Plugin Middleware
5. CORS Middleware (handled separately above)

So we add them in this order (last added = first executed):
"""
# Context middleware with plugins (added first = executes last = innermost)
app.add_middleware(
    RawContextMiddleware,
    plugins=(
        AuthenticationContext(),
        plugins.RequestIdPlugin(),
        plugins.CorrelationIdPlugin(),
    ),
)

# Request preprocessor (added second = executes third = processes body)
app.add_middleware(BaseHTTPMiddleware, dispatch=RequestPreProcessor())

# Request/Response logging middleware (added third = executes second = logs after body processed)
app.add_middleware(LoggingMiddleware)

# Exception logging middleware (added last = executes first = outermost)
app.add_middleware(ExceptionLoggingMiddleware)

# Static file mount for uploaded assets (works with local storage)
uploads_dir = Path(config.LOCAL_STORAGE_PATH)
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount(
    config.LOCAL_STORAGE_BASE_URL if config.LOCAL_STORAGE_BASE_URL.startswith("/") else f"/{config.LOCAL_STORAGE_BASE_URL}",
    StaticFiles(directory=str(uploads_dir)),
    name="uploads",
)


# Routing Information
"""
Add versioned routing information here
"""
RoutingV1(app).map_urls()
