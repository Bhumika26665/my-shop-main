import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import { FaBell, FaBellSlash, FaPlay, FaStop, FaRedo, FaFlask, FaChartBar } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

// Safe toast function to prevent undefined errors
const safeToast = {
    success: (message) => {
        try {
            toast?.success?.(message);
        } catch (error) {
            console.log('safeToast.success:', message);
        }
    },
    error: (message) => {
        try {
            toast?.error?.(message);
        } catch (error) {
            console.log('Toast error:', message);
        }
    }
};

// Helper function to convert base64 to Uint8Array
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
}

const CartReminderManager = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        fetchStats();
        checkSubscriptionStatus();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/cart-reminders/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const checkSubscriptionStatus = async () => {
        try {
            const response = await axiosInstance.get('/cart-reminders/subscriptions');
            setSubscribed(response.data.length > 0);
            if (response.data.length > 0) {
                setSubscription(response.data[0]);
            }
        } catch (error) {
            console.error('Error checking subscription status:', error);
        }
    };

    const subscribeToNotifications = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            safeToast.error('Push notifications are not supported in your browser');
            return;
        }

        try {
            setLoading(true);
            console.log('Starting subscription process...');
            
            // Request permission
            const permission = await Notification.requestPermission();
            console.log('Permission result:', permission);
            
            if (permission !== 'granted') {
                safeToast.error('Notification permission denied');
                return;
            }

            // Check if service worker is ready
            console.log('Checking service worker registration...');
            const registration = await navigator.serviceWorker.ready;
            console.log('Service worker ready:', registration);
            
            // Subscribe to push notifications
            console.log('Subscribing to push notifications...');
            const vapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
            console.log('Environment variables:', process.env);
            console.log('VAPID key from env:', vapidKey);
            console.log('VAPID key length:', vapidKey?.length);
            
            if (!vapidKey) {
                console.log('VAPID key not found in env, using fallback');
                // Use fallback key directly
                const fallbackKey = 'BFjt1WeWLaq3keNHPhl3xYJVhY8ZMMTDIDx_eBoawAdh3HpdPd-GxduKTumvdTCUY6bqTi8jg4sE0O5UBrfIxk0';
                const applicationServerKey = urlB64ToUint8Array(fallbackKey);
                console.log('Using fallback VAPID key, length:', applicationServerKey.length);
                
                const pushSubscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                });
                
                console.log('Push subscription created with fallback:', pushSubscription);
                
                // Send subscription to backend
                console.log('Sending subscription to backend...');
                const response = await axiosInstance.post('/cart-reminders/subscribe', {
                    subscription: pushSubscription
                });
                
                console.log('Backend response:', response.data);
                
                setSubscribed(true);
                setSubscription(pushSubscription);
                safeToast.success('Successfully subscribed to push notifications!');
                return;
            }
            
            console.log('Using VAPID key:', vapidKey.substring(0, 50) + '...');
            
            // Convert VAPID key to proper format
            const applicationServerKey = urlB64ToUint8Array(vapidKey);
            console.log('Converted VAPID key length:', applicationServerKey.length);
            
            const pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });

            console.log('Push subscription created:', pushSubscription);

            // Send subscription to backend
            console.log('Sending subscription to backend...');
            const response = await axiosInstance.post('/cart-reminders/subscribe', {
                subscription: pushSubscription
            });
            
            console.log('Backend response:', response.data);

            setSubscribed(true);
            setSubscription(pushSubscription);
            safeToast.success('Successfully subscribed to push notifications!');
            
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
            console.error('Error details:', error.response?.data || error.message);
            
            let errorMessage = 'Failed to subscribe to notifications';
            
            if (error.message.includes('VAPID')) {
                errorMessage = 'VAPID key configuration error';
            } else if (error.message.includes('permission')) {
                errorMessage = 'Notification permission denied';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            safeToast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const unsubscribeFromNotifications = async () => {
        if (!subscription) return;

        try {
            setLoading(true);
            await axiosInstance.delete(`/cart-reminders/subscriptions/${subscription._id}`);
            setSubscribed(false);
            setSubscription(null);
            safeToast.success('Successfully unsubscribed from push notifications');
        } catch (error) {
            console.error('Error unsubscribing from notifications:', error);
            safeToast.error('Failed to unsubscribe from notifications');
        } finally {
            setLoading(false);
        }
    };

    const testNotification = async () => {
        try {
            setLoading(true);
            await axiosInstance.post('/cart-reminders/test-notification');
            safeToast.success('Test notification sent!');
        } catch (error) {
            console.error('Error sending test notification:', error);
            safeToast.error('Failed to send test notification');
        } finally {
            setLoading(false);
        }
    };

    const startService = async () => {
        try {
            setLoading(true);
            await axiosInstance.post('/cart-reminders/service/start');
            safeToast.success('Cart reminder service started');
            fetchStats();
        } catch (error) {
            console.error('Error starting service:', error);
            safeToast.error('Failed to start cart reminder service');
        } finally {
            setLoading(false);
        }
    };

    const stopService = async () => {
        try {
            setLoading(true);
            await axiosInstance.post('/cart-reminders/service/stop');
            safeToast.success('Cart reminder service stopped');
            fetchStats();
        } catch (error) {
            console.error('Error stopping service:', error);
            safeToast.error('Failed to stop cart reminder service');
        } finally {
            setLoading(false);
        }
    };

    const resetReminders = async () => {
        if (!window.confirm('Are you sure you want to reset all reminder flags? This will allow reminders to be sent again for all carts.')) {
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post('/cart-reminders/reset');
            safeToast.success('Reminder flags reset successfully');
            fetchStats();
        } catch (error) {
            console.error('Error resetting reminders:', error);
            safeToast.error('Failed to reset reminder flags');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <ToastContainer />
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaBell className="mr-3" />
                Cart Reminder Management
            </h2>

            {/* Notification Subscription */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Push Notification Subscription</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">
                            Status: <span className={`font-medium ${subscribed ? 'text-green-600' : 'text-red-600'}`}>
                                {subscribed ? 'Subscribed' : 'Not Subscribed'}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Subscribe to receive cart abandonment reminders
                        </p>
                    </div>
                    <button
                        onClick={subscribed ? unsubscribeFromNotifications : subscribeToNotifications}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                            subscribed 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        } disabled:opacity-50`}
                    >
                        {subscribed ? <FaBellSlash className="mr-2" /> : <FaBell className="mr-2" />}
                        {subscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                </div>
            </div>

            {/* Service Controls */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Service Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={startService}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                    >
                        <FaPlay className="mr-2" />
                        Start Service
                    </button>
                    <button
                        onClick={stopService}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                    >
                        <FaStop className="mr-2" />
                        Stop Service
                    </button>
                    <button
                        onClick={resetReminders}
                        disabled={loading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                    >
                        <FaRedo className="mr-2" />
                        Reset Reminders
                    </button>
                </div>
            </div>

            {/* Test Notification */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Test Notifications</h3>
                <button
                    onClick={testNotification}
                    disabled={loading || !subscribed}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                    <FaFlask className="mr-2" />
                    Send Test Notification
                </button>
                {!subscribed && (
                    <p className="text-sm text-gray-500 mt-2">
                        Subscribe to push notifications first to test
                    </p>
                )}
            </div>

            {/* Statistics */}
            {stats && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaChartBar className="mr-2" />
                        Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.totalCarts}</p>
                            <p className="text-gray-600">Total Active Carts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.remindedCarts}</p>
                            <p className="text-gray-600">Reminders Sent</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{stats.pendingCarts}</p>
                            <p className="text-gray-600">Pending Reminders</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {stats.isRunning ? 'Running' : 'Stopped'}
                            </p>
                            <p className="text-gray-600">Service Status</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">How Cart Reminders Work</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>The service checks for abandoned carts every 30 minutes (configurable)</li>
                    <li>Carts abandoned for more than 60 minutes (configurable) trigger reminders</li>
                    <li>Users receive push notifications if they're subscribed</li>
                    <li>Each cart only receives one reminder to avoid spam</li>
                    <li>Test the system by adding items to cart and waiting for the reminder</li>
                </ul>
            </div>
        </div>
    );
};

export default CartReminderManager;
