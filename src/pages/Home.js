// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <Navbar />
            <Banner index={0} />
            <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
                {/* <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full p-2 border border-gray-300 rounded-md mb-4" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                /> */}
                <CategoryList setSelectedCategory={setSelectedCategory} />
                {/* <ProductList category={selectedCategory} searchTerm={searchTerm} /> Pass searchTerm here */}
                <FeaturedProducts />
            </div>
            <Banner index={1} />
            <Footer />
        </div>
    );
};

export default Home;
