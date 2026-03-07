import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = ({ setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                setLoading(true);
                const [categoriesResponse, productsResponse] = await Promise.all([
                    axios.get('/categories'),
                    axios.get('/products')
                ]);
                
                setCategories(categoriesResponse.data);
                setAllProducts(productsResponse.data);
            } catch (error) {
                console.error('Error fetching categories or products', error);
                toast.error('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory?.(categoryId);
        setSelectedCategoryId(categoryId);
    
        const filtered = allProducts.filter(product => {
            console.log(`Product Category ID: ${product.category?.id}, Selected Category ID: ${categoryId}`);
            return product.category?.id === categoryId;
        });
    
        setFilteredProducts(filtered);
    };

    const handleQuantityChange = (productId, quantity) => {
        setQuantities(prev => ({ ...prev, [productId]: quantity }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1;
        const finalPrice = quantity >= product.quantity_threshold ? product.discounted_price : product.price;

        addToCart({ ...product, quantity, price: finalPrice });
        toast.success(`${product.name} added to cart with quantity ${quantity}!`);
    };

    // Fallback images for categories
    const getCategoryImage = (category) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL  || 'http://localhost:3001';
        
        if (category.image) {
            // If image starts with /uploads, it's a relative path, prepend backend URL
            if (category.image.startsWith('/uploads/')) {
                return `${backendUrl}${category.image}`;
            }
            // If it's already a full URL, return as is
            if (category.image.startsWith('http')) {
                return category.image;
            }
            // Otherwise, treat it as a relative path
            return `${backendUrl}/${category.image}`;
        }
        
        // Generate placeholder image based on category name
        const categoryColors = {
            'saree': 'https://images.unsplash.com/photo-1610035408482-a8d6c5dc0c5c?w=400&h=300&fit=crop',
            'salwar': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
            'lehenga': 'https://images.unsplash.com/photo-1615634255158-fa5c8fd8c4d0?w=400&h=300&fit=crop',
            'kurti': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
            'western': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            'accessories': 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400&h=300&fit=crop'
        };
        
        const categoryName = category.name.toLowerCase();
        for (const [key, url] of Object.entries(categoryColors)) {
            if (categoryName.includes(key)) {
                return url;
            }
        }
        
        // Default placeholder
        return `https://picsum.photos/seed/${category.name}/400/300.jpg`;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                            selectedCategoryId === category._id ? 'ring-4 ring-purple-500 rounded-xl' : ''
                        }`}
                        onClick={() => handleCategoryClick(category._id)}
                    >
                        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            {/* Category Image */}
                            <div className="aspect-w-16 aspect-h-12">
                                <img
                                    src={getCategoryImage(category)}
                                    alt={category.name}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                            {/* Category Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-200">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                                )}
                                
                                {/* Category Badge */}
                                <div className="mt-3">
                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                            
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Products in Selected Category */}
            {filteredProducts.length > 0 && (
                <div className="mt-12">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                            Products in Selected Category
                        </h3>
                        <p className="text-gray-600">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                                <Link to={`/product/${product.id}`}>
                                    <div className="relative overflow-hidden">
                                        <img
                                            className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                        />
                                        {/* Product Badge */}
                                        {product.isFeatured && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Featured
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                
                                <div className="p-4">
                                    <Link to={`/product/${product.id}`} className="block">
                                        <h4 className="font-semibold text-gray-800 mb-2 hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                                            {product.name}
                                        </h4>
                                    </Link>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                                        {product.discounted_price && product.discounted_price < product.price && (
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400 line-through">₹{product.price}</p>
                                                <p className="text-sm font-bold text-red-600">₹{product.discounted_price}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-gray-700">Qty:</label>
                                            <select
                                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                defaultValue="1"
                                            >
                                                {[...Array(Math.min(product.countInStock, 10))].map((_, q) => (
                                                    <option key={q + 1} value={q + 1}>{q + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {filteredProducts.length === 0 && selectedCategoryId && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No products available in this category.</p>
                    <p className="text-gray-400 text-sm mt-2">Try selecting a different category or check back later.</p>
                </div>
            )}
            
            <ToastContainer position="bottom-right" theme="colored" />
        </div>
    );
};

export default CategoryList;
