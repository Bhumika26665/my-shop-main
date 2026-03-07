import React, { useState } from 'react';
import { useStockNotification } from '../context/StockNotificationContext';
import { FaBell } from 'react-icons/fa';
import CookieService from '../services/cookieService';

const NotifyMeButton = ({ productId, size, color, className = '' }) => {
    const { createNotification, loading } = useStockNotification();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleNotifyMe = async () => {
        const user = CookieService.getUser();
        
        // If user is logged in, use their email
        if (user && user.email) {
            await submitNotification(user.email);
        } else {
            // Show email modal for non-logged in users
            setShowEmailModal(true);
        }
    };

    const submitNotification = async (userEmail) => {
        try {
            const result = await createNotification(productId, size, color, userEmail);
            
            if (result.success) {
                setMessage('✓ We\'ll notify you when this item is back in stock!');
                setShowEmailModal(false);
                setEmail('');
                
                // Clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(result.error || 'Failed to create notification');
            }
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email) {
            submitNotification(email);
        }
    };

    return (
        <>
            <button
                onClick={handleNotifyMe}
                disabled={loading}
                className={`bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center ${className}`}
            >
                <FaBell className="mr-2" />
                {loading ? 'Processing...' : 'Notify Me'}
            </button>

            {message && (
                <div className={`mt-2 text-sm text-center ${
                    message.includes('✓') ? 'text-green-600' : 'text-red-600'
                }`}>
                    {message}
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Get Notified</h3>
                        <p className="text-gray-600 mb-4">
                            Enter your email and we'll notify you when this item is back in stock.
                        </p>
                        
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? 'Processing...' : 'Notify Me'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default NotifyMeButton;
