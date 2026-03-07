// Cookie-based authentication service
class CookieService {
    // Helper function to get cookie value
    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Helper function to set cookie
    static setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    }

    // Helper function to delete cookie
    static deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
    }

    // Get user from localStorage (we still need this for user info)
    static getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Set user in localStorage
    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Check if user is authenticated
    static isAuthenticated() {
        const accessToken = this.getCookie('accessToken');
        const user = this.getUser();
        
        console.log('isAuthenticated check:', {
            accessToken: accessToken ? 'EXISTS' : 'MISSING',
            user: user ? 'EXISTS' : 'MISSING',
            allCookies: document.cookie
        });
        
        // Note: refreshToken is HttpOnly and cannot be accessed by JavaScript
        // We only need to check accessToken and user data for frontend authentication
        return !!(accessToken && user);
    }

    // Debug method to check all cookies
    static debugCookies() {
        console.log('All cookies:', document.cookie);
        console.log('Access token:', this.getCookie('accessToken'));
        console.log('Refresh token:', this.getCookie('refreshToken'));
        console.log('User data:', this.getUser());
    }

    // Clear all authentication data
    static clearAuth() {
        this.deleteCookie('accessToken');
        this.deleteCookie('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiresIn');
    }

    // Get access token from cookie
    static getAccessToken() {
        return this.getCookie('accessToken');
    }

    // Get refresh token from cookie
    static getRefreshToken() {
        return this.getCookie('refreshToken');
    }

    // Store user info after login
    static storeAuthData(user, expiresIn) {
        this.setUser(user);
        localStorage.setItem('tokenExpiresIn', expiresIn);
    }
}

export default CookieService;
