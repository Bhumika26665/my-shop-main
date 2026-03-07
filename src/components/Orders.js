import React, { useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import { FixedSizeList as List } from 'react-window';
import jsPDF from 'jspdf';
import axiosInstance from '../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaBox, FaUser, FaPhone, FaMapMarkerAlt, FaCalendar, FaRupeeSign, FaTrash, FaDownload, FaEye, FaEdit } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

// Safe toast function to prevent undefined errors
const safeToast = {
    success: (message) => {
        try {
            toast?.success?.(message);
        } catch (error) {
            console.log('Toast success:', message);
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

const Orders = () => {
    const { user } = useAuth();
    const { data: orders, error, loading, fetchData } = useFetchData('/orders');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [editingStatus, setEditingStatus] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axiosInstance.put(`/orders/${orderId}/status`, { status });
            fetchData();
            safeToast.success('Order status updated successfully!', {
                position: "top-right",
            });
            setEditingStatus(null);
            setNewStatus('');
        } catch (error) {
            console.error('Error updating order status:', error);
            safeToast.error('Error updating order status. Please try again.', {
                position: "top-right",
            });
        }
    };

    const startEditingStatus = (order) => {
        setEditingStatus(order._id);
        setNewStatus(order.status);
    };

    const cancelEditingStatus = () => {
        setEditingStatus(null);
        setNewStatus('');
    };

    const saveOrderStatus = (orderId) => {
        if (newStatus && newStatus !== orders.find(o => o._id === orderId)?.status) {
            updateOrderStatus(orderId, newStatus);
        } else {
            cancelEditingStatus();
        }
    };

    const downloadOrderAsBill = (order) => {
        const doc = new jsPDF();
        
        // Add brand logo (using text-based logo since we can't use images directly in jsPDF)
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(25, 118, 210); // Blue color for brand
        doc.text('BHUMIKA', 105, 25, { align: 'center' });
        
        doc.setFontSize(18);
        doc.setTextColor(107, 114, 128); // Gray color
        doc.text('SHOP', 105, 35, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99); // Dark gray
        doc.text('Fashion & Lifestyle Store', 105, 42, { align: 'center' });
        doc.text('Bhopal, Madhya Pradesh 462001', 105, 48, { align: 'center' });
        doc.text('Phone: +91 8959305284 | Email: info@bhumikashop.com', 105, 54, { align: 'center' });
        
        // Draw decorative line
        doc.setLineWidth(0.5);
        doc.setDrawColor(25, 118, 210);
        doc.line(20, 60, 190, 60);
        
        // Bill title with background
        doc.setFillColor(25, 118, 210);
        doc.rect(20, 65, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX INVOICE / BILL', 105, 71, { align: 'center' });
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        
        // Order info section
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order ID: ${order._id}`, 20, 85);
        doc.text(`Date: ${formatDate(order.dateOrdered)}`, 150, 85);
        doc.text(`Status: ${order.status}`, 20, 92);
        
        // Customer information section
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 20, 105);
        doc.setFont('helvetica', 'normal');
        doc.text(`Customer ID: ${order.user}`, 20, 112);
        doc.text(`Phone: ${order.phone}`, 20, 118);
        doc.text(`Address: ${order.shippingAddress1}`, 20, 124);
        if (order.shippingAddress2) {
            doc.text(`         ${order.shippingAddress2}`, 20, 130);
        }
        doc.text(`         ${order.city}, ${order.zip}`, 20, 136);
        doc.text(`         ${order.country}`, 20, 142);
        
        // Draw table header with background
        doc.setFillColor(243, 244, 246);
        doc.rect(20, 150, 170, 10, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('S.No', 25, 157);
        doc.text('Product Name', 45, 157);
        doc.text('Qty', 120, 157);
        doc.text('Price', 140, 157);
        doc.text('Total', 170, 157);
        
        // Draw table header line
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 160, 190, 160);
        
        // Table content
        let yPosition = 168;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
            order.orderItems.forEach((item, index) => {
                const productName = item.product?.name || 'Unknown Product';
                const price = item.product?.price || 0;
                const quantity = item.quantity || 1;
                const total = price * quantity;
                
                // Alternate row colors
                if (index % 2 === 0) {
                    doc.setFillColor(249, 250, 251);
                    doc.rect(20, yPosition - 5, 170, 8, 'F');
                }
                
                doc.setTextColor(0, 0, 0);
                doc.text(`${index + 1}`, 25, yPosition);
                doc.text(productName.substring(0, 40), 45, yPosition);
                doc.text(`${quantity}`, 120, yPosition);
                doc.text(formatPrice(price), 140, yPosition);
                doc.text(formatPrice(total), 170, yPosition);
                
                yPosition += 8;
            });
        } else {
            doc.text('No products found', 45, yPosition);
            yPosition += 8;
        }
        
        // Draw bottom line
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 2, 190, yPosition + 2);
        
        // Total section with background
        yPosition += 10;
        doc.setFillColor(243, 244, 246);
        doc.rect(140, yPosition - 5, 50, 10, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('TOTAL:', 145, yPosition);
        doc.text(formatPrice(order.totalPrice), 170, yPosition);
        
        // Payment and terms section
        yPosition += 20;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text('Payment Method: Cash on Delivery', 20, yPosition);
        doc.text('Terms & Conditions:', 20, yPosition + 6);
        doc.text('1. Goods once sold will not be taken back', 20, yPosition + 11);
        doc.text('2. This is a computer generated invoice', 20, yPosition + 16);
        
        // Footer section
        yPosition += 30;
        doc.setLineWidth(0.5);
        doc.setDrawColor(25, 118, 210);
        doc.line(20, yPosition, 190, yPosition);
        
        doc.setFontSize(10);
        doc.setTextColor(25, 118, 210);
        doc.setFont('helvetica', 'bold');
        doc.text('Thank you for shopping with Bhumika Shop!', 105, yPosition + 8, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text('Visit us again soon! | www.bhumikashop.com', 105, yPosition + 14, { align: 'center' });
        
        // Add page border
        doc.setLineWidth(1);
        doc.setDrawColor(25, 118, 210);
        doc.rect(10, 10, 190, 277);
        
        doc.save(`Bill_${order._id}.pdf`);
    };

    const deleteOrder = async (orderId) => {
        try {
            await axiosInstance.delete(`/orders/${orderId}`);
            fetchData();
            safeToast.success('Order deleted successfully!', {
                position: "top-right",
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            safeToast.error('Error deleting the order. Please try again.', {
                position: "top-right",
            });
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const closeOrderDetails = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-500">
                <FaBox className="text-6xl mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">Error Loading Orders</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaShoppingCart className="text-blue-600 text-3xl mr-4" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                                <p className="text-gray-600 mt-1">Manage and track customer orders</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="text-center py-16">
                            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
                            <p className="text-gray-500">There are no orders to display.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{order._id.substring(-8)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {order.orderItems?.length || 0} items
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaUser className="text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm text-gray-900">{order.phone}</div>
                                                        <div className="text-xs text-gray-500">{order.city}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <FaCalendar className="text-gray-400 mr-2" />
                                                    {formatDate(order.dateOrdered)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm font-semibold text-gray-900">
                                                    <FaRupeeSign className="text-gray-400 mr-1" />
                                                    {order.totalPrice?.toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingStatus === order._id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <select
                                                            value={newStatus}
                                                            onChange={(e) => setNewStatus(e.target.value)}
                                                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                        <button
                                                            onClick={() => saveOrderStatus(order._id)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Save"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingStatus}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Cancel"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                        <button
                                                            onClick={() => startEditingStatus(order)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                            title="Edit Status"
                                                        >
                                                            <FaEdit className="text-xs" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => viewOrderDetails(order)}
                                                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => downloadOrderAsBill(order)}
                                                        className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50"
                                                        title="Download Bill"
                                                    >
                                                        <FaDownload />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteOrder(order._id)}
                                                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                                        title="Delete Order"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                                <button
                                    onClick={closeOrderDetails}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Order Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Order ID:</span>
                                            <p className="font-medium">{selectedOrder._id}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Status:</span>
                                            <p className="font-medium">{selectedOrder.status}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Date:</span>
                                            <p className="font-medium">{formatDate(selectedOrder.dateOrdered)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Total:</span>
                                            <p className="font-medium">{formatPrice(selectedOrder.totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <FaPhone className="text-gray-400 mr-2" />
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2 font-medium">{selectedOrder.phone}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                                            <span className="text-gray-600">Address:</span>
                                            <span className="ml-2 font-medium">
                                                {selectedOrder.shippingAddress1}, {selectedOrder.city}, {selectedOrder.zip}, {selectedOrder.country}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.orderItems?.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <div>
                                                    <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{formatPrice(item.product?.price || 0)}</p>
                                                    <p className="text-gray-600">Total: {formatPrice((item.product?.price || 0) * item.quantity)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => downloadOrderAsBill(selectedOrder)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    <FaDownload className="inline mr-2" />
                                    Download Bill
                                </button>
                                <button
                                    onClick={closeOrderDetails}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
