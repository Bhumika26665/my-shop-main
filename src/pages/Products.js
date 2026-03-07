// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';
import ClothingFilters from '../components/ClothingFilters';
import { FaThList } from 'react-icons/fa';

const Products = ({ searchTerm }) => {
    const [filters, setFilters] = useState({
        category: '',
        size: '',
        color: '',
        priceRange: '',
        brand: '',
        sortBy: 'newest'
    });

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            🛍️ Our Fashion Collection
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {searchTerm 
                                ? `Search results for "${searchTerm}"`
                                : 'Discover our complete range of ethnic and contemporary fashion'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Products Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <ClothingFilters onFiltersChange={handleFiltersChange} />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Active Filters Display */}
                        <div className="mb-6 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {Object.entries(filters).map(([key, value]) => {
                                if (value && value !== 'newest') {
                                    return (
                                        <span 
                                            key={key}
                                            className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full"
                                        >
                                            {key}: {value}
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Results Count */}
                        <div className="mb-6 text-center">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-pink-600">Fashion Collection</span>
                                {searchTerm && <span> for "{searchTerm}"</span>}
                            </p>
                        </div>

                        <ProductList filters={filters} searchTerm={searchTerm} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Products;

