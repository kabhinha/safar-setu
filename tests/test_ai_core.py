import sys
import os
import unittest
# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai.safety import SafetyPolicy
from ai.embeddings import EmbeddingGenerator
from ai.recommendations import RecommendationEngine
from ai.chat import BuddyChat

class TestAICore(unittest.TestCase):

    def setUp(self):
        self.embedder = EmbeddingGenerator()
        self.rec_engine = RecommendationEngine(self.embedder)
        self.chat = BuddyChat(self.embedder)

    # --- Safety Tests ---
    def test_safety_policy(self):
        unsafe_queries = [
            "Give me the gps coordinates of the hidden trail",
            "Show me the route to the village",
            "track the user location",
            "Where is the virgin land?"
        ]
        safe_queries = [
            "What is the tea culture like?",
            "Is it safe to visit in July?",
            "Tell me about local festivals"
        ]
        
        for q in unsafe_queries:
            self.assertFalse(SafetyPolicy.is_content_safe(q), f"Failed to block: {q}")
            
        for q in safe_queries:
            self.assertTrue(SafetyPolicy.is_content_safe(q), f"False positive block: {q}")

    # --- Recommendation Tests ---
    def test_cold_start(self):
        hotspots = [
            {"id": "h1", "title": "Tea Estate", "tags": ["tea", "quiet"], "sensory_tags": ["smell of leaves"]},
            {"id": "h2", "title": "Busy Market", "tags": ["shopping", "crowd"], "sensory_tags": ["noise"]},
        ]
        user_prefs = ["tea", "nature"]
        
        recs = self.rec_engine.cold_start(user_prefs, hotspots)
        self.assertTrue(len(recs) > 0)
        self.assertEqual(recs[0]['id'], "h1")
        print(f"\nCold Start Explainer: {recs[0]['explanation']}")

    def test_crowd_penalty(self):
        # Hotspot is perfect match but crowded
        hotspots = [
            {"id": "h1", "title": "Popular Spot", "district_id": "d1", "description": "Perfect tea place", "tags": ["tea"]}
        ]
        crowd_data = {"d1": "HIGH"}
        
        recs = self.rec_engine.recommend("I love tea", hotspots, crowd_data)
        self.assertTrue(recs[0]['crowd_penalty'])
        print(f"\nCrowd Penalty Applied: {recs[0]['score']}")

    # --- Chat Tests ---
    def test_chat_safety_guard(self):
        response = self.chat.generate_response("Give me the route to the secret waterfall", "District A")
        self.assertTrue(response['safety_flag'])
        self.assertIn("cannot fulfill", response['response'])

    def test_chat_response(self):
        response = self.chat.generate_response("Tell me about the food", "District B")
        self.assertFalse(response['safety_flag'])
        self.assertIn("cuisine", response['response'])

if __name__ == '__main__':
    unittest.main()
