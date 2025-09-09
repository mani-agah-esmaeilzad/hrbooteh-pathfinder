"""
Assessment routes for hrbooteh API
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.assessment import Assessment, AssessmentMessage, AssessmentStatus, MessageSender
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentStartResponse,
    MessageCreate,
    AssessmentMessageResponse,
    AssessmentResultsResponse,
    AssessmentDetailsResponse,
    AIResponse
)
from app.services.ai import ai_service

router = APIRouter()


@router.post("/start", response_model=AssessmentStartResponse)
async def start_assessment(
    assessment_data: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start a new assessment"""
    
    # Create new assessment
    assessment = Assessment(
        assessment_type=assessment_data.assessment_type,
        user_id=current_user.id,
        status=AssessmentStatus.ACTIVE
    )
    
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    
    # Get initial AI response
    ai_message, should_continue, analysis_ready = ai_service.start_assessment(
        assessment_data.assessment_type, 
        assessment_data.user_context
    )
    
    # Save AI message
    ai_message_record = AssessmentMessage(
        assessment_id=assessment.id,
        sender=MessageSender.AI,
        message=ai_message
    )
    
    db.add(ai_message_record)
    await db.commit()
    
    return AssessmentStartResponse(
        assessment_id=assessment.id,
        ai_response=AIResponse(
            message=ai_message,
            should_continue=should_continue,
            analysis_ready=analysis_ready
        )
    )


@router.post("/{assessment_id}/message", response_model=AssessmentMessageResponse)
async def send_message(
    assessment_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a message in an assessment"""
    
    # Get assessment
    result = await db.execute(
        select(Assessment)
        .options(selectinload(Assessment.messages))
        .where(Assessment.id == assessment_id)
        .where(Assessment.user_id == current_user.id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.status != AssessmentStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment is not active"
        )
    
    # Save user message
    user_message = AssessmentMessage(
        assessment_id=assessment_id,
        sender=MessageSender.USER,
        message=message_data.message
    )
    
    db.add(user_message)
    await db.commit()
    
    # Get conversation history
    history = []
    for msg in assessment.messages:
        history.append({
            "sender": msg.sender.value,
            "message": msg.message
        })
    history.append({
        "sender": "user",
        "message": message_data.message
    })
    
    # Get AI response
    ai_message, should_continue, analysis_ready = ai_service.respond(
        assessment.assessment_type,
        history,
        message_data.message
    )
    
    # Save AI message
    ai_message_record = AssessmentMessage(
        assessment_id=assessment_id,
        sender=MessageSender.AI,
        message=ai_message
    )
    
    db.add(ai_message_record)
    
    # If analysis is ready, complete the assessment and generate analysis
    if analysis_ready:
        analysis = ai_service.build_analysis(assessment.assessment_type, history)
        assessment.analysis = analysis
        assessment.status = AssessmentStatus.COMPLETED
        
    await db.commit()
    
    return AssessmentMessageResponse(
        ai_response=AIResponse(
            message=ai_message,
            should_continue=should_continue,
            analysis_ready=analysis_ready
        ),
        analysis_ready=analysis_ready
    )


@router.get("/{assessment_id}/results", response_model=AssessmentResultsResponse)
async def get_assessment_results(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get assessment results"""
    
    # Get assessment with messages
    result = await db.execute(
        select(Assessment)
        .options(selectinload(Assessment.messages))
        .where(Assessment.id == assessment_id)
        .where(Assessment.user_id == current_user.id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.status != AssessmentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment is not completed yet"
        )
    
    # Convert messages to response format
    messages = [
        {
            "id": msg.id,
            "assessment_id": msg.assessment_id,
            "sender": msg.sender,
            "message": msg.message,
            "created_at": msg.created_at
        }
        for msg in sorted(assessment.messages, key=lambda x: x.created_at)
    ]
    
    return AssessmentResultsResponse(
        assessment=AssessmentResponse.from_orm(assessment),
        messages=messages,
        analysis=assessment.analysis
    )


@router.get("/user", response_model=List[AssessmentResponse])
async def get_user_assessments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all assessments for current user"""
    
    result = await db.execute(
        select(Assessment)
        .where(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
    )
    assessments = result.scalars().all()
    
    return [AssessmentResponse.from_orm(assessment) for assessment in assessments]


@router.get("/{assessment_id}", response_model=AssessmentDetailsResponse)
async def get_assessment_details(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get assessment details with messages"""
    
    # Get assessment with messages
    result = await db.execute(
        select(Assessment)
        .options(selectinload(Assessment.messages))
        .where(Assessment.id == assessment_id)
        .where(Assessment.user_id == current_user.id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # Convert messages to response format
    messages = [
        {
            "id": msg.id,
            "assessment_id": msg.assessment_id,
            "sender": msg.sender,
            "message": msg.message,
            "created_at": msg.created_at
        }
        for msg in sorted(assessment.messages, key=lambda x: x.created_at)
    ]
    
    return AssessmentDetailsResponse(
        assessment=AssessmentResponse.from_orm(assessment),
        messages=messages
    )
