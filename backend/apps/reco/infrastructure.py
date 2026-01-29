from typing import List, Dict
from django.db.models import Q
from listings.models import Hotspot
from .domain import HotspotCandidate, CrowdState
from .interfaces import HotspotRepository, CrowdAdapter

class DjangoHotspotRepository(HotspotRepository):
    def get_candidates(self, district: str) -> List[HotspotCandidate]:
        # Fetch LIVE hotspots in the district
        qs = Hotspot.objects.filter(
            district__iexact=district,
            status=Hotspot.Status.Live
        )
        
        candidates = []
        for h in qs:
            candidates.append(HotspotCandidate(
                id=h.id,
                name=h.name,
                description=h.description,
                district=h.district,
                tags=h.tags or [],
                duration_minutes=h.duration_minutes or 60, # Default 1 hour
                operating_hours=h.operating_hours
            ))
        return candidates

class StubCrowdAdapter(CrowdAdapter):
    def get_crowd_levels(self, hotspot_ids: List[int]) -> Dict[int, CrowdState]:
        # Fallback: Assume UNKNOWN for all
        return {hid: CrowdState.UNKNOWN for hid in hotspot_ids}
