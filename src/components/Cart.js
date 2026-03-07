// src/components/Cart.js
import React from 'react';
import { useCart } from '../context/CartContext';
import ShippingDetails from './ShippingDetails';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaTruck, FaTag, FaLock, FaHeart } from 'react-icons/fa';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, shippingCost, totalWithShipping, placeOrder } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const handleQuantityChange = (uniqueKey, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(uniqueKey, newQuantity);
    };

    const getItemTotal = (item) => {
        const price = item.quantity >= item.quantity_threshold ? item.discounted_price : item.price;
        return price * item.quantity;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                        <div className="bg-pink-100 p-3 rounded-full">
                            <FaShoppingBag className="text-pink-500 text-2xl" />
                        </div>
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
                
                {/* Debug: Log cart items to see structure */}
                {console.log('Cart items:', cart)}
                
                {cart.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="bg-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaShoppingBag className="text-pink-400 text-4xl" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any fashion items yet</p>
                            <button
                                onClick={() => window.location.href = '/products'}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item, index) => {
                                // Debug: Log each item structure
                                console.log('Rendering cart item:', item);
                                console.log('selectedColor:', item.selectedColor);
                                console.log('selectedSize:', item.selectedSize);
                                
                                return (
                                <div key={item.uniqueKey} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                                    <div className="flex flex-col md:flex-row gap-6 p-6">
                                        {/* Product Image */}
                                        <div className="w-full md:w-32 h-32 flex-shrink-0">
                                            <div className="relative group">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors">
                                                        <FaHeart className="text-pink-500 text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                    {item.selectedSize && (
                                                        <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                                                            Size: {item.selectedSize}
                                                        </span>
                                                    )}
                                                    {item.selectedColor && (
                                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                                            <span className="text-xs text-gray-600">Color:</span>
                                                            <div 
                                                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                                                style={{ 
                                                                    backgroundColor: item.selectedColor.value || 
                                                                                    item.selectedColor.hex || 
                                                                                    '#6B7280' 
                                                                }}
                                                            />
                                                            <span className="text-xs font-medium text-gray-700">
                                                                {item.selectedColor.name || 
                                                                 (typeof item.selectedColor === 'string' ? item.selectedColor : 'Unknown')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price and Quantity */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-gray-100 rounded-full border border-gray-200">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.uniqueKey, item.quantity - 1)}
                                                            className="p-2 hover:bg-pink-100 hover:text-pink-600 rounded-full transition-all duration-200"
                                                        >
                                                            <FaMinus className="text-sm" />
                                                        </button>
                                                        <span className="px-4 py-2 min-w-[3rem] text-center font-bold text-gray-800">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.uniqueKey, item.quantity + 1)}
                                                            className="p-2 hover:bg-pink-100 hover:text-pink-600 rounded-full transition-all duration-200"
                                                        >
                                                            <FaPlus className="text-sm" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500 mb-1">
                                                        {formatPrice(item.quantity >= item.quantity_threshold ? item.discounted_price : item.price)} each
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-800">
                                                        {formatPrice(getItemTotal(item))}
                                                    </div>
                                                    {item.quantity >= item.quantity_threshold && (
                                                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mt-2">
                                                            <span>🎉</span>
                                                            Discount Applied!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.uniqueKey)}
                                                className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 self-start"
                                            >
                                                <FaTrash className="text-sm" />
                                                <span className="font-medium">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaTag className="text-pink-500" />
                                    Order Summary
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                                        <span className="font-medium text-gray-800">{formatPrice(totalPrice)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <FaTruck className="text-xs" />
                                            Shipping
                                        </span>
                                        <span className={`font-bold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    
                                    {shippingCost === 0 && (
                                        <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                                            🎉 Free shipping applied! You saved {formatPrice(50)}
                                        </div>
                                    )}
                                    
                                    {shippingCost > 0 && (
                                        <div className="bg-pink-50 text-pink-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                                            Add {formatPrice(999 - totalPrice)} more for free shipping!
                                        </div>
                                    )}
                                    
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-800">Total</span>
                                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                                {formatPrice(totalWithShipping)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaTag className="text-pink-500" />
                                    Promo Code
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter promo code"
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <ShippingDetails />

                            {/* Place Order Button */}
                            <button
                                onClick={placeOrder}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                            >
                                <FaShoppingBag />
                                Place Order
                            </button>

                            {/* Security Badge */}
                            <div className="text-center text-xs text-gray-500 mt-4">
                                <div className="flex items-center justify-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                                    <FaLock className="text-green-500" />
                                    <span className="text-green-700 font-medium">Secure Checkout • SSL Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
