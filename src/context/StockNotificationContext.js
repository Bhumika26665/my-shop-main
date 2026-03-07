import React, { createContext, useContext, useState } from 'react';
import axios from '../axiosConfig';
import CookieService from '../services/cookieService';

const StockNotificationContext = createContext();

export const useStockNotification = () => {
    return useContext(StockNotificationContext);
};

export const StockNotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const createNotification = async (productId, size, color, email) => {
        setLoading(true);
        setError('');
        
        try {
            const user = CookieService.getUser();
            if (!user || !user.id) {
                throw new Error('Please login to request notifications');
            }

            const response = await axios.post('/stock-notifications', {
                productId,
                size,
                color,
                email,
                userId: user.id
            });

            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create notification';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const getUserNotifications = async () => {
        setLoading(true);
        setError('');
        
        try {
            const user = CookieService.getUser();
            if (!user || !user.id) {
                return [];
            }

            const response = await axios.get(`/stock-notifications/user/${user.id}`);
            setNotifications(response.data.data);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notifications';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const cancelNotification = async (notificationId) => {
        try {
            await axios.delete(`/stock-notifications/${notificationId}`);
            
            // Update local state
            setNotifications(prev => 
                prev.filter(notification => notification._id !== notificationId)
            );
            
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel notification';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return (
        <StockNotificationContext.Provider value={{
            notifications,
            loading,
            error,
            createNotification,
            getUserNotifications,
            cancelNotification
        }}>
            {children}
        </StockNotificationContext.Provider>
    );
};
