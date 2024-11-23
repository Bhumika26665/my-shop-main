import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

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
    });

    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(!!editProduct); // To track if we are in edit mode or add mode

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
                    });
                } catch (error) {
                    console.error('Error fetching product details:', error);
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
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormProduct((prev) => ({
            ...prev,
            [name]: ['price', 'discounted_price', 'countInStock', 'quantity_threshold'].includes(name) ? parseFloat(value) : value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleFeatureChange = (e) => {
        setFormProduct((prev) => ({ ...prev, isFeatured: e.target.value === 'true' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(formProduct).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (imageFile) formData.append('image', imageFile);

            if (editProduct) {
                await axiosInstance.put(`/products/${editProduct}`, formData);
            } else {
                await axiosInstance.post('/products', formData);
            }

            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }
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
        });
        setImageFile(null);
    };

    const handleSwitchMode = () => {
        setIsEditing((prev) => !prev);
        resetForm(); // Reset the form when switching modes
    };

    return (
        <form className="space-y-4 p-4 border border-gray-300 rounded shadow-lg" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
            <input type="text" name="name" placeholder="Product Name" value={formProduct.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
            <textarea name="description" placeholder="Description" value={formProduct.description} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
            <input type="text" name="brand" placeholder="Brand" value={formProduct.brand} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
            <input type="number" name="price" placeholder="Price" value={formProduct.price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
            <input type="number" name="discounted_price" placeholder="Discounted Price" value={formProduct.discounted_price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
            <input type="number" name="quantity_threshold" placeholder="Quantity Threshold" value={formProduct.quantity_threshold} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
            <select name="category" value={formProduct.category} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
            <input type="number" name="countInStock" placeholder="Count in Stock" value={formProduct.countInStock} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
            <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" required={!isEditing} />

            <div>
                <label className="block text-lg font-medium">Is Featured?</label>
                <div className="flex items-center space-x-4">
                    <label>
                        <input type="radio" name="isFeatured" value="true" checked={formProduct.isFeatured === true} onChange={handleFeatureChange} className="mr-2" /> Yes
                    </label>
                    <label>
                        <input type="radio" name="isFeatured" value="false" checked={formProduct.isFeatured === false} onChange={handleFeatureChange} className="mr-2" /> No
                    </label>
                </div>
            </div>

            <div className="flex space-x-4">
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500">
                    {isEditing ? 'Update Product' : 'Add Product'}
                </button>
                <button
                    type="button"
                    onClick={handleSwitchMode}
                    className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500"
                >
                    {isEditing ? 'Switch to Add Product' : 'Switch to Edit Product'}
                </button>
            </div>
        </form>
    );
};

export default AdminProductForm;
