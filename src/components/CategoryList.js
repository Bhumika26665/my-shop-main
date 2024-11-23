import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = ({ setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);  // Store all products fetched from the server
    const [filteredProducts, setFilteredProducts] = useState([]);  // Store products filtered by category
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);  // Track the selected category
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useCart();

    useEffect(() => {
        // Fetch categories and all products on component mount
        const fetchCategoriesAndProducts = async () => {
            try {
                const categoriesResponse = await axios.get('/categories');
                setCategories(categoriesResponse.data);

                // Fetch all products initially
                const productsResponse = await axios.get('/products');
                setAllProducts(productsResponse.data);  // Store all products
            } catch (error) {
                console.error('Error fetching categories or products', error);
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    // Function to handle category selection and filter products by selected category
    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);  // Set selected category in the parent component (if passed as prop)
        setSelectedCategoryId(categoryId);  // Track the selected category locally
    
        // Filter products based on selected category
        const filtered = allProducts.filter(product => {
            // Log both product.category?.id and selected categoryId for debugging
            console.log(`Product Category ID: ${product.category?.id}, Selected Category ID: ${categoryId}`);
    
            return product.category?.id === categoryId;  // Compare and filter products
        });
    
        setFilteredProducts(filtered);  // Update filtered products state
    };
    const handleQuantityChange = (productId, quantity) => {
        setQuantities(prev => ({ ...prev, [productId]: quantity }));
    };
    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1; // Default to 1
        const finalPrice = quantity >= product.quantity_threshold ? product.discounted_price : product.price;

        addToCart({ ...product, quantity, price: finalPrice });
        toast.success(`${product.name} added to cart with quantity ${quantity}!`);
    };

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <li 
                        key={category._id} 
                        className={`bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-200 transition ${
                            selectedCategoryId === category._id ? 'bg-blue-300' : ''
                        }`}  // Highlight selected category
                        onClick={() => handleCategoryClick(category._id)}  // Filter products on category click
                    >
                        {category.name}
                    </li>
                ))}
            </ul>

            {/* Display filtered products below category list */}
            {filteredProducts.length > 0 ? (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Products in Selected Category</h3>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                            <Link to={`/product/${product.id}`}>
                                <img className="product-image" src={product.image} alt={product.name} />
                            </Link>
                            <div className="product-details">
                                <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
                                <p className="product-price">₹{product.price}</p>
                                <label className="quantity-label">Quantity:</label>
                                <select
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                                    className="quantity-select"
                                >
                                    {[...Array(product.countInStock).keys()].map(q => (
                                        <option key={q + 1} value={q + 1}>{q + 1}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="add-to-cart-button"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        ))}
                    </ul>
                            <ToastContainer />
                </div>
            ) : (
                <p className="mt-4 text-gray-500">No products available for the selected category.</p>
            )}
        </div>
    );
};

export default CategoryList;
