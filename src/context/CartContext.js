import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [shippingDetails, setShippingDetails] = useState({
        shippingAddress1: '',
        shippingAddress2: '',
        city: '',
        zip: '',
        country: '',
        phone: ''
    });

    // New pickupDetails state
    const [pickupDetails, setPickupDetails] = useState({
        customerName: '',
        storeLocation: '',
        pickupTime: '',
        phone: ''
    });

    const addToCart = (product) => {
        const existingProduct = cart.find(item => item._id === product._id);
    
        if (existingProduct) {
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + product.quantity } // Increment by selected quantity
                    : item
            ));
        } else {
            setCart([...cart, { ...product }]); // Add product with the selected quantity
        }
    };
    
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item._id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const validateShippingDetails = () => {
        const { shippingAddress1, city, zip, country, phone } = shippingDetails;
        if (!shippingAddress1 || !city || !zip || !country || !phone) {
            return false; // Returns false if any required field is missing
        }
        return true;
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const pricePerItem = item.quantity >= item.quantity_threshold ? item.discounted_price : item.price;
            return total + pricePerItem * item.quantity; // Accumulate the total
        }, 0);
    };

    const placeOrder = async () => {
        if (!validateShippingDetails()) {
            alert('Please fill in all required shipping details.');
            return;
        }

        const totalPrice = calculateTotalPrice(); // Recalculate total price for the order

        const orderData = {
            orderItems: cart.map(item => ({
                quantity: item.quantity,
                product: item._id
            })),
            shippingAddress1: shippingDetails.shippingAddress1,
            shippingAddress2: shippingDetails.shippingAddress2,
            city: shippingDetails.city,
            zip: shippingDetails.zip,
            country: shippingDetails.country,
            phone: shippingDetails.phone,
            totalPrice: totalPrice,
            user: 'user_id_here', // Replace with actual user ID
        };

        try {
            await axios.post('https://bhumika-eshop-backend.onrender.com/api/v1/orders', orderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert('Order placed successfully!');
            clearCart();
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalPrice: calculateTotalPrice(), // Ensure this uses the updated logic
            placeOrder,
            shippingDetails,
            setShippingDetails, // Provide method to update shipping details
            pickupDetails, // Provide pickupDetails
            setPickupDetails // Provide method to update pickup details
        }}>
            {children}
        </CartContext.Provider>
    );
};
