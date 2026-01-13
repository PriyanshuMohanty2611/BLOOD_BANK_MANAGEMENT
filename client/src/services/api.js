import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo && userInfo !== 'undefined') {
            const parsed = JSON.parse(userInfo);
            if (parsed && parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
    } catch (e) {
        console.warn("Auth interceptor error:", e);
    }
    return config;
});

export default api;
