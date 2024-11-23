import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';  // Assuming axiosConfig is where you set up baseURL

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
    const [editProduct, setEditProduct] = useState(null); // To store product for editing

    // Fetch products on initial load
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch all products from the backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Add a new product
    const addProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/products', newProduct);  // Send as JSON
            fetchProducts();  // Refresh product list after adding
            setNewProduct({ name: '', price: '', category: '' });  // Clear the form
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    // Update existing product
    const updateProduct = async (e) => {
        e.preventDefault();  // Prevent default form submission
        try {
            await axios.put(`/products/${editProduct._id}`, editProduct);  // Send as JSON
            fetchProducts();  // Refresh product list after updating
            setEditProduct(null);  // Clear the edit form
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Delete product
    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`/products/${productId}`);
            fetchProducts();  // Refresh product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Handle input change for both add and edit forms
    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1>Admin - Product Management</h1>

            {/* Add Product Form */}
            <form onSubmit={addProduct}>
                <h2>Add New Product</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Product</button>
            </form>

            {/* List of Products */}
            <h2>Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        {product.name} - ${product.price} - {product.category}
                        <button onClick={() => setEditProduct(product)}>Edit</button>
                        <button onClick={() => deleteProduct(product._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Edit Product Form */}
            {editProduct && (
                <form onSubmit={updateProduct}>
                    <h2>Edit Product</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={editProduct.name}
                        onChange={handleEditChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={editProduct.price}
                        onChange={handleEditChange}
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={editProduct.category}
                        onChange={handleEditChange}
                        required
                    />
                    <input
                        type="file"
                        name="category"
                        placeholder="Category"
                        value={editProduct.category}
                        onChange={handleEditChange}
                        required
                    />
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Admin;
