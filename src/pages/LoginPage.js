// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import CookieService from '../services/cookieService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Check if user is already authenticated and redirect
    useEffect(() => {
        console.log('LoginPage: Checking authentication...');
        console.log('LoginPage: isAuthenticated:', isAuthenticated);
        
        // Debug all authentication data
        const accessToken = CookieService.getAccessToken();
        const userData = CookieService.getUser();
        const allCookies = document.cookie;
        
        console.log('LoginPage: Auth Debug:', {
            isAuthenticated,
            accessToken: accessToken ? 'EXISTS' : 'MISSING',
            userData: userData ? 'EXISTS' : 'MISSING',
            allCookies: allCookies
        });
        
        if (isAuthenticated) {
            console.log('LoginPage: User already authenticated, redirecting to admin dashboard');
            navigate('/admin', { replace: true });
        } else {
            console.log('LoginPage: User not authenticated, showing login form');
            setAuthChecking(false);
        }
    }, [isAuthenticated, navigate]);

    // Show loading indicator while checking authentication
    if (authChecking) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/users/login', {
                email: email,
                password: password
            });

            if (response.data.user) {
                // Tokens are automatically set in cookies by the backend
                // Store user info in localStorage for UI purposes
                CookieService.storeAuthData(response.data.user, response.data.expiresIn);
                login(response.data.user);
                navigate('/admin');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 
                err.response?.data || 
                'Invalid email or password'
            );
        } finally {
            setLoading(false);
        }
    };

    // Debug function to manually check cookies
    const debugCookies = () => {
        console.log('=== DEBUG COOKES ===');
        console.log('All cookies:', document.cookie);
        console.log('Access token:', CookieService.getAccessToken());
        console.log('Refresh token:', CookieService.getRefreshToken());
        console.log('User data:', CookieService.getUser());
        console.log('isAuthenticated:', CookieService.isAuthenticated());
        console.log('isAuthenticated (context):', isAuthenticated);
        console.log('==================');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl mb-4">Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                {/* Debug Button */}
                <div className="mb-4 text-center">
                    <button
                        type="button"
                        onClick={debugCookies}
                        className="text-xs text-blue-500 underline hover:no-underline"
                    >
                        Debug Cookies
                    </button>
                </div>
                
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded w-full p-2"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded w-full p-2"
                        required
                        disabled={loading}
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white rounded w-full p-2 hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
