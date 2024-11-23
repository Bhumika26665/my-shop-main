// src/pages/Categories.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig'; // Make sure this is correctly configured
import ProductList from '../components/ProductList';
import Navbar from '../components/Navbar';


const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/categories'); // Fetch categories from the API
                setCategories(response.data);
                setError(null);
            } catch (err) {
                setError('Error fetching categories');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="">
            <Navbar/>
            <h1 className="text-3xl font-bold text-center my-6">Categories</h1>

            {/* Show loading or error */}
            {loading && <p className="text-center text-blue-600">Loading categories...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {/* Categories List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map(category => (
                    <Link
                        key={category._id}
                        to={`/products?category=${category.name}`} // Redirect to Products page with selected category
                        className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-center"
                    >
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
