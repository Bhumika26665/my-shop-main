// src/pages/Categories.js
import React, { useEffect, useState } from 'react';

import CategoryList from '../components/CategoryList';
import Footer from '../components/Footer';


const Categories = () => {
 const [selectedCategory, setSelectedCategory] = useState(null);
        
    return (
       <>
       <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
       <CategoryList setSelectedCategory={setSelectedCategory} />

              
            </div>
            <Footer />
       </>    );
};

export default Categories;
