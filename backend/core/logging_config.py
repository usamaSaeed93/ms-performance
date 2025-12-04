"""
Comprehensive logging configuration for the FastAPI application.
Provides console and file logging with detailed debug information.
Includes colored console output for better readability.
"""
import logging
import logging.config
import os
import sys
from pathlib import Path

from instance.config import config


class ColoredFormatter(logging.Formatter):
    """Custom formatter that adds colors to log levels"""
    
    # ANSI color codes
    COLORS = {
        'DEBUG': '\033[36m',      # Cyan
        'INFO': '\033[32m',       # Green
        'WARNING': '\033[33m',    # Yellow
        'ERROR': '\033[31m',      # Red
        'CRITICAL': '\033[31;1m', # Bold Red
    }
    RESET = '\033[0m'
    
    def format(self, record):
        # Check if output is a terminal that supports colors
        is_tty = hasattr(sys.stdout, 'isatty') and sys.stdout.isatty()
        
        if is_tty:
            # Colorize log level
            level_color = self.COLORS.get(record.levelname, '')
            record.levelname = f"{level_color}{record.levelname}{self.RESET}"
        
        return super().format(record)


def configure_logging():
    """
    Configure comprehensive logging for the application.
    Sets up colored console and file handlers with detailed formatting.
    """
    # Ensure logs directory exists
    logs_dir = Path(config.LOGS_DIR)
    logs_dir.mkdir(parents=True, exist_ok=True)
    
    log_file = logs_dir / "app.log"
    
    # Determine log level from config or environment
    log_level = os.getenv("LOG_LEVEL", "DEBUG").upper()
    
    # Check if we should use colors (only for TTY)
    use_colors = hasattr(sys.stdout, 'isatty') and sys.stdout.isatty()
    
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(levelname)s [%(asctime)s] %(name)s: %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "colored": {
                "()": "core.logging_config.ColoredFormatter",
                "format": "%(levelname)s [%(asctime)s] %(name)s: %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(levelname)s [%(asctime)s] %(name)s [%(filename)s:%(lineno)d] %(funcName)s: %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",  # Console shows INFO and above
                "formatter": "colored" if use_colors else "standard",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": log_level,  # File shows DEBUG and above
                "formatter": "detailed",
                "filename": str(log_file),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "encoding": "utf8",
            },
        },
        "loggers": {
            # Root logger
            "": {
                "handlers": ["console", "file"],
                "level": log_level,
                "propagate": False,
            },
            # Uvicorn loggers
            "uvicorn": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.error": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.access": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            # FastAPI logger
            "fastapi": {
                "handlers": ["console", "file"],
                "level": log_level,
                "propagate": False,
            },
            # SQLAlchemy loggers
            "sqlalchemy.engine": {
                "handlers": ["file"],  # Log to file only, not console
                "level": log_level,
                "propagate": False,
            },
            "sqlalchemy.pool": {
                "handlers": ["file"],  # Log to file only
                "level": "WARNING",  # Reduce verbosity - only log warnings/errors for pool
                "propagate": False,
            },
            "sqlalchemy.dialects": {
                "handlers": ["file"],  # Log to file only, not console
                "level": log_level,
                "propagate": False,
            },
            # Application logger
            "app": {
                "handlers": ["console", "file"],
                "level": log_level,
                "propagate": False,
            },
            # Request/Response logging
            "request": {
                "handlers": ["console", "file"],
                "level": "INFO",  # Only INFO and above for console (less verbose)
                "propagate": False,
            },
            # Storage logging
            "storage": {
                "handlers": ["console", "file"],
                "level": log_level,
                "propagate": False,
            },
            # Database logging
            "db": {
                "handlers": ["console", "file"],
                "level": log_level,
                "propagate": False,
            },
            # Suppress noisy asyncio/h11 errors (harmless connection issues)
            "asyncio": {
                "handlers": ["file"],  # Log to file only, not console
                "level": "WARNING",  # Only warnings and above
                "propagate": False,
            },
            # Suppress aiomysql debug logs
            "aiomysql": {
                "handlers": ["file"],  # Log to file only, not console
                "level": "INFO",  # Only info and above
                "propagate": False,
            },
            # Suppress verbose multipart parsing logs
            "multipart": {
                "handlers": ["file"],  # Log to file only, not console
                "level": "WARNING",  # Only warnings and above - suppresses all the "Calling on_part_begin" noise
                "propagate": False,
            },
            "multipart.multipart": {
                "handlers": ["file"],  # Log to file only, not console
                "level": "WARNING",  # Suppress verbose multipart parsing logs
                "propagate": False,
            },
        },
    }
    
    logging.config.dictConfig(logging_config)
    
    # Suppress specific harmless errors
    # h11 LocalProtocolError during keep-alive timeouts (client disconnect issues)
    class H11ErrorFilter(logging.Filter):
        """Filter out harmless h11 protocol errors from asyncio callbacks"""
        def filter(self, record):
            # Check if this is an asyncio error about h11 timeout handler
            if record.name == "asyncio":
                # Check the exception message if present
                if hasattr(record, 'exc_info') and record.exc_info:
                    exc_type, exc_value, exc_traceback = record.exc_info
                    if exc_value and isinstance(exc_value, Exception):
                        exc_msg = str(exc_value)
                        if ("LocalProtocolError" in exc_msg and 
                            "can't handle event type ConnectionClosed" in exc_msg):
                            return False  # Suppress this error
                
                # Also check the log message itself
                msg = record.getMessage() if hasattr(record, 'getMessage') else str(record.msg)
                if "H11Protocol.timeout_keep_alive_handler" in msg:
                    if "LocalProtocolError" in msg or "can't handle event type ConnectionClosed" in msg:
                        return False  # Suppress this error
            return True  # Allow all other logs
    
    # Add filter to asyncio logger
    asyncio_logger = logging.getLogger("asyncio")
    asyncio_logger.addFilter(H11ErrorFilter())
    
    # Log that logging has been configured
    logger = logging.getLogger("app")
    logger.info(f"Logging configured. Log level: {log_level}, Log file: {log_file}, Colors: {use_colors}")
