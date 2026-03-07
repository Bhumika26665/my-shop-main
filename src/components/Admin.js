import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import ImageGalleryUpload from './ImageGalleryUpload';
import PhotoLibrary from './PhotoLibrary';
import { FaImages, FaPlus } from 'react-icons/fa';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        price: '', 
        category: '',
        description: '',
        countInStock: '',
        brand: '',
        material: '',
        careInstructions: '',
        season: 'All Season',
        occasion: 'Casual',
        fit: 'Regular',
        weight: '',
        dimensions: '',
        tags: [],
        sku: '',
        availableSizes: ['S', 'M', 'L', 'XL'],
        availableColors: [],
        images: []
    });
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'library'

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (images) => {
        setNewProduct(prev => ({ ...prev, images }));
    };

    const handleColorChange = (color) => {
        setNewProduct(prev => ({ ...prev, availableColors: [...prev.availableColors, color] }));
    };

    const handleSizeChange = (size) => {
        setNewProduct(prev => ({ ...prev, availableSizes: [...prev.availableSizes, size] }));
    };

    const handleTagsChange = (tag) => {
        setNewProduct(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    };

    const handlePhotoLibrarySelect = (selectedPhotos) => {
        // Convert photo library photos to the expected format for product images
        const formattedImages = selectedPhotos.map(photo => ({
            url: photo.url,
            name: photo.name,
            file: null // These are existing photos, not new uploads
        }));
        
        handleImageChange(formattedImages);
        setShowPhotoLibrary(false);
    };

    const addProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/products', newProduct);
            fetchProducts();
            setNewProduct({ 
                name: '', 
                price: '', 
                category: '',
                description: '',
                countInStock: '',
                brand: '',
                material: '',
                careInstructions: '',
                season: 'All Season',
                occasion: 'Casual',
                fit: 'Regular',
                weight: '',
                dimensions: '',
                tags: [],
                sku: '',
                availableSizes: ['S', 'M', 'L', 'XL'],
                availableColors: [],
                images: []
            });
        } catch (error) {
            setError('Error adding product: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.put(`/products/${editProduct._id}`, editProduct);
            fetchProducts();
            setEditProduct(null);
        } catch (error) {
            setError('Error updating product: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await axios.delete(`/products/${productId}`);
            fetchProducts();
        } catch (error) {
            setError('Error deleting product: ' + (error.response?.data?.message || error.message));
        }
    };

    const startEdit = (product) => {
        setEditProduct({
            ...product,
            availableSizes: product.availableSizes || ['S', 'M', 'L', 'XL'],
            availableColors: product.availableColors || []
        });
    };

    const handleEditChange = (e) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin - Product Management</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                
                {/* Image Upload Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <FaImages className="mr-2 text-pink-500" />
                            Product Images
                        </h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'upload' 
                                        ? 'bg-pink-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Upload New
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('library')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'library' 
                                        ? 'bg-pink-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Photo Library
                            </button>
                        </div>
                    </div>

                    {activeTab === 'upload' ? (
                        <ImageGalleryUpload 
                            images={newProduct.images} 
                            onChange={handleImageChange}
                            maxImages={10}
                        />
                    ) : (
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
                                    <FaPlus className="mr-2" />
                                    Browse Library
                                </button>
                            </div>
                            
                            {/* Selected Images Preview */}
                            {newProduct.images && newProduct.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {newProduct.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image.url}
                                                alt={image.name}
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

                <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                        className="border rounded p-2"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category ID"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        required
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={newProduct.brand}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="number"
                        name="countInStock"
                        placeholder="Stock Count"
                        value={newProduct.countInStock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="sku"
                        placeholder="SKU (Optional)"
                        value={newProduct.sku}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="material"
                        placeholder="Material (Optional)"
                        value={newProduct.material}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="season"
                        placeholder="Season"
                        value={newProduct.season}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="occasion"
                        placeholder="Occasion"
                        value={newProduct.occasion}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        className="border rounded p-2 md:col-span-2"
                        rows="3"
                    />
                    <textarea
                        name="careInstructions"
                        placeholder="Care Instructions (Optional)"
                        value={newProduct.careInstructions}
                        onChange={handleInputChange}
                        className="border rounded p-2 md:col-span-2"
                        rows="2"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || (newProduct.images.length === 0)}
                        className="bg-pink-500 text-white rounded p-3 hover:bg-pink-600 disabled:bg-gray-400 md:col-span-2 font-medium"
                    >
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                </form>
            </div>

            {/* Products List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Price</th>
                                <th className="text-left p-2">Category</th>
                                <th className="text-left p-2">Stock</th>
                                <th className="text-left p-2">Images</th>
                                <th className="text-left p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b">
                                    <td className="p-2">{product.name}</td>
                                    <td className="p-2">${product.price}</td>
                                    <td className="p-2">{product.category?.name || 'N/A'}</td>
                                    <td className="p-2">{product.countInStock}</td>
                                    <td className="p-2">
                                        <div className="flex items-center gap-1">
                                            <img 
                                                src={product.image} 
                                                alt={product.name}
                                                className="w-8 h-8 object-cover rounded"
                                            />
                                            {product.images && product.images.length > 0 && (
                                                <span className="text-xs text-gray-500">
                                                    +{product.images.length}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <button 
                                            onClick={() => startEdit(product)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteProduct(product._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Product Form */}
            {editProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                        <form onSubmit={updateProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Product Name"
                                    value={editProduct.name}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={editProduct.price}
                                    onChange={handleEditChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Category ID"
                                    value={editProduct.category}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    type="text"
                                    name="brand"
                                    placeholder="Brand"
                                    value={editProduct.brand}
                                    onChange={handleEditChange}
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    type="number"
                                    name="countInStock"
                                    placeholder="Stock Count"
                                    value={editProduct.countInStock}
                                    onChange={handleEditChange}
                                    required
                                    min="0"
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    type="text"
                                    name="sku"
                                    placeholder="SKU"
                                    value={editProduct.sku}
                                    onChange={handleEditChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={editProduct.description}
                                onChange={handleEditChange}
                                className="w-full border rounded p-2"
                                rows="3"
                            />
                            <div className="flex space-x-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 bg-pink-500 text-white rounded p-2 hover:bg-pink-600 disabled:bg-gray-400"
                                >
                                    {loading ? 'Updating...' : 'Update Product'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setEditProduct(null)}
                                    className="flex-1 bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                selectedPhotos={newProduct.images}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
