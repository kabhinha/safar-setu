import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const api = {
    health: () => axios.get(`${API_BASE}/health`),

    login: (invite_token: string) =>
        axios.post(`${API_BASE}/auth/login`, { invite_token }),

    register: (email: string, password: string, invite_token: string) =>
        axios.post(`${API_BASE}/auth/register`, { email, password, invite_token }),

    getDistrictStats: (district_id: string) =>
        axios.get(`${API_BASE}/analytics/district/${district_id}`),

    chat: (message: string, district_id: string) =>
        axios.post(`${API_BASE}/chat/message`, {
            message,
            context_district: district_id
        })
};
