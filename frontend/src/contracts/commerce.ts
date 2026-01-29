export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    vendor_id: number;
    active: boolean;
}

export interface Deal {
    id: string;
    product: string; // product name
    status: 'INITIATED' | 'VENDOR_CONFIRMED' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';
    amount: number;
}

export interface InitiateResponse {
    deal_id: string;
    token_value: string; // QR-1
    expires_at: string;
    status: string;
}

export interface StatusResponse {
    id: string;
    status: 'INITIATED' | 'VENDOR_CONFIRMED' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';
    product: string;
    amount: number;
}
