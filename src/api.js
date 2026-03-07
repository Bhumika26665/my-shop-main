// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'https://bhumika-eshop-backend.onrender.com/api/v1';

export const fetchCategories = () => {
    return axios.get(`${API_URL}/categories`);
};

export const fetchProducts = () => {
    return axios.get(`${API_URL}/products`);
};

export const fetchUsers = () => {
    return axios.get(`${API_URL}/users`);
};

export const fetchOrders = () => {
    return axios.get(`${API_URL}/orders`);
};

export const deleteProduct = (productId) => {
    return axios.delete(`${API_URL}/products/${productId}`);
};

export const loginUser = (credentials) => { 
    return axios.post(`${API_URL}/users/login`, credentials, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const createProduct = (productData, token) => {
    return axios.post(`${API_URL}/products`, productData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const updateProduct = (productId, productData, token) => {
    return axios.put(`${API_URL}/products/${productId}`, productData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const createOrder = (orderData, token) => {
    return axios.post(`${API_URL}/orders`, orderData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};
