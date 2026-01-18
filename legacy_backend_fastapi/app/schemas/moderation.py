from pydantic import BaseModel
from typing import Optional
from app.models.models import HotspotStatus

class ModerationAction(BaseModel):
    action: str # approve, reject, request_changes
    reason: Optional[str] = None

class HotspotModeration(ModerationAction):
    pass
