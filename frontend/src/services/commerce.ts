import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
}

export interface DealResponse {
    deal_id: string;
    token_value: string;
    expires_at: string;
    status: string;
}

export const commerceService = {
    getProducts: async () => {
        const res = await axios.get<Product[]>(`${API_URL}/commerce/products/`);
        return res.data;
    },

    initiateDeal: async (productId: string) => {
        const res = await axios.post<DealResponse>(`${API_URL}/commerce/deals/initiate/`, {
            product_id: productId,
            kiosk_id: 'DEMO_KIOSK',
            district_id: 'DEMO_DISTRICT'
        });
        return res.data;
    },

    // Vendor Scan
    scanToken: async (tokenValue: string) => {
        const res = await axios.post(`${API_URL}/commerce/scan/`, {
            token_value: tokenValue
        });
        return res.data;
    },

    // Vendor Generate Confirm Token
    getVendorToken: async (dealId: string) => {
        const res = await axios.post<{ token_value: string }>(`${API_URL}/commerce/deals/${dealId}/vendor-token/`);
        return res.data;
    },

    checkStatus: async (dealId: string) => {
        const res = await axios.get(`${API_URL}/commerce/deals/${dealId}/status/`);
        return res.data;
    }
};
