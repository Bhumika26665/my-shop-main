// src/components/AdminCategoryList.js
import React from 'react';
import axiosInstance from '../axiosConfig';

const AdminCategoryList = ({ categories, fetchCategories, setEditCategory }) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    
    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                await axiosInstance.delete(`/categories/${categoryId}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error deleting category. Please try again.');
            }
        }
    };

    const handleToggleActive = async (categoryId, currentStatus) => {
        try {
            await axiosInstance.put(`/categories/${categoryId}`, {
                isActive: !currentStatus
            });
            fetchCategories();
        } catch (error) {
            console.error('Error updating category status:', error);
            alert('Error updating category status. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Categories ({categories.length})</h2>
            </div>
            
            {categories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No categories found</p>
                    <p className="text-gray-400 text-sm mt-2">Add your first category to get started</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sort Order
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {/* Category Image */}
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <img
                                                    className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200"
                                                    src={
                                                        category.image 
                                                            ? `${backendUrl}${category.image}`
                                                            : `https://picsum.photos/seed/${category.name}/100/100.jpg`
                                                    }
                                                    alt={category.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                    {category.icon && (
                                                        <span className="ml-2 text-lg">{category.icon}</span>
                                                    )}
                                                </div>
                                                {category.color && (
                                                    <div className="flex items-center mt-1">
                                                        <div 
                                                            className="w-3 h-3 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: category.color }}
                                                        ></div>
                                                        <span className="ml-1 text-xs text-gray-500">{category.color}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                            {category.description || 'No description'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            category.isActive 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {category.sortOrder || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* Toggle Active Status */}
                                            <button
                                                onClick={() => handleToggleActive(category.id, category.isActive)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    category.isActive
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-red-600 hover:bg-red-50'
                                                }`}
                                                title={category.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {category.isActive ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                )}
                                            </button>
                                            
                                            {/* Edit Button */}
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                                onClick={() => setEditCategory(category.id)}
                                                title="Edit category"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            
                                            {/* Delete Button */}
                                            <button
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                onClick={() => handleDelete(category.id)}
                                                title="Delete category"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryList;
