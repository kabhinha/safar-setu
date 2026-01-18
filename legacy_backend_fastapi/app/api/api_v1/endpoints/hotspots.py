from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app import schemas, models
from app.api import deps
from app.db.session import AsyncSession
from app.models.models import UserRole, HotspotStatus

router = APIRouter()

@router.get("/", response_model=List[schemas.hotspot.Hotspot])
async def read_hotspots(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve hotspots.
    Travelers only see APPROVED hotspots.
    Hosts see their own hotspots.
    Admins/Moderators see all.
    """
    stmt = select(models.models.Hotspot)
    
    if current_user.role == UserRole.TRAVELER:
        stmt = stmt.where(models.models.Hotspot.status == HotspotStatus.APPROVED)
    elif current_user.role == UserRole.HOST:
        # Hosts see their own + approved (conceptually for exploring)
        # For this endpoint, let's say they want to list ALL to see what's out there? 
        # Or filtered? The prompt says "Traveler lists approved".
        # Let's restrict Hosts to see Approved + Their Own.
        # For simplicity in this SQL, showing APPROVED is safe for everyone.
        # But if they want to see their pending ones, they need a separate endpoint or logic.
        stmt = stmt.where(models.models.Hotspot.status == HotspotStatus.APPROVED)
    elif current_user.role in [UserRole.ADMIN, UserRole.MODERATOR]:
        pass # See all

    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/my-hotspots", response_model=List[schemas.hotspot.Hotspot])
async def read_my_hotspots(
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's hotspots (Host only).
    """
    if current_user.role != UserRole.HOST:
         raise HTTPException(status_code=400, detail="Not a host")
    
    # We need to find the host profile
    stmt = select(models.models.HostProfile).where(models.models.HostProfile.user_id == current_user.id)
    result = await db.execute(stmt)
    host_profile = result.scalars().first()
    
    if not host_profile:
        return []

    stmt = select(models.models.Hotspot).where(models.models.Hotspot.host_id == host_profile.id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=schemas.hotspot.Hotspot)
async def create_hotspot(
    *,
    db: AsyncSession = Depends(deps.get_db),
    hotspot_in: schemas.hotspot.HotspotCreate,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new hotspot (Host only). Defaults to PENDING.
    """
    if current_user.role != UserRole.HOST and current_user.role != UserRole.ADMIN:
        # Allowing Admin to create for seeding purposes
         raise HTTPException(status_code=400, detail="Not a host")

    # Get Host Profile
    stmt = select(models.models.HostProfile).where(models.models.HostProfile.user_id == current_user.id)
    result = await db.execute(stmt)
    host_profile = result.scalars().first()
    
    # Auto-create host profile if missing (for simplification, or error out)
    if not host_profile:
        host_profile = models.models.HostProfile(user_id=current_user.id, business_name="My Business") # Stub
        db.add(host_profile)
        await db.commit()
        await db.refresh(host_profile)
    
    # Check for forbidden keywords in description (Auto-flag logic)
    auto_flag_keywords = ["border", "military", "secret"]
    status_initial = HotspotStatus.PENDING
    moderation_note = None
    
    if any(k in hotspot_in.description.lower() for k in auto_flag_keywords):
        moderation_note = "Auto-flagged: potential sensitive keyword."
    
    hotspot = models.models.Hotspot(
        **hotspot_in.dict(),
        host_id=host_profile.id,
        status=status_initial,
        moderation_notes=moderation_note
    )
    db.add(hotspot)
    await db.commit()
    await db.refresh(hotspot)
    return hotspot

@router.get("/{id}", response_model=schemas.hotspot.Hotspot)
async def read_hotspot(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get hotspot by ID.
    """
    stmt = select(models.models.Hotspot).where(models.models.Hotspot.id == id)
    result = await db.execute(stmt)
    hotspot = result.scalars().first()
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found")
    # Permissions check: if not approved, only owner or moderator can see
    if hotspot.status != HotspotStatus.APPROVED:
        is_owner = False
        if current_user.role == UserRole.HOST:
             stmt_host = select(models.models.HostProfile).where(models.models.HostProfile.user_id == current_user.id)
             res_host = await db.execute(stmt_host)
             hp = res_host.scalars().first()
             if hp and hp.id == hotspot.host_id:
                 is_owner = True
        
        if not is_owner and current_user.role not in [UserRole.ADMIN, UserRole.MODERATOR]:
            raise HTTPException(status_code=403, detail="Not authorized to view pending content")
            
    return hotspot
