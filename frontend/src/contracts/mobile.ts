export interface InquiryRequest {
    phone: string;
    name?: string;
    group_size?: number;
    preferred_date?: string; // YYYY-MM-DD
    note?: string;
    resource_type: 'HOTSPOT' | 'SIGHT' | 'GENERAL';
    resource_id: string;
}

export interface InquiryResponse {
    status: string;
    message: string;
    reference_token: string;
    data: any;
}

export interface MobileData<T> {
    data: T;
    token_valid: boolean;
    token_error?: string;
}

// Re-using existing types from listings/sights where possible,
// but defining Mobile specific wrappers if needed.
