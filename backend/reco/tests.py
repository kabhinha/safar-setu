from django.test import SimpleTestCase
import unittest
import unittest.mock
from .domain import RecoInput, HotspotCandidate, CrowdState
from .scoring import ScoringEngine, TimeFeasibilityScorer, InterestMatchScorer
from .service import RecommendationService

class ScorerTests(SimpleTestCase):
    def setUp(self):
        self.candidate = HotspotCandidate(
            id=1, name="Test Spot", description="Desc", district="Test",
            tags=["Nature", "Adventure"], duration_minutes=60, operating_hours="9-5"
        )
        
    def test_time_scorer(self):
        scorer = TimeFeasibilityScorer()
        # Case 1: Enough time
        inp = RecoInput(available_time=120, interest_tags=[], district="Test")
        self.assertEqual(scorer.score(self.candidate, inp), 1.0)
        
        # Case 2: Not enough time
        inp = RecoInput(available_time=30, interest_tags=[], district="Test")
        self.assertEqual(scorer.score(self.candidate, inp), 0.0)

    def test_interest_scorer(self):
        scorer = InterestMatchScorer()
        # Case 1: Partial Match
        inp = RecoInput(available_time=120, interest_tags=["nature", "food"], district="Test")
        # 1 match out of 2 interests (Nature) -> 0.5
        self.assertEqual(scorer.score(self.candidate, inp), 0.5)
        
        # Case 2: No Match
        inp = RecoInput(available_time=120, interest_tags=["urban"], district="Test")
        self.assertEqual(scorer.score(self.candidate, inp), 0.0)

class ServiceTests(SimpleTestCase):
    def test_service_instantiation(self):
        # We mock the repository to avoid DB access during simple init test
        with unittest.mock.patch('reco.service.DjangoHotspotRepository'):
            service = RecommendationService()
            self.assertIsNotNone(service)

    @unittest.mock.patch('reco.service.DjangoHotspotRepository')
    @unittest.mock.patch('reco.service.StubCrowdAdapter')
    def test_get_recommendations(self, mock_crowd, mock_repo):
        # Setup Mocks
        candidate = HotspotCandidate(
            id=1, name="Mock Spot", description="Desc", district="Test",
            tags=["fun"], duration_minutes=60, operating_hours="9-5"
        )
        mock_repo.return_value.get_candidates.return_value = [candidate]
        mock_crowd.return_value.get_crowd_levels.return_value = {1: CrowdState.LOW}
        
        service = RecommendationService()
        inp = RecoInput(available_time=120, interest_tags=["fun"], district="Test")
        
        results = service.get_recommendations(inp)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].hotspot.id, 1)
