// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const ProductDetails = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                setProduct(response.data);
                setError(null);
            } catch (error) {
                setError('Error fetching product details');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    return (
        <div className="p-10 bg-white min-h-screen">
            {loading && <p>Loading product details...</p>}
            {error && <p>{error}</p>}
            {product && (
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product.name}</h1>
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
                    <p className="text-lg text-gray-700 mb-2">Price: ${product.price}</p>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-gray-800 font-semibold">Category: {product.category?.name || 'No Category'}</p>
                    <p className="text-gray-800 font-semibold">Brand: {product.brand}</p>
                    <p className="text-gray-800 font-semibold">Count in Stock: {product.countInStock}</p>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
