// src/axiosConfig.js
import axios from 'axios';
import CookieService from './services/cookieService';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://bhumika-eshop-backend.onrender.com/api/v1',
    withCredentials: true, // Important for cookies to work
});

// Add a request interceptor to include auth token
instance.interceptors.request.use(
    (config) => {
        const token = CookieService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors and token refresh
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'https://bhumika-eshop-backend.onrender.com/api/v1'}/users/refresh-token`, {}, {
                    withCredentials: true
                });
                
                // Retry the original request
                return instance(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear auth and redirect to login
                CookieService.clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
