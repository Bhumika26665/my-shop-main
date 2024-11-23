import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';

const AdminProductList = ({ products, fetchProducts, setEditProduct }) => {
    const [loading, setLoading] = useState(false);
    const [modifiedProducts, setModifiedProducts] = useState({});

    const handleDelete = async (productId) => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/products/${productId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeaturedToggle = async (product) => {
        const newFeaturedStatus = !product.isFeatured;
        setModifiedProducts((prev) => ({
            ...prev,
            [product._id]: newFeaturedStatus,
        }));

        try {
            await axiosInstance.put(`/products/${product._id}`, { featured: newFeaturedStatus }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchProducts();
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Admin Product List</h2>
            {loading && <div>Loading...</div>}
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Image</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Stock</th>
                        <th className="p-2">Featured</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="border-t">
                            <td className="p-2">
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                            </td>
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">${product.price}</td>
                            <td className="p-2">{product.category?.name || 'No Category'}</td>
                            <td className="p-2">{product.countInStock}</td>
                            <td className="p-2">
                                <input
                                    type="checkbox"
                                    checked={modifiedProducts[product._id] !== undefined ? modifiedProducts[product._id] : product.isFeatured}
                                    onChange={() => handleFeaturedToggle(product)}
                                />
                            </td>
                            <td className="p-2 space-x-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400"
                                    onClick={() => setEditProduct(product._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductList;
