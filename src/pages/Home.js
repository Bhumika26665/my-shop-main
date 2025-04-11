// src/pages/Home.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CategoryList from '../components/CategoryList';

import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    // const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <Navbar />
            <Banner index={0} />
            <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
            <CategoryList setSelectedCategory={setSelectedCategory} />

              
            </div>
            <FeaturedProducts />
            <Banner index={1} />
            <Footer />
        </div>
    );
};

export default Home;
