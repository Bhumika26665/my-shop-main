import React, { useState } from 'react';

const SizeSelector = ({ availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'], selectedSize, onSizeChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSizeSelect = (size) => {
        onSizeChange(size);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 flex justify-between items-center"
            >
                <span className={selectedSize ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedSize || 'Choose Size'}
                </span>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="py-1">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => handleSizeSelect(size)}
                                className={`w-full px-4 py-2 text-left hover:bg-pink-50 transition-colors ${
                                    selectedSize === size ? 'bg-pink-100 text-pink-700 font-medium' : 'text-gray-700'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizeSelector;
