from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select

from app import schemas, models
from app.api import deps
from app.db.session import AsyncSession
from app.models.models import HotspotStatus, UserRole

router = APIRouter()

@router.post("/hotspots/{id}/moderate", response_model=schemas.hotspot.Hotspot)
async def moderate_hotspot(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    action_in: schemas.moderation.HotspotModeration,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Approve, Reject, or Request Changes for a Hotspot.
    Moderators only.
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MODERATOR]:
        raise HTTPException(status_code=403, detail="Not authorized")

    stmt = select(models.models.Hotspot).where(models.models.Hotspot.id == id)
    result = await db.execute(stmt)
    hotspot = result.scalars().first()
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found")

    if action_in.action == "approve":
        hotspot.status = HotspotStatus.APPROVED
    elif action_in.action == "reject":
        hotspot.status = HotspotStatus.REJECTED
    elif action_in.action == "request_changes":
        hotspot.status = HotspotStatus.CHANGES_REQUESTED
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    # Log moderation action
    log = models.models.ModerationLog(
        moderator_id=current_user.id,
        target_type="hotspot",
        target_id=hotspot.id,
        action=action_in.action,
        reason=action_in.reason
    )
    db.add(log)
    
    if action_in.reason:
        hotspot.moderation_notes = action_in.reason

    db.add(hotspot)
    await db.commit()
    await db.refresh(hotspot)
    return hotspot
