import React, { useState } from 'react';
import useFetchData from '../hooks/useFetchData'; // Custom hook for API calls
import { FixedSizeList as List } from 'react-window'; // React window for performance
import jsPDF from 'jspdf';
import axiosInstance from '../axiosConfig'; // Make sure axios instance is correctly configured
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

const Orders = () => {
    const { data: orders, error, loading, fetchData } = useFetchData('/orders', localStorage.getItem('token'));
    const [selectedOrder, setSelectedOrder] = useState(null);

    const downloadOrderDetailsAsPDF = (order) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Order Details', 10, 10);
        doc.setFontSize(14);
        doc.text(`Order ID: ${order._id}`, 10, 20);
        doc.text(`City: ${order.city}`, 10, 30);
        doc.text(`Status: ${order.status}`, 10, 40);
        doc.text(`Phone No: ${order.phone}`, 10, 50);
        doc.text(`Total Price: ${order.totalPrice?.toFixed(2) || '0.00'} Rs.`, 10, 60);
        doc.text(`Shipping Address: ${order.shippingAddress1}, ${order.city}, ${order.country}`, 10, 70);

        doc.setFontSize(16);
        doc.text('Products:', 10, 90);
        if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
            order.orderItems.forEach((item, index) => {
                doc.setFontSize(12);
                doc.text(`${index + 1}. Product: ${item.product?.name || 'Unknown'}, Quantity: ${item.quantity}, Price: ${item.product?.price?.toFixed(2) || '0.00'} Rs.`, 10, 100 + index * 10);
            });
        } else {
            doc.text('No products available for this order.', 10, 100);
        }

        doc.save(`Order_${order._id}.pdf`);
    };

    const deleteOrder = async (orderId) => {
        try {
            await axiosInstance.delete(`/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchData(); // Call fetchData to refresh orders

            // Show success notification
            toast.success('Order deleted successfully!', {
                position: "top-right", // Use string for position
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Error deleting the order. Please try again.', {
                position: "top-right", // Use string for position
            });
        }
    };

    if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;

    return (
        <div>
         {/* <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 py-10"> */}
            <ToastContainer /> {/* Add ToastContainer to your component */}
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Admin Order List</h2>
            <div className="max-w-5xl mx-auto">
                <List
                    height={500}
                    itemCount={orders.length}
                    itemSize={160}
                    width="100%"
                >
                    {({ index, style }) => {
                        const order = orders[index];
                        return (
                            <div
                                key={order._id}
                                className={`bg-white shadow-md p-6 mb-4 rounded-lg cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-105`}
                                style={style}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-indigo-600">Order ID: {order._id}</h3>
                                    {/* <p className="text-gray-500">City: {order.city}</p>
                                    <p className="text-gray-500">Status: {order.status}</p>
                                    <p className="text-gray-500">Phone No: {order.phone}</p>
                                    <p className="text-gray-500">Total Price: ₹{order.totalPrice?.toFixed(2) || '0.00'}</p>
                                    <p className="text-gray-500">Shipping: {order.shippingAddress1}, {order.city}, {order.country}</p> */}
                                </div>

                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                                        onClick={() => deleteOrder(order._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                                        onClick={() => downloadOrderDetailsAsPDF(order)}
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                </List>
            </div>
            {/* </div> */}
        </div>

    );
};

export default Orders;
