from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette_context import plugins
from starlette_context.middleware import RawContextMiddleware

from api.v1.routing import RoutingV1
from middlewares import RequestPreProcessor, AuthenticationContext

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
1. Request Middleware
2. Decyrption Middleware
3. Context Plugin Middleware
"""
app.add_middleware(BaseHTTPMiddleware, dispatch=RequestPreProcessor())
app.add_middleware(
    RawContextMiddleware,
    plugins=(
        AuthenticationContext(),
        plugins.RequestIdPlugin(),
        plugins.CorrelationIdPlugin(),
    ),
)


# Routing Information
"""
Add versioned routing information here
"""
RoutingV1(app).map_urls()
