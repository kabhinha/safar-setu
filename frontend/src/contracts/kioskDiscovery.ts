export interface DiscoveryRequest {
    available_time: number;
    interest_tags: string[];
    district_id: string;
}

export interface TransportHubOption {
    name: string;
    type: string; // 'BUS_STAND' | 'RAILWAY_STATION' | 'TAXI_POINT' | 'FERRY' | 'OTHER'
    notes?: string;
}

export interface DiscoveryResult {
    hotspot_id: string;
    title: string;
    short_description: string;
    district_name: string;
    cluster_label: string;
    typical_duration_min?: number;
    distance_band: string; // 'NEAR' | 'MEDIUM' | 'FAR'
    approx_travel_time_min?: number;
    nearest_transport_hub?: TransportHubOption;
    safety_note?: string;
}

export interface DistrictOption {
    district_id: string;
    name: string;
}
