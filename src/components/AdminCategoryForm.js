// src/components/AdminCategoryForm.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const AdminCategoryForm = ({ editCategory, fetchCategories }) => {
    const [formCategory, setFormCategory] = useState({ name: '' });

    useEffect(() => {
        if (editCategory) {
            const fetchCategoryDetails = async () => {
                try {
                    const { data } = await axiosInstance.get(`/categories/${editCategory}`);
                    setFormCategory({ name: data.name });
                } catch (error) {
                    console.error('Error fetching category details:', error);
                }
            };
            fetchCategoryDetails();
        }
    }, [editCategory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCategory) {
                await axiosInstance.put(`/categories/${editCategory}`, formCategory);
            } else {
                await axiosInstance.post('/categories', formCategory);
            }
            fetchCategories();
            setFormCategory({ name: '' }); // Reset form after submission
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    return (
        <form className="space-y-4 p-4 border border-gray-300 rounded shadow-lg" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold">{editCategory ? 'Edit Category' : 'Add Category'}</h2>
            <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={formCategory.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500">
                {editCategory ? 'Update Category' : 'Add Category'}
            </button>
        </form>
    );
};

export default AdminCategoryForm;
