import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { 
    FaHeart, FaShare, FaTruck, FaShieldAlt, FaShoppingBag, 
    FaStar, FaRegStar, FaMinus, FaPlus, FaChevronLeft, 
    FaChevronRight, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp
} from 'react-icons/fa';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import NotifyMeButton from './NotifyMeButton';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Safe toast function to prevent undefined errors
const safeToast = {
    success: (message) => {
        try {
            toast?.success?.(message);
        } catch (error) {
            console.log('Toast success:', message);
        }
    },
    error: (message) => {
        try {
            toast?.error?.(message);
        } catch (error) {
            console.log('Toast error:', message);
        }
    }
};

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [quantities, setQuantities] = useState({});
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                setProduct(response.data);
                setError(null);

                const relatedResponse = await axios.get(`/products?category=${response.data.category.id}`);
                const filteredProducts = relatedResponse.data.filter(
                    (item) => item.category._id === response.data.category._id && item._id !== id
                );
                setRelatedProducts(filteredProducts);
            } catch (error) {
                setError('Error fetching product details');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (productId, quantity) => {
        setQuantities(prev => ({ ...prev, [productId]: quantity }));
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            safeToast.error('Please select a size');
            return;
        }
        
        const productToAdd = {
            ...product,
            selectedSize,
            selectedColor,
            quantity: quantity || 1,
            uniqueKey: `${product._id}_${selectedSize}_${selectedColor?.name || 'default'}`
        };
        
        addToCart(productToAdd);
        setAddedToCart(true);
        safeToast.success('Added to cart successfully!');
        
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out this ${product.name} from Bhumika Fashion!`;
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            instagram: `https://www.instagram.com/`,
            whatsapp: `https://wa.me/?text=${text} ${url}`
        };
        
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const handleFavorite = () => {
        setIsFavorited(!isFavorited);
        safeToast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {loading && <p className="text-center mt-10 text-gray-500">Loading product details...</p>}
            {error && <p className="text-red-500 text-center mt-10">{error}</p>}
            
            {product && (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Left: Product Images */}
                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-lg">
                                <LazyLoadImage
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-96 object-cover"
                                    effect="blur"
                                />
                                
                                {/* Discount Badge */}
                                {product.discounted_price && product.discounted_price < product.price && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {Math.round(((product.price - product.discounted_price) / product.price) * 100)}% OFF
                                    </div>
                                )}
                            </div>
                            
                            {/* Product Gallery */}
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden">
                                        <LazyLoadImage
                                            src={product.image}
                                            alt={`${product.name} view ${i}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                            effect="blur"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {product.category?.name || 'Fashion'}
                                    </span>
                                    {product.countInStock > 0 && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                            In Stock
                                        </span>
                                    )}
                                </div>
                                
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                                
                                {/* Rating */}
                                {product.rating && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-gray-600">({product.numReviews} reviews)</span>
                                    </div>
                                )}
                            </div>

                            {/* Price Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {product.discounted_price && product.discounted_price < product.price ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-pink-600">
                                            {formatPrice(product.discounted_price)}
                                        </span>
                                        <span className="text-xl text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full font-medium">
                                            Save {formatPrice(product.price - product.discounted_price)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-gray-800">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                                
                                {product.quantity_threshold && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Buy {product.quantity_threshold}+ for discount price
                                    </p>
                                )}
                            </div>

                            {/* Size and Color Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <SizeSelector
                                    availableSizes={product.availableSizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                                    selectedSize={selectedSize}
                                    onSizeChange={setSelectedSize}
                                />
                                <ColorSelector
                                    availableColors={product.availableColors || []}
                                    selectedColor={selectedColor}
                                    onColorChange={setSelectedColor}
                                />
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.countInStock}
                                        value={quantities[product._id] || 1}
                                        onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                        className="border rounded px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.countInStock === 0}
                                        className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                                    >
                                        <FaShoppingBag className="mr-2" />
                                        Add to Cart
                                    </button>
                                    
                                    {product.countInStock === 0 && (
                                        <NotifyMeButton
                                            productId={product._id}
                                            size={selectedSize || 'One Size'}
                                            color={selectedColor || 'Default'}
                                            className="flex-1"
                                        />
                                    )}
                                    
                                    <button
                                        onClick={() => setIsFavorited(!isFavorited)}
                                        className="bg-white border border-gray-300 hover:border-pink-500 hover:text-pink-600 p-3 rounded-lg transition-colors"
                                    >
                                        <FaHeart className={isFavorited ? 'text-red-500' : 'text-gray-400'} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Features */}
                            <div className="space-y-3 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaTruck className="text-green-500" />
                                    <span>Free shipping on orders above ₹999</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaShieldAlt className="text-blue-500" />
                                    <span>Secure payment & easy returns</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="text-green-500 font-medium">✓</span>
                                    <span>{product.countInStock} pieces in stock</span>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Brand:</span>
                                        <span className="font-medium">{product.brand || 'Bhumika Fashion'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Material:</span>
                                        <span className="font-medium">Premium Quality Fabric</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Care:</span>
                                        <span className="font-medium">Machine Washable</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Origin:</span>
                                        <span className="font-medium">Made in India</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                key={relatedProduct._id}
                                to={`/product/${relatedProduct._id}`}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 group"
                            >
                                <div className="aspect-square mb-3 overflow-hidden rounded-md">
                                    <LazyLoadImage
                                        src={relatedProduct.image}
                                        alt={relatedProduct.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        effect="blur"
                                    />
                                </div>
                                <h3 className="font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                                    {relatedProduct.name}
                                </h3>
                                <p className="text-pink-600 font-semibold">{formatPrice(relatedProduct.price)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
            <ToastContainer />
        </div>
    );
};

export default ProductDetails;
