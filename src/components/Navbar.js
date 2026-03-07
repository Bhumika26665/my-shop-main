import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaThList, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'; 
import { GiShoppingBag } from 'react-icons/gi'; 
import './components.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';

const Navbar = ({ isAuthenticated }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const { logout } = useAuth();

    // Use the cart context to get the cart and its length
    const { getCartCount } = useCart(); // Cart state from context
    const cartCount = getCartCount(); // Number of items in cart (including quantities)

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

    const handleLogout = async () => {
        try {
            // Call backend logout endpoint to clear server-side cookies
            await axios.post('/users/logout');
            logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            logout();
            navigate('/');
        }
    };

    return (
       <nav className="bg-white p-4 shadow-lg sticky top-0 z-50 transition duration-300">
    <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-[#171717] text-2xl font-bold tracking-wide hover:text-[#ff4141] transition duration-300">
            ॐ साईं women's collection
        </Link>
        <Link to="/cart" className="relative text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
            <FaShoppingCart className="mr-1" />
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                </span>
            )}
            Cart
        </Link>
        <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                <FaHome className="mr-1" /> Home
            </Link>
            <Link to="/categories" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                <FaThList className="mr-1" /> Categories
            </Link>
            <Link to="/products" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                <GiShoppingBag className="mr-1" /> Products
            </Link>
            {isAuthenticated && (
                <>
                    <Link to="/admin" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                        Admin
                    </Link>
                    <Link to="/orders" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                        Orders
                    </Link>
                    <Link to="/users" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                        Users
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300 bg-transparent border-none cursor-pointer"
                    >
                        Logout
                    </button>
                </>
            )}
            {!isAuthenticated && (
                <Link to="/login" className="text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300">
                    Login
                </Link>
            )}
        </div>

        <div className="relative">
            <button onClick={toggleSearchInput} className="text-[#626262] focus:outline-none hover:text-[#ff4141]">
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
            className="md:hidden text-[#626262] focus:outline-none" 
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
                <h2 className="text-xl font-bold text-[#626262]">Menu</h2>
                <Link to="/" className="block text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300 p-2" onClick={toggleMobileMenu}>
                    <FaHome className="mr-1" /> Home
                </Link>
                <Link to="/categories" className="block text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300 p-2" onClick={toggleMobileMenu}>
                    <FaThList className="mr-1" /> Categories
                </Link>
                <Link to="/products" className="block text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300 p-2" onClick={toggleMobileMenu}>
                    <GiShoppingBag className="mr-1" /> Products
                </Link>
                <Link to="/cart" className="block text-[#626262] flex items-center hover:text-[#ff4141] transition duration-300 p-2" onClick={toggleMobileMenu}>
                    <FaShoppingCart className="mr-1" /> Cart
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
