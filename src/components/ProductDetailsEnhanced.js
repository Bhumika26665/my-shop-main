import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { motion } from 'framer-motion';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { 
    FaHeart, FaShare, FaTruck, FaShieldAlt, FaShoppingBag, 
    FaStar, FaMinus, FaPlus, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp
} from 'react-icons/fa';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import NotifyMeButton from './NotifyMeButton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Safe toast function to prevent undefined errors
const safeToast = {
    success: (message) => {
        try {
            console.log('Toast success:', message);
        } catch (error) {
            console.log('Toast error:', error);
        }
    },
    error: (message) => {
        try {
            console.log('Toast error:', message);
        } catch (error) {
            console.log('Toast error:', error);
        }
    }
};

const ProductDetailsEnhanced = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

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

    const handleAddToCart = () => {
        if (!selectedSize && product.availableSizes && product.availableSizes.length > 0) {
            safeToast.error('Please select a size');
            return;
        }
        
        const productToAdd = {
            ...product,
            selectedSize: selectedSize || 'One Size',
            selectedColor,
            quantity: quantity || 1,
            uniqueKey: `${product._id}_${selectedSize || 'default'}_${selectedColor?.name || 'default'}`
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error}</p>
                    <Link to="/products" className="mt-4 inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
                        <li>/</li>
                        <li><Link to="/products" className="hover:text-pink-600">Products</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>

                <motion.div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
                        {/* Left: Product Images */}
                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                                    <LazyLoadImage
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        effect="blur"
                                    />
                                </div>
                                
                                {/* Discount Badge */}
                                {product.discounted_price && product.discounted_price < product.price && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                        {Math.round(((product.price - product.discounted_price) / product.price) * 100)}% OFF
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={handleFavorite}
                                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                                    >
                                        <FaHeart className={isFavorited ? 'text-red-500' : 'text-gray-400'} />
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <FaShare className="text-gray-600" />
                                        </button>
                                        
                                        {showShareMenu && (
                                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl p-2 z-10">
                                                <button
                                                    onClick={() => handleShare('facebook')}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                                                >
                                                    <FaFacebook className="text-blue-600" /> Facebook
                                                </button>
                                                <button
                                                    onClick={() => handleShare('twitter')}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                                                >
                                                    <FaTwitter className="text-blue-400" /> Twitter
                                                </button>
                                                <button
                                                    onClick={() => handleShare('whatsapp')}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                                                >
                                                    <FaWhatsapp className="text-green-500" /> WhatsApp
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Product Gallery */}
                            <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all cursor-pointer">
                                        <LazyLoadImage
                                            src={product.image}
                                            alt={`${product.name} view ${i}`}
                                            className="w-full h-full object-cover"
                                            effect="blur"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="space-y-8">
                            {/* Product Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 text-sm px-4 py-2 rounded-full font-medium">
                                        {product.category?.name || 'Fashion'}
                                    </span>
                                    {product.countInStock > 0 ? (
                                        <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-medium">
                                            ✓ In Stock
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full font-medium">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                                
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                                
                                {/* Rating */}
                                {product.rating && (
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center">
                                            {renderStars(product.rating)}
                                        </div>
                                        <span className="text-gray-600">({product.numReviews || 0} reviews)</span>
                                    </div>
                                )}
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl">
                                {product.discounted_price && product.discounted_price < product.price ? (
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                            {formatPrice(product.discounted_price)}
                                        </span>
                                        <span className="text-xl text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">
                                            Save {formatPrice(product.price - product.discounted_price)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-4xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                                
                                {product.quantity_threshold && (
                                    <p className="text-sm text-green-600 font-medium">
                                        Buy {product.quantity_threshold}+ for discount price
                                    </p>
                                )}
                            </div>

                            {/* Size and Color Selection */}
                            <div className="space-y-6">
                                {product.availableSizes && product.availableSizes.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Size</label>
                                        <SizeSelector
                                            availableSizes={product.availableSizes}
                                            selectedSize={selectedSize}
                                            onSizeChange={setSelectedSize}
                                        />
                                    </div>
                                )}
                                
                                {product.availableColors && product.availableColors.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Color</label>
                                        <ColorSelector
                                            availableColors={product.availableColors}
                                            selectedColor={selectedColor}
                                            onColorChange={setSelectedColor}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                                    <div className="flex items-center border border-gray-300 rounded-full">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <FaMinus className="text-sm" />
                                        </button>
                                        <span className="px-6 py-3 min-w-[4rem] text-center font-bold text-gray-800">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <FaPlus className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.countInStock === 0}
                                        className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                                            addedToCart 
                                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                                        } disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none`}
                                    >
                                        {addedToCart ? (
                                            <>
                                                ✓ Added to Cart
                                            </>
                                        ) : (
                                            <>
                                                <FaShoppingBag className="mr-2" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    
                                    {product.countInStock === 0 && (
                                        <NotifyMeButton
                                            productId={product._id}
                                            size={selectedSize || 'One Size'}
                                            color={selectedColor || 'Default'}
                                            className="flex-1"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Product Features */}
                            <div className="space-y-4 border-t pt-6">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <FaTruck className="text-green-500" />
                                    <span>Free shipping on orders above ₹999</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <FaShieldAlt className="text-blue-500" />
                                    <span>Secure payment & easy returns</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>{product.countInStock} pieces in stock</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Product Description */}
                <motion.div
                    className="mt-12 bg-white rounded-3xl shadow-xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
                    <div className="prose prose-lg text-gray-700">
                        <p>{product.description || 'Beautiful ethnic wear perfect for any occasion.'}</p>
                    </div>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <Link
                                    key={relatedProduct._id}
                                    to={`/product/${relatedProduct._id}`}
                                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        <LazyLoadImage
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            effect="blur"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                                            {relatedProduct.name}
                                        </h3>
                                        <div className="text-lg font-bold text-gray-900">
                                            {formatPrice(relatedProduct.price)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetailsEnhanced;
