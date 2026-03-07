import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';

const ClothingFilters = ({ onFiltersChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        size: '',
        color: '',
        priceRange: '',
        brand: '',
        sortBy: 'newest'
    });

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Fetching categories from backend...');
                const response = await axiosInstance.get('/categories');
                console.log('Categories response:', response.data);
                
                // Extract category names from the response
                const categoryNames = response.data.map(cat => cat.name);
                console.log('Extracted category names:', categoryNames);
                setCategories(categoryNames);
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to hardcoded categories if API fails
                setCategories([
                    'Sarees', 'Salwar Kameez', 'Lehengas', 'Kurtis', 
                    'Dresses', 'Tops', 'Bottoms', 'Dupattas',
                    'Jewelry', 'Accessories', 'Footwear'
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch unique brands and sizes from products
    useEffect(() => {
        const fetchProductAttributes = async () => {
            try {
                console.log('Fetching product attributes...');
                const response = await axiosInstance.get('/products');
                const products = response.data;
                
                // Extract unique brands
                const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
                console.log('Unique brands:', uniqueBrands);
                
                // Extract unique sizes
                const uniqueSizes = [...new Set(products.flatMap(p => p.availableSizes || []))];
                console.log('Unique sizes:', uniqueSizes);
                
                // Update state if we have dynamic data
                if (uniqueBrands.length > 0) {
                    setBrands(uniqueBrands);
                }
                if (uniqueSizes.length > 0) {
                    setSizes(uniqueSizes);
                }
            } catch (error) {
                console.error('Error fetching product attributes:', error);
                // Keep fallback values
            }
        };

        fetchProductAttributes();
    }, []);

    const [sizes, setSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL']);
    const [brands, setBrands] = useState([
        'Bhumika Fashion', 'Fab India', 'Biba', 'Libas', 
        'W for Woman', 'Global Desi', 'Anouk', 'Ritu Kumar'
    ]);
    
    const colors = [
        { name: 'Red', value: 'red' },
        { name: 'Blue', value: 'blue' },
        { name: 'Green', value: 'green' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Pink', value: 'pink' },
        { name: 'Purple', value: 'purple' },
        { name: 'Black', value: 'black' },
        { name: 'White', value: 'white' },
        { name: 'Brown', value: 'brown' },
        { name: 'Gray', value: 'gray' },
        { name: 'Orange', value: 'orange' },
        { name: 'Navy', value: 'navy' }
    ];

    const priceRanges = [
        { label: 'Under ₹500', value: '0-500' },
        { label: '₹500 - ₹1000', value: '500-1000' },
        { label: '₹1000 - ₹2000', value: '1000-2000' },
        { label: '₹2000 - ₹5000', value: '2000-5000' },
        { label: 'Above ₹5000', value: '5000+' }
    ];

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-low' },
        { label: 'Price: High to Low', value: 'price-high' },
        { label: 'Best Rating', value: 'rating' },
        { label: 'Most Popular', value: 'popular' }
    ];

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            category: '',
            size: '',
            color: '',
            priceRange: '',
            brand: '',
            sortBy: 'newest'
        };
        setFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'newest');

    return (
        <div className="relative">
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:border-pink-500 transition-colors"
            >
                <FaFilter className="text-gray-600" />
                <span className="text-gray-700">Filters</span>
                {hasActiveFilters && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        {Object.values(filters).filter(value => value !== '' && value !== 'newest').length}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-h-96 overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Filter Products</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            {loading ? (
                                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500 mr-2"></div>
                                        <span className="text-gray-500 text-sm">Loading categories...</span>
                                    </div>
                                </div>
                            ) : (
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Size Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                                        className={`px-3 py-1 text-sm border rounded transition-colors ${
                                            filters.size === size 
                                                ? 'bg-pink-500 text-white border-pink-500' 
                                                : 'border-gray-300 hover:border-pink-500 hover:text-pink-600'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <div className="grid grid-cols-6 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => handleFilterChange('color', filters.color === color.value ? '' : color.value)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                                            filters.color === color.value 
                                                ? 'border-pink-500 ring-2 ring-pink-200' 
                                                : 'border-gray-300 hover:border-pink-500'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                            <select
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                            <select
                                value={filters.priceRange}
                                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">All Prices</option>
                                {priceRanges.map((range) => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={clearFilters}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClothingFilters;
