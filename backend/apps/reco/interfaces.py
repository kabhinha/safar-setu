from abc import ABC, abstractmethod
from typing import List, Dict
from .domain import HotspotCandidate, CrowdState

class HotspotRepository(ABC):
    @abstractmethod
    def get_candidates(self, district: str) -> List[HotspotCandidate]:
        pass

class CrowdAdapter(ABC):
    @abstractmethod
    def get_crowd_levels(self, hotspot_ids: List[int]) -> Dict[int, CrowdState]:
        pass

class RecoSettings(ABC):
    @abstractmethod
    def get_weights(self) -> Dict[str, float]:
        pass
