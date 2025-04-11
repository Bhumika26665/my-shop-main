// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductCard = ({ product }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
        <Link to={`/product/${product.id}`}>
            <LazyLoadImage
                src={product.image}
                alt={product.name}
                effect="blur"
                className="w-full h-48 object-cover rounded-md"
            />
        </Link>
        <div className="mt-4 text-center">
            <Link to={`/product/${product.id}`} className="text-lg font-semibold text-gray-800 hover:text-gray-600">{product.name}</Link>
            <p className="mt-2 text-gray-600">₹{product.price}</p>
        </div>
    </div>
);

export default ProductCard;
