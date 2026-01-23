from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum

class CrowdState(Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    UNKNOWN = "UNKNOWN"

@dataclass
class RecoInput:
    available_time: int  # minutes
    interest_tags: List[str]
    district: str
    
    @classmethod
    def from_request(cls, query_params) -> 'RecoInput':
        return cls(
            available_time=int(query_params.get('available_time', 0)),
            interest_tags=query_params.get('interest_tags', '').split(',') if query_params.get('interest_tags') else [],
            district=query_params.get('district', '')
        )

@dataclass
class HotspotCandidate:
    id: int
    name: str
    description: str
    district: str
    tags: List[str]
    duration_minutes: int
    operating_hours: str
    # We deliberately decouple from the full Hotspot model here
    
@dataclass
class ScoredRecommendation:
    hotspot: HotspotCandidate
    score: float
    score_breakdown: Dict[str, float]
    explanation: str
    crowd_state: CrowdState = CrowdState.UNKNOWN
    
    def to_dict(self):
        return {
            "hotspot_id": self.hotspot.id,
            "name": self.hotspot.name,
            "description": self.hotspot.description,
            "district": self.hotspot.district,
            "tags": self.hotspot.tags,
            "duration_minutes": self.hotspot.duration_minutes,
            
            "score": self.score,
            "breakdown": self.score_breakdown,
            "explanation": self.explanation,
            "crowd_label": self.crowd_state.value,
            
            # Mock media for now since Candidate DTO doesn't have it yet
            # Real solution: Add media to Candidate or fetch separate.
            # For safer integration, we return what we have.
             "media": [], 
        }
