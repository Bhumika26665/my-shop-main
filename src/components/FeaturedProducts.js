import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components (assuming these exist)
// const Navbar = lazy(() => import('./Navbar'));
// const Footer = lazy(() => import('./Footer'));

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/products?featured=true');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load featured products.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const finalPrice = quantity >= product.quantity_threshold ? product.discounted_price : product.price;
    addToCart({ ...product, quantity, price: finalPrice });
    toast.success(`${product.name} added to cart!`, { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Suspense fallback={<div className="animate-pulse h-16 bg-gray-200"></div>}>
        <Navbar />
      </Suspense> */}

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-3/4 bg-gray-200 mt-4 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 mt-2 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        {!loading && products.length === 0 && (
          <p className="text-gray-600 text-center">No featured products available.</p>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => product.isFeatured)
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-54 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                    />
                  </Link>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-green-600 font-medium mb-4">₹{product.price}</p>

                  <div className="flex items-center gap-4">
                    <label htmlFor={`quantity-${product._id}`} className="sr-only">
                      Quantity for {product.name}
                    </label>
                    <select
                      id={`quantity-${product._id}`}
                      value={quantities[product._id] || 1}
                      onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[...Array(product.countInStock).keys()].map((q) => (
                        <option key={q + 1} value={q + 1}>
                          {q + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200"></div>}>
        <Footer />
      </Suspense> */}

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default FeaturedProducts;