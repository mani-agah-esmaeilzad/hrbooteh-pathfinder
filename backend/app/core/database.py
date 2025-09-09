"""
Database configuration and connection for hrbooteh backend
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData
from typing import AsyncGenerator
import asyncio

from .config import settings

# Create async engine
if settings.database_url.startswith("sqlite:///"):
    # For SQLite, we need aiosqlite
    DATABASE_URL = settings.database_url.replace("sqlite:///", "sqlite+aiosqlite:///")
elif settings.database_url.startswith("postgresql://"):
    # For PostgreSQL, we use asyncpg
    DATABASE_URL = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")
elif settings.database_url.startswith("mysql://"):
    # For MySQL, we use asyncmy
    DATABASE_URL = settings.database_url.replace("mysql://", "mysql+asyncmy://")
else:
    # Fallback: use as-is
    DATABASE_URL = settings.database_url

engine = create_async_engine(
    DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

# Create async session factory
async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Create base class for declarative models
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s"
    }
)

Base = declarative_base(metadata=metadata)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session
    """
    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Initialize database tables
    """
    async with engine.begin() as conn:
        # Import all models here to ensure they are registered
        from app.models import user, assessment
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """
    Close database connections
    """
    await engine.dispose()
