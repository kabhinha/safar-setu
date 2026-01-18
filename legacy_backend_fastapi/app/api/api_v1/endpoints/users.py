from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select

from app import schemas, models
from app.api import deps
from app.db.session import AsyncSession
from app.models.models import UserRole

router = APIRouter()

@router.get("/me", response_model=schemas.user.User)
async def read_user_me(
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/me/host-profile", response_model=schemas.user.User)
async def create_host_profile(
    *,
    db: AsyncSession = Depends(deps.get_db),
    business_name: str,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create or Update Host Profile.
    """
    if current_user.role != UserRole.HOST:
         # Optionally auto-upgrade role if allowed, but strict RBAC might prevent.
         pass
    
    # Check if exists
    stmt = select(models.models.HostProfile).where(models.models.HostProfile.user_id == current_user.id)
    result = await db.execute(stmt)
    host_profile = result.scalars().first()
    
    if host_profile:
        host_profile.business_name = business_name
    else:
        host_profile = models.models.HostProfile(user_id=current_user.id, business_name=business_name)
        db.add(host_profile)

    await db.commit()
    return current_user
