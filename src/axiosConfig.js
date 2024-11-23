// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://bhumika-eshop-backend.onrender.com/api/v1', // Update with your API URL
});

export default instance;
