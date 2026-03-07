import React, { createContext, useContext, useState, useEffect } from 'react';
import CookieService from '../services/cookieService';
import axios from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on mount and when dependencies change
    useEffect(() => {
        console.log('AuthProvider: Initializing authentication check...');
        const checkAuth = () => {
            console.log('AuthProvider: Checking authentication status...');
            
            const accessToken = CookieService.getAccessToken();
            const userData = CookieService.getUser();
            const authStatus = CookieService.isAuthenticated();
            
            console.log('AuthProvider: Auth check results:', {
                accessToken: accessToken ? 'EXISTS' : 'MISSING',
                userData: userData ? 'EXISTS' : 'MISSING',
                authStatus: authStatus,
                allCookies: document.cookie
            });
            
            console.log('AuthProvider: Setting isAuthenticated to:', authStatus);
            setIsAuthenticated(authStatus);
            setUser(userData);
            setLoading(false);
        };

        checkAuth();

        // Listen for storage changes (for cross-tab sync)
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Monitor axios interceptors for token refresh
    useEffect(() => {
        const setupAxiosInterceptor = () => {
            const responseInterceptor = axios.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;

                    // If error is 401 and we haven't tried refreshing yet
                    if (error.response?.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;

                        try {
                            // Try to refresh the token
                            await axios.post(`${axios.defaults.baseURL}/users/refresh-token`, {}, {
                                withCredentials: true
                            });
                            
                            // Update auth state after successful refresh
                            const authStatus = CookieService.isAuthenticated();
                            const userData = CookieService.getUser();
                            
                            setIsAuthenticated(authStatus);
                            setUser(userData);
                            
                            // Retry the original request
                            return axios(originalRequest);
                        } catch (refreshError) {
                            // Refresh failed, clear auth and update state
                            CookieService.clearAuth();
                            setIsAuthenticated(false);
                            setUser(null);
                            
                            // Only redirect if not already on login page
                            if (window.location.pathname !== '/login') {
                                window.location.href = '/login';
                            }
                            
                            return Promise.reject(refreshError);
                        }
                    }

                    return Promise.reject(error);
                }
            );

            return () => {
                axios.interceptors.response.eject(responseInterceptor);
            };
        };

        const cleanup = setupAxiosInterceptor();
        return cleanup;
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        CookieService.clearAuth();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
