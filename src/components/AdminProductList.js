import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';

const AdminProductList = ({ products, fetchProducts, setEditProduct }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStock, setFilterStock] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Get unique categories for filter
    const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

    // Filter and sort products
    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || product.category?.name === filterCategory;
            const matchesStock = filterStock === 'all' ||
                               (filterStock === 'inStock' && product.countInStock > 0) ||
                               (filterStock === 'outOfStock' && product.countInStock === 0) ||
                               (filterStock === 'lowStock' && product.countInStock > 0 && product.countInStock < 5);
            
            return matchesSearch && matchesCategory && matchesStock;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'category') {
                aValue = a.category?.name || '';
                bValue = b.category?.name || '';
            }
            
            if (typeof aValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        setLoading(true);
        try {
            await axiosInstance.delete(`/products/${productId}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeaturedToggle = async (product) => {
        try {
            await axiosInstance.put(`/products/${product._id}`, { isFeatured: !product.isFeatured });
            fetchProducts();
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;
        
        setLoading(true);
        try {
            await Promise.all(selectedProducts.map(id => axiosInstance.delete(`/products/${id}`)));
            setSelectedProducts([]);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === filteredAndSortedProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredAndSortedProducts.map(p => p._id));
        }
    };

    const getStockStatus = (countInStock) => {
        if (countInStock === 0) return { text: 'Out of Stock', color: 'red' };
        if (countInStock < 5) return { text: 'Low Stock', color: 'yellow' };
        return { text: 'In Stock', color: 'green' };
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">📦 Product Management</h2>
                    <div className="text-white">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {filteredAndSortedProducts.length} products
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products by name or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={filterStock}
                        onChange={(e) => setFilterStock(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Stock</option>
                        <option value="inStock">In Stock</option>
                        <option value="lowStock">Low Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="price">Sort by Price</option>
                        <option value="countInStock">Sort by Stock</option>
                        <option value="category">Sort by Category</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-700 font-medium">
                            {selectedProducts.length} products selected
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.length === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedProducts.map((product) => {
                            const stockStatus = getStockStatus(product.countInStock);
                            return (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts([...selectedProducts, product._id]);
                                                } else {
                                                    setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.brand}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</div>
                                            {product.discounted_price && product.discounted_price < product.price && (
                                                <div className="text-sm text-green-600">₹{product.discounted_price.toFixed(2)}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                            {product.category?.name || 'No Category'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 text-xs rounded-full bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                                                {stockStatus.text}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-600">({product.countInStock})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleFeaturedToggle(product)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                product.isFeatured ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    product.isFeatured ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditProduct(product._id)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredAndSortedProducts.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductList;
