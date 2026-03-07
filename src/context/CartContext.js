import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import CookieService from '../services/cookieService';

const CartContext = createContext();

// Helper functions for localStorage
const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem('bhumika-shop-cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('bhumika-shop-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage on component mount
    const [cart, setCart] = useState(() => loadCartFromLocalStorage());
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        saveCartToLocalStorage(cart);
    }, [cart]);
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
        // Create a unique key for the product combination (ID + size + color)
        const colorName = product.selectedColor && typeof product.selectedColor === 'object' 
            ? product.selectedColor.name 
            : product.selectedColor || 'default';
            
        const uniqueKey = `${product._id}_${product.selectedSize || 'default'}_${colorName}`;
        
        const existingProduct = cart.find(item => {
            const itemColorName = item.selectedColor && typeof item.selectedColor === 'object' 
                ? item.selectedColor.name 
                : item.selectedColor || 'default';
            const itemKey = `${item._id}_${item.selectedSize || 'default'}_${itemColorName}`;
            return itemKey === uniqueKey;
        });
    
        if (existingProduct) {
            setCart(cart.map(item => {
                const itemColorName = item.selectedColor && typeof item.selectedColor === 'object' 
                    ? item.selectedColor.name 
                    : item.selectedColor || 'default';
                const itemKey = `${item._id}_${item.selectedSize || 'default'}_${itemColorName}`;
                return itemKey === uniqueKey
                    ? { ...item, quantity: item.quantity + product.quantity }
                    : item;
            }));
        } else {
            setCart([...cart, { ...product, uniqueKey }]); // Add product with unique identifier
        }
    };
    
    const removeFromCart = (uniqueKey) => {
        setCart((prevCart) => prevCart.filter(item => item.uniqueKey !== uniqueKey));
    };

    const updateQuantity = (uniqueKey, newQuantity) => {
        if (newQuantity < 1) return;
        setCart((prevCart) =>
            prevCart.map(item =>
                item.uniqueKey === uniqueKey
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    const clearCart = () => {
        setCart([]);
        // Clear cart from localStorage
        localStorage.removeItem('bhumika-shop-cart');
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

    const calculateShippingCost = () => {
        const totalPrice = calculateTotalPrice();
        return totalPrice >= 999 ? 0 : 50; // Free shipping above ₹999, otherwise ₹50
    };

    const calculateTotalWithShipping = () => {
        return calculateTotalPrice() + calculateShippingCost();
    };

    const placeOrder = async () => {
        if (!validateShippingDetails()) {
            alert('Please fill in all required shipping details.');
            return;
        }

        const token = CookieService.getAccessToken();
        if (!token) {
            alert('Please login to place an order.');
            return;
        }

        const user = CookieService.getUser();
        if (!user || !user.id) {
            alert('User information not found. Please login again.');
            return;
        }

        const totalPrice = calculateTotalPrice();

        const orderData = {
            orderItems: cart.map(item => ({
                quantity: item.quantity || 1,
                product: item._id,
                selectedSize: item.selectedSize || 'One Size',
                selectedColor: item.selectedColor ? {
                    name: item.selectedColor.name,
                    value: item.selectedColor.value
                } : null
            })),
            shippingAddress1: shippingDetails.shippingAddress1,
            shippingAddress2: shippingDetails.shippingAddress2,
            city: shippingDetails.city,
            zip: shippingDetails.zip,
            country: shippingDetails.country,
            phone: shippingDetails.phone,
            totalPrice: totalPrice,
            user: user.id,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'https://bhumika-eshop-backend.onrender.com/api/v1'}/orders`, orderData);

            if (response.data) {
                alert('Order placed successfully!');
                clearCart();
                // Reset shipping details
                setShippingDetails({
                    shippingAddress1: '',
                    shippingAddress2: '',
                    city: '',
                    zip: '',
                    country: '',
                    phone: ''
                });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to place order. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartCount,
            totalPrice: calculateTotalPrice(),
            shippingCost: calculateShippingCost(),
            totalWithShipping: calculateTotalWithShipping(),
            placeOrder,
            shippingDetails,
            setShippingDetails,
            pickupDetails,
            setPickupDetails
        }}>
            {children}
        </CartContext.Provider>
    );
};
