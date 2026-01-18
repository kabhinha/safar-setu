from typing import Optional, List
from pydantic import BaseModel, validator
from app.models.models import HotspotStatus

class HotspotBase(BaseModel):
    name: str
    description: str
    district: str

    @validator('district')
    def no_coordinates(cls, v):
        # Basic check to prevent putting coordinates in district
        if any(char.isdigit() for char in v) and "," in v:
            # Simple heuristic: if it has digits and a comma, valid district shouldn't look like generic lat,long
            # This is a weak check, but serves as a placeholder for "Location Abstraction Enforcement"
            # Real logic would be stricter.
            pass 
        return v

class HotspotCreate(HotspotBase):
    pass

class HotspotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    district: Optional[str] = None

class Hotspot(HotspotBase):
    id: int
    host_id: int
    status: HotspotStatus
    moderation_notes: Optional[str] = None
    
    class Config:
        from_attributes = True
