import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components
const Navbar = lazy(() => import('./Navbar'));
const Footer = lazy(() => import('./Footer'));

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Simplified quantity state
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);

        const relatedResponse = await axios.get(`/products?category=${response.data.category.id}`);
        const filteredProducts = relatedResponse.data.filter(
          (item) => item.category._id === response.data.category._id && item._id !== id
        );
        setRelatedProducts(filteredProducts);
      } catch (err) {
        setError('Failed to load product details.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = quantity >= product.quantity_threshold ? product.discounted_price : product.price;
    addToCart({ ...product, quantity, price: finalPrice });
    toast.success(`${product.name} added to cart!`, { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="animate-pulse h-16 bg-gray-200"></div>}>
        <Navbar />
      </Suspense>

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="h-96 w-full bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 w-16 bg-gray-200 rounded-md"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-20 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg">
            {/* Product Image */}
            <div className="flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-96 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
              {product.galleryImages?.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {product.galleryImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded-md hover:ring-2 hover:ring-blue-500 transition"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-green-600">₹{product.price}</p>
                {product.discount && (
                  <p className="text-red-600 line-through">₹{product.originalPrice}</p>
                )}
              </div>
              {product.discount && (
                <p className="text-green-600 font-medium">
                  Save ₹{product.discount} ({product.discountPercentage}% off)
                </p>
              )}
              <p className="text-gray-600">{product.description}</p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-gray-700 font-medium">
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.countInStock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Product quantity"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                disabled={quantity > product.countInStock}
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>

              <div className="border-t pt-4 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Brand:</span> {product.brand}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Category:</span> {product.category?.name || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Stock:</span> {product.countInStock}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <div
  key={item._id}
  className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
>
  <Link to={`/product/${item._id}`}>
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      className="h-60 object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105"
    />
  </Link>
  <h3 className="text-lg text-center font-semibold text-gray-800 mb-2">{item.name}</h3>
  <p className="text-green-600 text-center font-medium">₹{item.price}</p>

  {/* Centering the button */}
  <div className="flex justify-center mt-2">
    <button
      onClick={() => {
        const finalPrice = item.discounted_price || item.price;
        addToCart({ ...item, quantity: 1, price: finalPrice });
        toast.success(`${item.name} added to cart!`, { autoClose: 2000 });
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
      Add to Cart
    </button>
  </div>
</div>

              ))}
            </div>
          </section>
        )}
      </main>

      <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200"></div>}>
        <Footer />
      </Suspense>

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default ProductDetails;
