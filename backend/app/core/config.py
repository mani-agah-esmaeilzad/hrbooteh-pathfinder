"""
Configuration settings for hrbooteh backend
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "hrbooteh"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "localhost"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: Optional[str] = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306  # MySQL default port
    DB_USER: str = "root"  # XAMPP default user
    DB_PASSWORD: str = ""  # XAMPP default (no password)
    DB_NAME: str = "hrbooteh_db"
    
    # Database type selection
    DB_TYPE: str = "mysql"  # mysql, postgresql, sqlite
    
    # For development, use SQLite
    SQLITE_DB_PATH: str = "hrbooteh.db"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ]
    
    # AI Configuration
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    AI_MODEL: str = "gpt-3.5-turbo"  # or "claude-3-sonnet"
    AI_MAX_TOKENS: int = 1000
    AI_TEMPERATURE: float = 0.7
    
    # Redis (for caching and sessions)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Email (for future use)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/hrbooteh.log"
    
    @property
    def database_url(self) -> str:
        """Get database URL based on DB_TYPE/ENV and explicit env var"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # Build from DB_TYPE
        if self.DB_TYPE.lower() == "mysql":
            # Use async driver name mapping in database.py; here we provide sync style URL
            return f"mysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        if self.DB_TYPE.lower() == "postgresql":
            return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        # Default to sqlite
        return f"sqlite:///{self.SQLITE_DB_PATH}"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return self.ENVIRONMENT == "production"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Ensure logs directory exists
log_dir = Path(settings.LOG_FILE).parent
log_dir.mkdir(exist_ok=True)
