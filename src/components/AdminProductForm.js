import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import PhotoLibrary from './PhotoLibrary';
import { FaUpload, FaTrash, FaTimes, FaSave, FaPlus, FaMinus } from 'react-icons/fa';

const AdminProductForm = ({ editProduct, fetchProducts }) => {
    const [formProduct, setFormProduct] = useState({
        name: '',
        description: '',
        price: 0,
        discounted_price: 0,
        category: '',
        brand: '',
        countInStock: 0,
        quantity_threshold: 0,
        image: null,
        isFeatured: false,
        sku: '',
        availableSizes: ['S', 'M', 'L', 'XL'],
        availableColors: [],
    });

    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [libraryPhotos, setLibraryPhotos] = useState([]);
    const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
    const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'library'
    const [isEditing, setIsEditing] = useState(!!editProduct);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (editProduct) {
            const fetchProductDetails = async () => {
                try {
                    const { data } = await axiosInstance.get(`/products/${editProduct}`);
                    setFormProduct({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        discounted_price: data.discounted_price || 0,
                        category: data.category,
                        brand: data.brand,
                        countInStock: data.countInStock,
                        quantity_threshold: data.quantity_threshold || 0,
                        image: data.image,
                        isFeatured: data.isFeatured || false,
                        sku: data.sku || '',
                        availableSizes: data.availableSizes || ['S', 'M', 'L', 'XL'],
                        availableColors: data.availableColors || [],
                    });
                } catch (error) {
                    console.error('Error fetching product details:', error);
                    setError('Failed to fetch product details');
                }
            };
            fetchProductDetails();
        }
    }, [editProduct]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axiosInstance.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormProduct((prev) => {
            const updatedForm = {
                ...prev,
                [name]: ['price', 'discounted_price', 'countInStock', 'quantity_threshold'].includes(name) ? parseFloat(value) : value,
            };
            
            // Auto-generate SKU if name is entered and SKU is empty
            if (name === 'name' && value && !prev.sku) {
                const sku = value.toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .slice(0, 8) + '-' + Date.now().toString().slice(-4);
                updatedForm.sku = sku;
            }
            
            return updatedForm;
        });
        setError('');
    };

    const handleFileChange = (e) => {
        setImageFiles(Array.from(e.target.files));
        setError('');
    };

    const handleFeatureChange = (e) => {
        setFormProduct((prev) => ({ ...prev, isFeatured: e.target.value === 'true' }));
    };

    const handleSizeToggle = (size) => {
        setFormProduct((prev) => ({
            ...prev,
            availableSizes: prev.availableSizes.includes(size)
                ? prev.availableSizes.filter(s => s !== size)
                : [...prev.availableSizes, size]
        }));
    };

    const handleColorAdd = (color) => {
        if (color && !formProduct.availableColors.includes(color)) {
            setFormProduct((prev) => ({
                ...prev,
                availableColors: [...prev.availableColors, color]
            }));
        }
    };

    const handleColorRemove = (color) => {
        setFormProduct((prev) => ({
            ...prev,
            availableColors: prev.availableColors.filter(c => c !== color)
        }));
    };

    const handlePhotoLibrarySelect = (selectedPhotos) => {
        setLibraryPhotos(selectedPhotos);
        setShowPhotoLibrary(false);
    };

    const resetForm = () => {
        setFormProduct({
            name: '',
            description: '',
            brand: '',
            price: 0,
            discounted_price: 0,
            quantity_threshold: 0,
            category: '',
            countInStock: 0,
            image: null,
            isFeatured: false,
            sku: '',
            availableSizes: ['S', 'M', 'L', 'XL'],
            availableColors: [],
        });
        setImageFiles([]);
        setLibraryPhotos([]);
        setImageSource('upload');
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {

        // Ensure SKU is always present
        if (!formProduct.sku) {
            // Generate SKU from name or create a default one
            const generatedSku = formProduct.name 
                ? formProduct.name.toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .slice(0, 8) + '-' + Date.now().toString().slice(-4)
                : 'PROD-' + Date.now().toString().slice(-4);
            
            setFormProduct(prev => ({ ...prev, sku: generatedSku }));
            
            // Show error and stop submission
            setError('SKU was auto-generated. Please try submitting again.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            
            // Debug: Log formProduct to see all values
            console.log('Form data being submitted:', formProduct);
            
            Object.entries(formProduct).forEach(([key, value]) => {
                // Handle arrays properly
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });
            
            // Handle images based on source
            if (imageSource === 'upload') {
                // Add uploaded files
                imageFiles.forEach((file, index) => {
                    formData.append('images', file);
                });
            } else if (imageSource === 'library') {
                // Add library photos as URLs
                libraryPhotos.forEach((photo, index) => {
                    formData.append('libraryImageUrls[]', photo.url);
                    formData.append('libraryImageNames[]', photo.name);
                });
                
                // For editing, if no new library photos selected, keep existing images
                if (libraryPhotos.length === 0 && isEditing) {
                    formData.append('keepExistingImages', 'true');
                }
            }

            // Debug: Log FormData contents
            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            if (editProduct) {
                await axiosInstance.put(`/products/${editProduct}`, formData);
                setSuccess('Product updated successfully!');
            } else {
                await axiosInstance.post('/products', formData);
                setSuccess('Product added successfully!');
            }

            fetchProducts();
            setTimeout(() => {
                resetForm();
                setSuccess('');
            }, 2000);
        } catch (error) {
            console.error('Error saving product:', error);
            setError(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchMode = () => {
        setIsEditing((prev) => !prev);
        resetForm();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        {isEditing ? '✏️ Edit Product' : '➕ Add Product'}
                    </h2>
                    <button
                        type="button"
                        onClick={handleSwitchMode}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        {isEditing ? 'Switch to Add' : 'Switch to Edit'}
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}

            {success && (
                <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {success}
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            value={formProduct.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="brand"
                            placeholder="Enter brand name"
                            value={formProduct.brand}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SKU <span className="text-red-500">*</span>
                            {formProduct.sku && !formProduct.name && (
                                <span className="text-xs text-gray-500 ml-2">(Auto-generated)</span>
                            )}
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="sku"
                                placeholder="Enter SKU (Stock Keeping Unit)"
                                value={formProduct.sku}
                                onChange={handleInputChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const generatedSku = formProduct.name 
                                        ? formProduct.name.toUpperCase()
                                            .replace(/[^A-Z0-9]/g, '')
                                            .slice(0, 8) + '-' + Date.now().toString().slice(-4)
                                        : 'PROD-' + Date.now().toString().slice(-4);
                                    setFormProduct(prev => ({ ...prev, sku: generatedSku }));
                                }}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                Generate
                            </button>
                        </div>
                        {formProduct.sku && formProduct.name && (
                            <p className="text-xs text-gray-500 mt-1">
                                SKU auto-generated from product name
                            </p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            placeholder="0.00"
                            value={formProduct.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Discounted Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discounted Price (₹)
                        </label>
                        <input
                            type="number"
                            name="discounted_price"
                            placeholder="0.00"
                            value={formProduct.discounted_price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formProduct.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="countInStock"
                            placeholder="0"
                            value={formProduct.countInStock}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Sizes */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Sizes
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        formProduct.availableSizes.includes(size)
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Colors
                        </label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    id="colorInput"
                                    className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const colorInput = document.getElementById('colorInput');
                                        if (colorInput.value) {
                                            handleColorAdd(colorInput.value);
                                            colorInput.value = '';
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                >
                                    Add Color
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formProduct.availableColors.map(color => (
                                    <div
                                        key={color}
                                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg"
                                    >
                                        <div
                                            className="w-6 h-6 rounded border border-gray-300"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-sm">{color}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleColorRemove(color)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stock by Size and Color */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Management by Size & Color
                        </label>
                        <div className="space-y-4">
                            {formProduct.availableSizes.map(size => (
                                <div key={size} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Size: {size}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formProduct.availableColors.map(color => (
                                            <div key={`${size}-${color}`} className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded border border-gray-300"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="text-sm">{color}</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Stock"
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                    onChange={(e) => {
                                                        // This would need to be handled with a more complex state structure
                                                        // For now, we'll use the main countInStock field
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Threshold */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity Threshold for Discount
                        </label>
                        <input
                            type="number"
                            name="quantity_threshold"
                            placeholder="0"
                            value={formProduct.quantity_threshold}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images {!isEditing && <span className="text-red-500">*</span>}
                        </label>
                        
                        {/* Image Source Toggle */}
                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setImageSource('upload')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    imageSource === 'upload' 
                                        ? 'bg-pink-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                📤 Upload New
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSource('library')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    imageSource === 'library' 
                                        ? 'bg-pink-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                📚 Photo Library
                            </button>
                        </div>

                        {/* Upload Option */}
                        {imageSource === 'upload' && (
                            <div className="relative">
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                    required={!isEditing}
                                />
                                {imageFiles.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selected: {imageFiles.length} image(s)
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Photo Library Option */}
                        {imageSource === 'library' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Select from your existing photo library to avoid duplicate uploads
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowPhotoLibrary(true)}
                                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                                    >
                                        📚 Browse Library
                                    </button>
                                </div>
                                
                                {/* Selected Images Preview */}
                                {libraryPhotos.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {libraryPhotos.map((photo, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={photo.url}
                                                    alt={photo.name}
                                                    className="w-full h-20 object-cover rounded border border-gray-200"
                                                />
                                                {index === 0 && (
                                                    <div className="absolute top-1 left-1 bg-pink-500 text-white text-xs px-1 py-0.5 rounded">
                                                        Main
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Enter product description"
                        value={formProduct.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Featured Toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Product
                    </label>
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="isFeatured"
                                value="true"
                                checked={formProduct.isFeatured === true}
                                onChange={handleFeatureChange}
                                className="mr-2 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="isFeatured"
                                value="false"
                                checked={formProduct.isFeatured === false}
                                onChange={handleFeatureChange}
                                className="mr-2 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="text-gray-700">No</span>
                        </label>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? 'Updating...' : 'Adding...'}
                            </>
                        ) : (
                            <>
                                {isEditing ? '🔄 Update Product' : '➕ Add Product'}
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🔄 Reset
                    </button>
                </div>
            </form>

            {/* Photo Library Modal */}
            {showPhotoLibrary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Photo Library</h3>
                                <button
                                    onClick={() => setShowPhotoLibrary(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <PhotoLibrary 
                                onSelectPhotos={handlePhotoLibrarySelect}
                                selectedPhotos={libraryPhotos}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductForm;
