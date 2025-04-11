import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                setProduct(response.data);
                setError(null);

                const relatedResponse = await axios.get(`/products?category=${response.data.category.id}`);
                const filteredProducts = relatedResponse.data.filter(
                    (item) => item.category._id === response.data.category._id && item._id !== id
                );
                setRelatedProducts(filteredProducts);
            } catch (error) {
                setError('Error fetching product details');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (productId, quantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: quantity,
        }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product._id] || 1;

        let finalPrice = product.price;
        if (quantity >= product.quantity_threshold) {
            finalPrice = product.discounted_price;
        }

        const productToAdd = {
            ...product,
            quantity,
            price: finalPrice,
        };

        addToCart(productToAdd);
        toast.success(`${product.name} added to cart with quantity ${quantity}!`, { autoClose: 2000 });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            {loading && <p className="text-center mt-10 text-gray-500">Loading product details...</p>}
            {error && <p className="text-red-500 text-center mt-10">{error}</p>}
            
            {product && (
                <motion.div
                    className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Left: Product Image and Gallery */}
                    <div className="flex flex-col items-center">
                        <LazyLoadImage
                            src={product.image}
                            alt={product.name}
                            placeholderSrc="/placeholder.jpg"
                            className="w-full h-96 object-cover rounded-lg mb-6"
                            effect="blur"
                        />
                        <div className="flex gap-2 flex-wrap justify-center">
                            {product.galleryImages?.map((img, index) => (
                                <LazyLoadImage
                                    key={index}
                                    src={img}
                                    alt={`${product.name} thumbnail ${index}`}
                                    placeholderSrc="/placeholder.jpg"
                                    className="w-16 h-16 object-cover rounded-md"
                                    effect="blur"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">{product.name}</h1>
                        <p className="text-2xl font-semibold text-green-600 mb-2">
                            ₹{product.price}
                            {product.discount && (
                                <span className="ml-2 text-red-600 line-through">
                                    ₹{product.originalPrice}
                                </span>
                            )}
                        </p>
                        {product.discount && (
                            <p className="text-green-500 font-semibold">
                                Save ₹{product.discount} ({product.discountPercentage}% off)
                            </p>
                        )}
                        <p className="text-gray-600 mb-4">{product.description}</p>

                        {/* Quantity Selector */}
                        <input
                            type="number"
                            min="1"
                            value={quantities[product._id] || 1}
                            onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                            className="border rounded px-2 py-1 w-20"
                        />

                        <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                        >
                            Add to Cart
                        </button>

                        <div className="border-t pt-4 mt-4 space-y-1">
                            <p className="text-gray-800 font-semibold">Brand: {product.brand}</p>
                            <p className="text-gray-800 font-semibold">Category: {product.category?.name || 'No Category'}</p>
                            <p className="text-gray-800 font-semibold">Stock: {product.countInStock}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-10 max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Related Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                key={relatedProduct._id}
                                to={`/product/${relatedProduct._id}`}
                                className="bg-white shadow rounded p-4 hover:shadow-md transition"
                            >
                                <LazyLoadImage
                                    src={relatedProduct.image}
                                    alt={relatedProduct.name}
                                    placeholderSrc="/placeholder.jpg"
                                    className="w-full h-40 object-cover rounded mb-2"
                                    effect="blur"
                                />
                                <h3 className="text-lg font-semibold">{relatedProduct.name}</h3>
                                <p className="text-gray-700">₹{relatedProduct.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
            <ToastContainer />
        </div>
    );
};

export default ProductDetails;
