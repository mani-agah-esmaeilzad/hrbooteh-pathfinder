"""
API routers for v1
"""

from fastapi import APIRouter

from .routes import auth, assessments

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(assessments.router, prefix="/assessments", tags=["assessments"])
