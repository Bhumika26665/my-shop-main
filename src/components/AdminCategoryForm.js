// src/components/AdminCategoryForm.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const AdminCategoryForm = ({ editCategory, fetchCategories }) => {
    const [formCategory, setFormCategory] = useState({ 
        name: '',
        icon: '',
        color: '#6B46C1',
        description: '',
        sortOrder: 0,
        isActive: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editCategory) {
            const fetchCategoryDetails = async () => {
                try {
                    const { data } = await axiosInstance.get(`/categories/${editCategory}`);
                    setFormCategory({ 
                        name: data.name || '',
                        icon: data.icon || '',
                        color: data.color || '#6B46C1',
                        description: data.description || '',
                        sortOrder: data.sortOrder || 0,
                        isActive: data.isActive !== undefined ? data.isActive : true
                    });
                    if (data.image) {
                        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
                        setImagePreview(`${backendUrl}${data.image}`);
                    }
                } catch (error) {
                    console.error('Error fetching category details:', error);
                }
            };
            fetchCategoryDetails();
        }
    }, [editCategory]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormCategory((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            
            // Add form fields
            Object.keys(formCategory).forEach(key => {
                formData.append(key, formCategory[key]);
            });

            // Add image file if selected
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editCategory) {
                await axiosInstance.put(`/categories/${editCategory}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axiosInstance.post('/categories', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            
            fetchCategories();
            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormCategory({ 
            name: '',
            icon: '',
            color: '#6B46C1',
            description: '',
            sortOrder: 0,
            isActive: true
        });
        setImageFile(null);
        setImagePreview('');
    };

    return (
        <form className="space-y-6 p-6 bg-white border border-gray-200 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                {editCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            {/* Image Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category Image</label>
                <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                        <img
                            className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
                            src={imagePreview || 'https://via.placeholder.com/150x150.png?text=No+Image'}
                            alt="Category preview"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>Upload image</span>
                            <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g., Sarees, Kurtis, Lehengas"
                        value={formCategory.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                    </label>
                    <input
                        type="number"
                        name="sortOrder"
                        placeholder="0"
                        value={formCategory.sortOrder}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    placeholder="Describe this category..."
                    value={formCategory.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            {/* Icon and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon (optional)
                    </label>
                    <input
                        type="text"
                        name="icon"
                        placeholder="e.g., 🌸, 👗, 💍"
                        value={formCategory.icon}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Theme Color
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            name="color"
                            value={formCategory.color}
                            onChange={handleInputChange}
                            className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={formCategory.color}
                            onChange={(e) => setFormCategory(prev => ({ ...prev, color: e.target.value }))}
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            placeholder="#6B46C1"
                        />
                    </div>
                </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formCategory.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (show on website)
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : (editCategory ? 'Update Category' : 'Add Category')}
                </button>
                {!editCategory && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        Clear
                    </button>
                )}
            </div>
        </form>
    );
};

export default AdminCategoryForm;
