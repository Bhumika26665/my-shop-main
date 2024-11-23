import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // State to track selected order

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);

    // Function to handle selecting an order
    const handleOrderClick = (order) => {
        if (selectedOrder && selectedOrder._id === order._id) {
            setSelectedOrder(null); // Deselect order if the same one is clicked again
        } else {
            setSelectedOrder(order); // Select the clicked order
        }
    };

    return (
        <>
        <div className="min-h-screen bg-gray-100 py-10">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Order List</h2>
            <ul className="max-w-4xl mx-auto">
                {orders.map(order => (
                    <li key={order._id} className="bg-white shadow-md p-6 mb-4 rounded-md">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => handleOrderClick(order)}>
                            <div>
                                <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
                                <p className="text-gray-600">City: {order.city}</p>
                                <p className="text-gray-600">Status: {order.status}</p>
                                <p className="text-gray-600">Total Price: ${order.totalPrice?.toFixed(2) || '0.00'}</p> {/* Handle missing totalPrice */}
                                <p className="text-gray-600">Shipping: {order.shippingAddress1}, {order.city}, {order.country}</p>
                            </div>
                        </div>

                        {/* Conditionally render the order details */}
                        {selectedOrder && selectedOrder._id === order._id && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <h4 className="text-lg font-bold mb-2">Order Details</h4>
                                <ul className="mb-4">
                                    {/* Check if products exist and is an array before mapping */}
                                    {Array.isArray(selectedOrder.orderItems) && selectedOrder.orderItems.length > 0 ? (
                                        selectedOrder.orderItems.map(product => (
                                            <li key={product.product} className="flex justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold">Product:{product.name}</p>
                                                    <p>Quantity: {product.quantity}</p>
                                                </div>
                                                <div>
                                                    <p>Price: ₹{product.price}</p>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No products available for this order.</p>
                                    )}
                                </ul>
                                <p className="font-bold">Total Price: ₹{selectedOrder.totalPrice?.toFixed(2) || '0.00'}</p> {/* Handle missing totalPrice */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default Orders;
