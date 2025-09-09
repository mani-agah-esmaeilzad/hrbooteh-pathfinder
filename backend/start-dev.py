#!/usr/bin/env python3
"""
Development server starter for hrbooteh backend
This script starts the FastAPI server with hot reload and development settings
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Set environment
os.environ.setdefault("ENV_FILE", ".env.development")

if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings
    
    print("🚀 Starting hrbooteh Backend Development Server...")
    print(f"📁 Backend Directory: {backend_dir}")
    print(f"🌐 Server URL: http://{settings.HOST}:{settings.PORT}")
    print(f"📖 API Documentation: http://{settings.HOST}:{settings.PORT}/docs")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print("---")
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        reload_dirs=[str(backend_dir / "app")],
        log_config=None,  # We handle logging ourselves
    )
