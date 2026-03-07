import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './components/Orders';
import AdminPage from './pages/AdminPage';
import Cart from './components/Cart';
import LoginPage from './pages/LoginPage';
import ProductDetails from './components/ProductDetails';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StockNotificationProvider } from './context/StockNotificationContext';
import CookieService from './services/cookieService';
import './index.css';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    // Debug authentication state
    React.useEffect(() => {
        console.log('AppContent - Auth state:', { isAuthenticated, loading });
        CookieService.debugCookies();
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <Router>
            <CartProvider>
                <StockNotificationProvider>
                    <div>
                        {/* Only show Navbar for non-admin routes */}
                        <Routes>
                            <Route path="/admin" element={null} />
                            <Route path="*" element={<Navbar isAuthenticated={isAuthenticated} />} />
                        </Routes>
                        
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/admin"
                                element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />}
                            />
                            <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
                            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
                        </Routes>
                    </div>
                </StockNotificationProvider>
            </CartProvider>
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
