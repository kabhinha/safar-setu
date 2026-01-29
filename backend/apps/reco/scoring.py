import random
import hashlib
from typing import List, Dict
from .domain import RecoInput, ScoredRecommendation, HotspotCandidate, CrowdState

class BaseScorer:
    def name(self) -> str:
        return self.__class__.__name__

class TimeFeasibilityScorer(BaseScorer):
    def score(self, candidate: HotspotCandidate, input_data: RecoInput) -> float:
        if input_data.available_time <= 0:
            return 1.0 # Ignore if no time constraint
        
        if candidate.duration_minutes <= input_data.available_time:
            return 1.0
        return 0.0

class InterestMatchScorer(BaseScorer):
    def score(self, candidate: HotspotCandidate, input_data: RecoInput) -> float:
        if not input_data.interest_tags:
            return 0.5 # Neutral if no interests provided
            
        candidate_tags = [t.lower() for t in candidate.tags]
        user_interests = [t.lower() for t in input_data.interest_tags]
        
        if not candidate_tags:
            return 0.0
            
        matches = sum(1 for t in user_interests if t in candidate_tags)
        return min(1.0, matches / len(user_interests)) if user_interests else 0.0

class CrowdPenaltyScorer(BaseScorer):
    def score(self, crowd_state: CrowdState) -> float:
        mapping = {
            CrowdState.LOW: 1.0,
            CrowdState.MODERATE: 0.7,
            CrowdState.HIGH: 0.2,
            CrowdState.UNKNOWN: 1.0 # Benefit of doubt
        }
        return mapping.get(crowd_state, 1.0)

class FairRotationScorer(BaseScorer):
    def score(self, candidate: HotspotCandidate) -> float:
        # Deterministic "random" based on ID and day (mocking day variance with just ID for now)
        # In real prod, could act on date.
        h = hashlib.md5(str(candidate.id).encode()).hexdigest()
        val = int(h, 16) % 100
        return val / 100.0

class ScoringEngine:
    def __init__(self):
        self.time_scorer = TimeFeasibilityScorer()
        self.interest_scorer = InterestMatchScorer()
        self.crowd_scorer = CrowdPenaltyScorer()
        self.rotation_scorer = FairRotationScorer()

    def calculate(self, candidate: HotspotCandidate, input_data: RecoInput, crowd_state: CrowdState) -> ScoredRecommendation:
        
        s_time = self.time_scorer.score(candidate, input_data)
        s_interest = self.interest_scorer.score(candidate, input_data)
        s_crowd = self.crowd_scorer.score(crowd_state)
        s_rotation = self.rotation_scorer.score(candidate)
        
        # Weighted Sum (Weights could be config driven)
        # Hardcoded Policy: Time is hard constraint (multiplier)
        
        # Interest: 40%, Crowd: 30%, Rotation: 30%
        base_score = (s_interest * 0.4) + (s_crowd * 0.3) + (s_rotation * 0.3)
        final_score = base_score * s_time # If time feasible is 0, score is 0
        
        breakdown = {
            "time_feasibility": s_time,
            "interest_match": s_interest,
            "crowd_penalty": s_crowd,
            "fair_rotation": s_rotation
        }
        
        explanation = "Fits your time."
        if s_time == 0:
            explanation = "Exceeds available time."
        elif s_interest > 0.8:
            explanation = "Great match for your interests."
            
        return ScoredRecommendation(
            hotspot=candidate,
            score=round(final_score, 2),
            score_breakdown=breakdown,
            explanation=explanation,
            crowd_state=crowd_state
        )
