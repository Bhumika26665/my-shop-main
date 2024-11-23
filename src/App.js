import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './components/Orders';
import Admin from './pages/AdminPage';
import Cart from './components/Cart';
import LoginPage from './pages/LoginPage';
import ProductDetails from './components/ProductDetails'; // Import ProductDetails component
import Navbar from './components/Navbar'; // Import Navbar for navigation
import './index.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
    const [searchTerm, setSearchTerm] = useState(''); // Track search term

    const handleLogin = () => {
        setIsAuthenticated(true); // Set authentication state to true
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // Set authentication state to false
    };

    return (
        <Router>
            <div>
               
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/products" element={<Products searchTerm={searchTerm} />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route
                        path="/admin"
                        element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} // Protect the admin route
                    />
                    <Route path="/users" element={<Users />} /> {/* Route for Users */}
                    <Route path="/orders" element={<Orders />} /> {/* Route for Orders */}
                    {/* Add other routes as necessary */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
