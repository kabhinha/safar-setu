from typing import Any, List
from fastapi import APIRouter, Depends
from app import models, schemas
from app.api import deps
from app.db.session import AsyncSession
from sqlalchemy.future import select

router = APIRouter()

@router.get("/", response_model=List[schemas.hotspot.Hotspot])
async def get_recommendations(
    *,
    db: AsyncSession = Depends(deps.get_db),
    top_k: int = 5,
    current_user: models.models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get personalized recommendations.
    STUB: For now returns random approved hotspots.
    Future: Call Agent 3 or use pgvector similarity on User Profile embedding vs Hotspot embedding.
    """
    # Stub implementation: just return top 5 approved hotspots
    stmt = select(models.models.Hotspot).where(
        models.models.Hotspot.status == models.models.HotspotStatus.APPROVED
    ).limit(top_k)
    
    result = await db.execute(stmt)
    return result.scalars().all()
