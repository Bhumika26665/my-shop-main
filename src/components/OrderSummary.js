import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const OrderSummary = () => {
    const [ordersToday, setOrdersToday] = useState(0);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/orders/today');
                setOrdersToday(response.data.count);
            } catch (error) {
                console.error('Error fetching orders summary', error);
            }
        };
        
        fetchOrders();
    }, []);

    return (
        <div className="bg-white shadow-md p-6 rounded-md">
            <h2 className="text-xl font-semibold">Orders Today</h2>
            <p className="text-3xl">{ordersToday}</p>
        </div>
    );
};

export default OrderSummary;
