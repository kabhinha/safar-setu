from typing import List, Optional
from django.conf import settings
from shared.contracts.kiosk_discovery import DiscoveryRequest, DiscoveryResult, TransportHubOption
from listings.models import Hotspot
from django.db.models import Q
from .domain import RecoInput, ScoredRecommendation
from .infrastructure import DjangoHotspotRepository, StubCrowdAdapter
from .scoring import ScoringEngine

def get_kiosk_recommendations(request: DiscoveryRequest) -> List[DiscoveryResult]:
    """
    Deterministic recommendation engine for Kiosk Discovery.
    Filters by:
    - District (exact match)
    - Available Time (duration <= available)
    - Status (Live/Approved public safe)
    RANKING:
    - Interest Tags overlap
    """
    
    # Base Query
    query = Hotspot.objects.filter(
        status=Hotspot.Status.Live,
        sensitivity_level=Hotspot.Sensitivity.Public # ensure public only
    ).exclude(sensitivity_level='RESTRICTED') # Redundant but safe
    
    # 1. District Filter
    if request.district_id:
        # Assuming district_id maps to district name or we strictly use district name as ID for now
        # Ideally ID should be used, but Hotspot model has CharField district.
        # We will assume district_id IS the name for this pilot phase if not resolved otherwise.
        # Or better, let's treat it as case-insensitive name match
        query = query.filter(district__iexact=request.district_id)

    # 2. Time Filter (Strict)
    # If duration is NULL, we assume it takes 60 mins default or exclude? 
    # Let's include items with null duration or duration <= available_time
    # But usually null duration means "unknown", might be risky. Let's generally allow if undefined, but maybe penalty.
    # For pilot: strict check if duration is defined.
    if request.available_time:
        query = query.filter(Q(duration_minutes__lte=request.available_time) | Q(duration_minutes__isnull=True))

    # Fetch candidates
    candidates = list(query.all())
    
    # 3. Scoring (In-Memory for Pilot)
    scored_candidates = []
    
    user_interests = set(t.lower() for t in request.interest_tags)
    
    for spot in candidates:
        score = 0
        
        # Interest Match
        spot_tags = set(t.lower() for t in spot.tags)
        overlap = user_interests.intersection(spot_tags)
        score += len(overlap) * 10
        
        # Penalty if duration is unknown (risky)
        if spot.duration_minutes is None:
            score -= 5
            
        scored_candidates.append((score, spot))
        
    # Sort by Score DESC
    scored_candidates.sort(key=lambda x: x[0], reverse=True)
    
    # Take top 6
    top_picks = [x[1] for x in scored_candidates[:6]]
    
    # Map to DTO
    results = []
    for spot in top_picks:
        # Safe defaults
        dist_band = spot.distance_band if spot.distance_band else "MEDIUM"
        travel_time = spot.approx_travel_time_min
        
        hub = None
        if spot.nearest_transport_hub_name:
            hub = TransportHubOption(
                name=spot.nearest_transport_hub_name,
                type=spot.nearest_transport_hub_type or "OTHER"
            )
            
        results.append(DiscoveryResult(
            hotspot_id=str(spot.id),
            title=spot.name,
            short_description=spot.short_description,
            district_name=spot.district,
            cluster_label=spot.village_cluster_label,
            typical_duration_min=spot.duration_minutes,
            distance_band=dist_band,
            approx_travel_time_min=travel_time,
            nearest_transport_hub=hub,
            safety_note=spot.safety_notes
        ))
        
    return results

class RecommendationService:
    def __init__(self):
        self.repo = DjangoHotspotRepository()
        self.crowd_adapter = StubCrowdAdapter()
        self.scorer = ScoringEngine()
        
    def get_recommendations(self, input_data: RecoInput) -> List[ScoredRecommendation]:
        # 1. Feature Flag Check
        if not getattr(settings, 'RECO_FEATURE_FLAG', True):
            return self._get_fallback_list(input_data)

        # 2. Fetch Candidates
        candidates = self.repo.get_candidates(input_data.district)
        if not candidates:
            return []

        # 3. Fetch Context (Crowd)
        candidate_ids = [c.id for c in candidates]
        crowd_map = self.crowd_adapter.get_crowd_levels(candidate_ids)

        # 4. Score
        results = []
        for cand in candidates:
            crowd = crowd_map.get(cand.id, 'UNKNOWN')
            scored = self.scorer.calculate(cand, input_data, crowd)
            if scored.score > 0: # Filter out zero scores (usually time invalid)
                results.append(scored)
                
        # 5. Sort
        results.sort(key=lambda x: x.score, reverse=True)
        
        return results

    def _get_fallback_list(self, input_data: RecoInput) -> List[ScoredRecommendation]:
        """Simple unfiltered list if engine is disabled"""
        candidates = self.repo.get_candidates(input_data.district)
        results = []
        for c in candidates:
            # Dummy score
            results.append(ScoredRecommendation(
                hotspot=c,
                score=1.0,
                score_breakdown={},
                explanation="Standard listing (Engine Disabled)",
                crowd_state='UNKNOWN'
            ))
        return results
