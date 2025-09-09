"""
Pydantic schemas for assessments
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any, List
from app.models.assessment import AssessmentStatus, MessageSender


class AssessmentBase(BaseModel):
    """Base assessment schema"""
    assessment_type: str


class AssessmentCreate(AssessmentBase):
    """Schema for assessment creation"""
    user_context: Optional[str] = None


class AssessmentResponse(AssessmentBase):
    """Schema for assessment response"""
    id: int
    user_id: int
    status: AssessmentStatus
    analysis: Optional[Any] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    """Base message schema"""
    message: str


class MessageCreate(MessageBase):
    """Schema for message creation"""
    pass


class MessageResponse(MessageBase):
    """Schema for message response"""
    id: int
    assessment_id: int
    sender: MessageSender
    created_at: datetime
    
    class Config:
        from_attributes = True


class AIResponse(BaseModel):
    """Schema for AI response"""
    message: str
    should_continue: bool
    analysis_ready: Optional[bool] = False


class AssessmentStartResponse(BaseModel):
    """Schema for assessment start response"""
    assessment_id: int
    ai_response: AIResponse


class AssessmentMessageResponse(BaseModel):
    """Schema for assessment message response"""
    ai_response: AIResponse
    analysis_ready: Optional[bool] = False


class AssessmentResultsResponse(BaseModel):
    """Schema for assessment results response"""
    assessment: AssessmentResponse
    messages: List[MessageResponse]
    analysis: Optional[Any] = None


class AssessmentDetailsResponse(BaseModel):
    """Schema for assessment details response"""
    assessment: AssessmentResponse
    messages: List[MessageResponse]
