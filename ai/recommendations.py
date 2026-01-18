from typing import List, Dict, Any, Optional
import numpy as np

# Mocking a vector search result for the pilot without a live DB connection in this class yet.
# In "real" integration, this class would query pgvector.

class RecommendationEngine:
    """
    Core Logic for matching Travelers to Hotspots (Ethical Recs).
    """

    def __init__(self, embedding_service):
        self.embedding_service = embedding_service
        # Thresholds
        self.SIMILARITY_THRESHOLD = 0.5
        self.CROWD_PENALTY_FACTOR = 0.3 # Reduce score by 30% if crowded

    def cold_start(self, explicit_tags: List[str], all_hotspots: List[Dict]) -> List[Dict]:
        """
        Ethical Cold Start:
        Relies ONLY on what the user explicitly selected (e.g. "Hiking", "Tea", "Quiet").
        No inferred history.
        """
        matches = []
        for spot in all_hotspots:
            score = 0
            explanation = []
            
            # Simple overlap scoring for cold start
            spot_tags = set(spot.get('tags', []) + spot.get('sensory_tags', []))
            user_tags = set(explicit_tags)
            overlap = spot_tags.intersection(user_tags)
            
            if overlap:
                score = len(overlap) / len(user_tags) # Basic Jaccard-ish
                explanation = [f"Matches your interest in: {', '.join(overlap)}"]
            
            if score > 0:
                matches.append({
                    "id": spot['id'],
                    "title": spot['title'],
                    "score": score,
                    "explanation": explanation
                })
        
        # Sort by score desc
        return sorted(matches, key=lambda x: x['score'], reverse=True)

    def recommend(self, 
                  user_profile_text: str, 
                  candidate_hotspots: List[Dict], 
                  district_crowd_index: Dict[str, str] = {}) -> List[Dict]:
        """
        Vector-based recommendation with Crowd Penalties.
        
        district_crowd_index: map of DistrictID -> CrowdDensityState ('HIGH', 'LOW')
        """
        user_vector = self.embedding_service.create_traveler_vector(user_profile_text)
        
        results = []
        
        for spot in candidate_hotspots:
            # 1. Similarity Score
            # If we had pre-computed vectors, we'd use them. Here we generate on fly for the service demo
            # In prod, 'spot' would come from pgvector with distance pre-calc.
            spot_vector = self.embedding_service.create_hotspot_vector(spot['description'], spot.get('sensory_tags', []))
            
            # cosine similarity
            similarity = np.dot(user_vector, spot_vector) / (np.linalg.norm(user_vector) * np.linalg.norm(spot_vector))
            
            # 2. Crowd Constraint Application
            district = spot.get('district_id')
            crowd_state = district_crowd_index.get(district, 'LOW')
            
            final_score = similarity
            penalty_applied = False
            
            if crowd_state in ['HIGH', 'CRITICAL']:
                final_score = final_score * (1.0 - self.CROWD_PENALTY_FACTOR)
                penalty_applied = True
            
            if final_score > self.SIMILARITY_THRESHOLD:
                reasons = [f"Matches your vibe"]
                if penalty_applied:
                    reasons.append("Score lowered due to high footfall in district.")
                
                results.append({
                    "id": spot['id'],
                    "title": spot['title'],
                    "score": float(final_score),
                    "explanation": reasons,
                    "crowd_penalty": penalty_applied
                })
                
        return sorted(results, key=lambda x: x['score'], reverse=True)
