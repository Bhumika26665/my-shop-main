import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './components.css'; // Import your CSS file

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useCart();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/products');
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.price.toString().includes(searchLower)
        );
    });

    const handleQuantityChange = (productId, quantity) => {
        setQuantities(prev => ({ ...prev, [productId]: quantity }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1; // Default to 1
        const finalPrice = quantity >= product.quantity_threshold ? product.discounted_price : product.price;

        addToCart({ ...product, quantity, price: finalPrice });
        toast.success(`${product.name} added to cart with quantity ${quantity}!`);
    };

    if (loading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="container">
            <h2 className="title">Product List</h2>
            <div className="product-grid">
                {filteredProducts.map(product => (
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
            </div>
            <ToastContainer />
        </div>
    );
};

export default ProductList;
