import api from './api';

export interface RecoInput {
    available_time: number;
    interest_tags: string[];
    district: string;
}

export interface Recommendation {
    hotspot_id: number;
    name: string;
    score: number;
    breakdown: {
        time_feasibility: number;
        interest_match: number;
        crowd_penalty: number;
        fair_rotation: number;
    };
    explanation: string;
    crowd_label: string;
    // Basic fields for display if backend returns them, otherwise might need a separate fetch
    // (The current backend returns a mapped subset in 'hotspot' field? 
    // Wait, the backend domain.py says ScoredRecommendation has 'hotspot' field, 
    // but the to_dict() method flattens it. Let's check backend/reco/domain.py again.)
}

export interface RecoResponse {
    meta: any;
    data: Recommendation[];
}

export const getRecommendations = async (input: RecoInput): Promise<RecoResponse> => {
    // The backend endpoint is /api/public/recommendations/
    // internal api instance has baseURL /api/v1 usually, or generic. 
    // Let's check api.ts again. It says baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    // My endpoint is at /api/public/recommendations/ (not v1).
    // So I should use a custom url or modify the base.

    // Hack: use absolute path or go up one level if possible, or just use axios directly.
    // Let's use the instance but override baseURL in the call if needed, or just path.
    // If baseURL is .../api/v1, then ../public/recommendations works.

    const params = new URLSearchParams();
    if (input.available_time) params.append('available_time', input.available_time.toString());
    if (input.interest_tags.length) params.append('interest_tags', input.interest_tags.join(','));
    if (input.district) params.append('district', input.district);

    // Using relative path to escape v1 if needed, or assuming /api/v1/../public/recommendations
    // Safest is to just call the full URL or check if api.ts allows easy override.
    // Let's assume we can just use the path relative to root if we use a different axios instance or just string manipulation.
    // Actually, let's just use /api/public/recommendations and hope the proxy/baseURL handles it.
    // If api.csv has baseURL of .../api/v1, then `get('/public/...')` might append to it. 
    // ../public might work.

    const response = await api.get(`/public/recommendations/?${params.toString()}`, {
        baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/v1', '')
    });
    return response.data;
};
