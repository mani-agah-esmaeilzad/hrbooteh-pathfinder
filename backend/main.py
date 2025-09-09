"""
hrbooteh Backend - FastAPI Application
Main entry point for the FastAPI backend server
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from loguru import logger

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import api_router
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting hrbooteh Backend Server...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("✅ Database tables created/verified")
    logger.info(f"🌐 Server starting on {settings.HOST}:{settings.PORT}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down hrbooteh Backend Server...")


def create_app() -> FastAPI:
    """Create FastAPI application with all configurations"""
    
    # Setup logging
    setup_logging()
    
    # Create FastAPI app
    app = FastAPI(
        title="hrbooteh API",
        description="Backend API for hrbooteh - Professional Skills Assessment Platform",
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    
    # Include API routes
    app.include_router(api_router, prefix="/api/v1")
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {
            "status": "healthy",
            "service": "hrbooteh-backend",
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT
        }
    
    # Global exception handler
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request, exc: Exception):
        logger.error(f"Unhandled exception: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
    
    return app


# Create app instance
app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_config=None,  # We handle logging ourselves
    )
