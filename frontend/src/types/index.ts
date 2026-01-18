export type UserRole = 'TRAVELER' | 'HOST' | 'MODERATOR' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: UserRole;
    is_verified: boolean;
    invite_code?: string;
    govt_id_hash?: string;
}

export interface Hotspot {
    id: string;
    title: string;
    description: string;
    district: string;
    host_id: string;
    images: string[];
    story: string;
    activities: string[];
    seasonality: string;
    sensitivity: 'PUBLIC' | 'PROTECTED' | 'RESTRICTED';
    location_fuzzy: { lat: number; lng: number };
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Booking {
    id: string;
    hotspot_id: string;
    guest_id: string;
    start_date: string;
    end_date: string;
    status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
    guest_count: number;
}
