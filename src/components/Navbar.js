import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaThList, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'; 
import { GiShoppingBag } from 'react-icons/gi'; 
import './components.css'; // Ensure the path is correct
import { useCart } from '../context/CartContext';
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    // Use the cart context to get the cart and its length
    const { cart } = useCart(); // Cart state from context
    const cartCount = cart.length; // Number of items in the cart

    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const toggleSearchInput = () => {
        setIsSearchVisible(prev => !prev);
        if (isSearchVisible) setSearchTerm(''); // Clear search term when hiding
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm}`);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg sticky top-0 z-50 transition duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-gray-300 transition duration-300">
                    Ankit Gangrade Kirana
                </Link>
 <Link to="/cart" className="relative text-white flex items-center hover:text-gray-300 transition duration-300">
                        <FaShoppingCart className="mr-1" />
                        {/* Show the badge only when cartCount > 0 */}
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}Cart
                    </Link>
                <div className="hidden md:flex space-x-4">
                    <Link to="/" className="text-white flex items-center hover:text-gray-300 transition duration-300">
                        <FaHome className="mr-1" /> Home
                    </Link>
                    <Link to="/categories" className="text-white flex items-center hover:text-gray-300 transition duration-300">
                        <FaThList className="mr-1" /> Categories
                    </Link>
                    <Link to="/products" className="text-white flex items-center hover:text-gray-300 transition duration-300">
                        <GiShoppingBag className="mr-1" /> Products
                    </Link>
                   
                </div>

                <div className="relative">
                    <button onClick={toggleSearchInput} className="text-white focus:outline-none">
                        <FaSearch className="w-6 h-6" />
                    </button>
                    {isSearchVisible && (
                        <form onSubmit={handleSearchSubmit} className="absolute right-0 mt-2">
                            <input
                                type="text"
                                placeholder="Search Products"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                autoFocus
                            />
                        </form>
                    )}
                </div>

                <button 
                    className="md:hidden text-white focus:outline-none" 
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <div 
                className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={toggleMobileMenu}
            >
                <div className={`fixed top-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4">
                        <h2 className="text-xl font-bold">Menu</h2>
                        <Link to="/" className="block text-gray-700 flex items-center hover:text-blue-600 transition duration-300 p-2" onClick={toggleMobileMenu}>
                            <FaHome className="mr-1" /> Home
                        </Link>
                        <Link to="/categories" className="block text-gray-700 flex items-center hover:text-blue-600 transition duration-300 p-2" onClick={toggleMobileMenu}>
                            <FaThList className="mr-1" /> Categories
                        </Link>
                        <Link to="/products" className="block text-gray-700 flex items-center hover:text-blue-600 transition duration-300 p-2" onClick={toggleMobileMenu}>
                            <GiShoppingBag className="mr-1" /> Products
                        </Link>
                        <Link to="/cart" className="block text-gray-700 flex items-center hover:text-blue-600 transition duration-300 p-2" onClick={toggleMobileMenu}>
                            <FaShoppingCart className="mr-1" /> Cart
                            {/* Show the badge only when cartCount > 0 */}
                            {cartCount > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
