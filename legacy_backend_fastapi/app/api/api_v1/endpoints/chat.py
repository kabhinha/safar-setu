from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app import models
from app.api import deps

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context_district: str = "general"

class ChatResponse(BaseModel):
    response_text: str
    safety_flag: bool

@router.post("/", response_model=ChatResponse)
async def chat_interaction(
    *,
    request: ChatRequest,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Chat endpoint to interface with Agent 3 (AI).
    """
    # Stub logic mimicking safety check
    if "gps" in request.message.lower() or "coordinates" in request.message.lower():
         return ChatResponse(
             response_text="I cannot provide access to raw GPS coordinates due to safety policies.",
             safety_flag=True
         )
    
    return ChatResponse(
        response_text=f"Agent 3 (AI) Stub: I received your message about '{request.message}' in {request.context_district}. (Integration Pending)",
        safety_flag=False
    )
