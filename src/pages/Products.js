// src/pages/Products.js
import React from 'react';
import ProductList from '../components/ProductList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Products = () => {
    return (
        <div className=" bg-white min-h-screen">
            <Navbar /> 

             <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Products</h1> 
            <ProductList />
            <Footer/>
        </div>
    );
};

export default Products;

