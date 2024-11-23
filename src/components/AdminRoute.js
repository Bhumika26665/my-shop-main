// frontend/src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    if (!decodedToken.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
