from typing import List
from django.conf import settings
from .domain import RecoInput, ScoredRecommendation
from .infrastructure import DjangoHotspotRepository, StubCrowdAdapter
from .scoring import ScoringEngine

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
