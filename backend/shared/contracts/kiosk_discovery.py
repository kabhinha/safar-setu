from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class DiscoveryRequest:
    available_time: int
    interest_tags: List[str]
    district_id: Optional[str] = None

@dataclass
class TransportHubOption:
    name: str
    type: str # 'BUS', 'RAIL', 'TAXI', 'FERRY', 'OTHER'
    notes: Optional[str] = None

@dataclass
class DiscoveryResult:
    hotspot_id: str
    title: str
    short_description: str
    district_name: str
    cluster_label: str
    typical_duration_min: Optional[int]
    distance_band: str # 'NEAR', 'MEDIUM', 'FAR'
    approx_travel_time_min: Optional[int]
    nearest_transport_hub: Optional[TransportHubOption]
    safety_note: Optional[str] = None
