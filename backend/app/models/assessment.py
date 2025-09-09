"""
Assessment models for handling assessments and messages
"""

from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Text, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from enum import Enum
from app.core.database import Base


class AssessmentStatus(str, Enum):
    """Assessment status enumeration"""
    ACTIVE = "active"
    COMPLETED = "completed"


class MessageSender(str, Enum):
    """Message sender enumeration"""
    USER = "user"
    AI = "ai"


class Assessment(Base):
    """Assessment model"""
    
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_type = Column(String, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(AssessmentStatus), default=AssessmentStatus.ACTIVE)
    analysis = Column(JSON, nullable=True)  # Store AI analysis results
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="assessments")
    messages = relationship("AssessmentMessage", back_populates="assessment", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Assessment(id={self.id}, type='{self.assessment_type}', status='{self.status}')>"


class AssessmentMessage(Base):
    """Assessment message model"""
    
    __tablename__ = "assessment_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    sender = Column(SQLEnum(MessageSender), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    assessment = relationship("Assessment", back_populates="messages")
    
    def __repr__(self):
        return f"<AssessmentMessage(id={self.id}, sender='{self.sender}', assessment_id={self.assessment_id})>"
