from typing import Any
from fastapi import APIRouter, Depends
from app import models
from app.api import deps
from app.db.session import AsyncSession
from pydantic import BaseModel

router = APIRouter()

class InteractionCreate(BaseModel):
    hotspot_id: int
    interaction_type: str # view, click, save
    dwell_time_ms: int = 0

@router.post("/", response_model=InteractionCreate)
async def create_interaction(
    *,
    db: AsyncSession = Depends(deps.get_db),
    interaction_in: InteractionCreate,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Log user interaction.
    """
    interaction = models.models.InteractionEvent(
        user_id=current_user.id,
        hotspot_id=interaction_in.hotspot_id,
        interaction_type=interaction_in.interaction_type,
        dwell_time_ms=interaction_in.dwell_time_ms
    )
    db.add(interaction)
    await db.commit()
    return interaction_in
