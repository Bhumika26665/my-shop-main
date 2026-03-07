// src/components/ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add to cart logic here
        console.log('Added to cart:', product.name);
    };

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={handleFavorite}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-pink-50 transition-colors mb-2"
                    title="Add to Wishlist"
                >
                    <FaHeart className={`text-lg ${isFavorited ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
                <button
                    onClick={handleAddToCart}
                    className="bg-pink-500 p-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
                    title="Quick Add to Cart"
                >
                    <FaShoppingBag className="text-white text-sm" />
                </button>
            </div>

            {/* Product Image */}
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-t-lg">
                <div className="relative">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Size Badge */}
                    {product.availableSizes && (
                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                            {product.availableSizes.length} sizes
                        </div>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discounted_price && product.discounted_price < product.price && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {Math.round(((product.price - product.discounted_price) / product.price) * 100)}% OFF
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                <div className="mb-2">
                    <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                        {product.category?.name || 'Fashion'}
                    </span>
                </div>
                
                <Link 
                    to={`/product/${product.id}`} 
                    className="block text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors mb-2"
                >
                    {product.name}
                </Link>
                
                {/* Price Display */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        {product.discounted_price && product.discounted_price < product.price ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-pink-600">
                                    {formatPrice(product.discounted_price)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-800">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    
                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center text-sm">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-gray-600">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Size Preview */}
                {product.availableSizes && (
                    <div className="flex gap-1 mb-3">
                        {product.availableSizes.slice(0, 4).map((size) => (
                            <span 
                                key={size}
                                className="border border-gray-300 text-xs px-2 py-1 rounded hover:border-pink-500 hover:text-pink-600 transition-colors cursor-pointer"
                            >
                                {size}
                            </span>
                        ))}
                        {product.availableSizes.length > 4 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                                +{product.availableSizes.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Stock Status */}
                <div className="text-sm text-center">
                    {product.countInStock > 0 ? (
                        <span className="text-green-600 font-medium">
                            ✓ In Stock ({product.countInStock} available)
                        </span>
                    ) : (
                        <span className="text-red-600 font-medium">
                            ✗ Out of Stock
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
