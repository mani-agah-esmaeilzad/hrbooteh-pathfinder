"""
Logging configuration for hrbooteh backend
"""

import sys
from loguru import logger
from pathlib import Path

from .config import settings


def setup_logging():
    """Setup logging configuration"""
    
    # Remove default logger
    logger.remove()
    
    # Console logging
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=settings.LOG_LEVEL,
    )
    
    # File logging
    log_file = Path(settings.LOG_FILE)
    log_file.parent.mkdir(exist_ok=True)
    
    logger.add(
        log_file,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level=settings.LOG_LEVEL,
        rotation="10 MB",
        retention="1 week",
        compression="zip",
    )
    
    # Set specific loggers
    logger.add(
        log_file.parent / "errors.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="ERROR",
        rotation="5 MB",
        retention="2 weeks",
        compression="zip",
    )
    
    logger.info("Logging configured successfully")
