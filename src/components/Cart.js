// src/components/Cart.js
import React from 'react';
import { useCart } from '../context/CartContext';
import ShippingDetails from './ShippingDetails';

const Cart = () => {
    const { cart, removeFromCart, totalPrice, placeOrder } = useCart();

    // Function to go back to the previous page
    const handleBackClick = () => {
        window.history.back();
    };

    return (
        <div className="p-10 bg-white min-h-screen">
            {/* Back Button */}
            <button
                onClick={handleBackClick}
                className="bg-transparent text-gray-700 hover:text-gray-900 border border-gray-300 rounded-full py-2 px-4 mb-6 flex items-center transition-colors duration-200 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a1 1 0 01-1-1V4a1 1 0 112 0v13a1 1 0 01-1 1z" />
                    <path fillRule="evenodd" d="M5 10a1 1 0 01.707-.293L9 12.586V4a1 1 0 112 0v8.586l3.293-3.879A1 1 0 0115 10l-5 5a1 1 0 01-1.414 0l-5-5z" />
                </svg>
                Back
            </button>

            <h1 className="text-4xl font-semibold mb-6 text-gray-800">Your Cart</h1>
            
            {cart.length === 0 ? (
                <p className="text-xl text-gray-500">Your cart is empty</p>
            ) : (
                <>
                    <ul>
                        {cart.map(item => (
                            <li key={item._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm mb-4 hover:bg-gray-100 transition-colors duration-200">
                                <span className="text-lg text-gray-700">
                                    {item.name} {item.price} x {item.quantity}
                                    {item.quantity >= item.quantity_threshold && (
                                        <span className="text-green-600 font-semibold"> (Discount Applied)</span>
                                    )}
                                </span>
                                <span className="text-xl font-semibold text-gray-800">
                                    ₹
                                    {(item.quantity >= item.quantity_threshold
                                        ? item.discounted_price * item.quantity
                                        : item.price * item.quantity
                                    ).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-lg font-bold mt-4 text-gray-800">Total Price: ₹{totalPrice.toFixed(2)}</h2>

                    <ShippingDetails />

                    <button
                        onClick={placeOrder}
                        className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 mt-4"
                    >
                        Cash on Delivery
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;
