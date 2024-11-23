// src/api.js
import axios from 'axios';

const API_URL = 'https://bhumika-eshop-backend.onrender.com/api/v1'; // Update based on your backend URL

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
export const deleteProducts = () => {
    return axios.delete(`${API_URL}/products/`);
};
export const loginUser = (credentials) => { 
    return axios.post(`${API_URL}/users/login`, credentials, {
        headers: {
            'Content-Type': 'application/json'  // Ensure content type is set
        }
    });
};

// Add more API functions as needed
