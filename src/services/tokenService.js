import axios from '../axiosConfig';

class TokenService {
    static getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    static getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    static getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    static setTokens(accessToken, refreshToken, user, expiresIn) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tokenExpiresIn', expiresIn);
    }

    static removeTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiresIn');
    }

    static async refreshAccessToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post('/users/refresh-token', {
                refreshToken: refreshToken
            });

            if (response.data.accessToken) {
                const user = this.getUser();
                this.setTokens(
                    response.data.accessToken,
                    response.data.refreshToken,
                    user,
                    response.data.expiresIn
                );
                return response.data.accessToken;
            }
        } catch (error) {
            // Refresh token failed, clear all tokens
            this.removeTokens();
            throw error;
        }
    }

    static async logout() {
        try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                await axios.post('/users/logout', {
                    refreshToken: refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeTokens();
        }
    }

    static async logoutAll() {
        try {
            await axios.post('/users/logout-all');
        } catch (error) {
            console.error('Logout all error:', error);
        } finally {
            this.removeTokens();
        }
    }

    static async getActiveTokens() {
        try {
            const response = await axios.get('/users/active-tokens');
            return response.data;
        } catch (error) {
            console.error('Get active tokens error:', error);
            return [];
        }
    }

    static isTokenExpired() {
        const expiresIn = localStorage.getItem('tokenExpiresIn');
        if (!expiresIn) return true;
        
        // For simplicity, we'll check if we have a token
        // In production, you should decode the JWT and check the exp claim
        const token = this.getAccessToken();
        return !token;
    }
}

export default TokenService;
