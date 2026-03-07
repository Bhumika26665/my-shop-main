import React, { useState } from 'react';

// Color mapping for common color names to hex values
const colorMap = {
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#10B981',
    'yellow': '#F59E0B',
    'purple': '#8B5CF6',
    'pink': '#EC4899',
    'black': '#000000',
    'white': '#FFFFFF',
    'brown': '#92400E',
    'gray': '#6B7280',
    'grey': '#6B7280',
    'orange': '#F97316',
    'indigo': '#6366F1',
    'teal': '#14B8A6',
    'cyan': '#06B6D4',
    'lime': '#84CC16',
    'amber': '#F59E0B',
    'emerald': '#10B981',
    'violet': '#8B5CF6',
    'fuchsia': '#D946EF',
    'rose': '#F43F5E',
    'sky': '#0EA5E9',
    'slate': '#64748B',
    'zinc': '#71717A',
    'neutral': '#737373',
    'stone': '#78716C'
};

const ColorSelector = ({ 
    availableColors = [], 
    selectedColor, 
    onColorChange, 
    className = '' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Convert product colors to the format expected by the component
    const processedColors = availableColors.map(color => {
        if (typeof color === 'string') {
            const colorName = color.toLowerCase();
            return {
                name: color.charAt(0).toUpperCase() + color.slice(1),
                value: colorMap[colorName] || '#6B7280' // Default to gray if color not found
            };
        } else if (typeof color === 'object' && color.name) {
            return {
                name: color.name,
                value: color.value || color.hex || '#6B7280'
            };
        }
        return null;
    }).filter(Boolean); // Remove any null values
    
    // If no colors provided, use default colors
    const displayColors = processedColors.length > 0 ? processedColors : [
        { name: 'Red', value: '#EF4444' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#10B981' },
        { name: 'Yellow', value: '#F59E0B' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Pink', value: '#EC4899' },
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Brown', value: '#92400E' },
        { name: 'Gray', value: '#6B7280' }
    ];
    
    const handleColorSelect = (color) => {
        onColorChange(color);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Color</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 flex justify-between items-center"
            >
                <div className="flex items-center">
                    {selectedColor && (
                        <div 
                            className="w-5 h-5 rounded-full border border-gray-300 mr-2"
                            style={{ backgroundColor: selectedColor.value }}
                        />
                    )}
                    <span className={selectedColor ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedColor ? selectedColor.name : 'Choose Color'}
                    </span>
                </div>
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
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                        {displayColors.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => handleColorSelect(color)}
                                className={`w-full px-4 py-2 text-left hover:bg-pink-50 transition-colors flex items-center ${
                                    selectedColor?.value === color.value ? 'bg-pink-100 text-pink-700 font-medium' : 'text-gray-700'
                                }`}
                            >
                                <div 
                                    className="w-5 h-5 rounded-full border border-gray-300 mr-3"
                                    style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorSelector;
