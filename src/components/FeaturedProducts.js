import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Store the category ID
    const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useCart();
    // Fetch the featured products from the API
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axios.get('/products?featured=true');
                setFeaturedProducts(response.data); // Store all featured products
                setFilteredProducts(response.data); // Initially show all products
            } catch (error) {
                console.error('Error fetching featured products', error);
                setError('Failed to load featured products.');
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []);

    // Handle product click and filter by category
    const handleProductClick = (categoryId) => {
        console.log('Product clicked, category ID:', categoryId);
        setSelectedCategoryId(categoryId);

        // Filter products based on the selected category
        const filtered = featuredProducts.filter(
            (product) => product.category?.id === categoryId // Filtering based on category.id
        );

        console.log('Filtered Products:', filtered);
        setFilteredProducts(filtered); // Update the filtered products state
    };

    // Show loading state while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error state if there's an issue fetching the data
    if (error) {
        return <div className="text-red-600">{error}</div>;
    }
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
            <h2 className="text-2xl font-bold mb-4">Featured Products</h2>

            {/* Display Featured Products */}
            {featuredProducts.length === 0 ? (
                <p>No featured products available at the moment.</p>
            ) : (
                <>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            product.isFeatured && (
                                <li
                                    key={product._id}
                                    className="bg-white p-4 rounded-lg shadow-lg cursor-pointer"
                                    onClick={() => handleProductClick(product.category?.id)} // Passing category ID
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover mb-4 rounded-lg"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                    {/* <p className="text-blue-600 font-bold text-xl">₹{product.price}</p> */}
                                </li>
                            )
                        ))}
                    </ul>

                    {/* Show Products Filtered by Category */}
                    {selectedCategoryId && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold">Products in the same category</h3>

                            {/* Show filtered products based on the selected category */}
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.length === 0 ? (
                                    <p>No products found in this category.</p>
                                ) : (
                                    filteredProducts.map((product) => (
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
                                    ))
                                )}
                            </ul>
                            <ToastContainer />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FeaturedProducts;
