import React, { useState, useEffect } from 'react';
import { FaImage, FaCheck, FaSearch, FaFilter } from 'react-icons/fa';
import axios from '../axiosConfig';

const PhotoLibrary = ({ onSelectPhotos, selectedPhotos = [] }) => {
    const [libraryPhotos, setLibraryPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([
        { value: 'all', label: 'All Photos' },
        { value: 'dresses', label: 'Dresses' },
        { value: 'ethnic', label: 'Ethnic Wear' },
        { value: 'tops', label: 'Tops' },
        { value: 'bottoms', label: 'Bottoms' },
        { value: 'accessories', label: 'Accessories' }
    ]);

    useEffect(() => {
        loadPhotoLibrary();
        loadCategories();
    }, []);

    const loadPhotoLibrary = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching photos from API...');
            const response = await axios.get('/photos');
            console.log('API Response:', response.data);
            setLibraryPhotos(response.data.data);
            setFilteredPhotos(response.data.data);
            console.log('Photos loaded:', response.data.data.length);
        } catch (error) {
            console.error('Error loading photo library:', error);
            console.error('Error details:', error.response?.data || error.message);
            // Fallback to empty array if API fails
            setLibraryPhotos([]);
            setFilteredPhotos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await axios.get('/photos');
            const photos = response.data.data;
            const uniqueCategories = [...new Set(photos.map(photo => photo.category))];
            const categoryOptions = [
                { value: 'all', label: 'All Photos' },
                ...uniqueCategories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
            ];
            setCategories(categoryOptions);
        } catch (error) {
            console.error('Error loading categories:', error);
            // Keep existing categories as fallback
        }
    };

    useEffect(() => {
        let filtered = libraryPhotos;
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(photo => photo.category === selectedCategory);
        }
        
        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(photo => 
                photo.name.toLowerCase().includes(searchLower) ||
                photo.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }
        
        setFilteredPhotos(filtered);
    }, [libraryPhotos, selectedCategory, searchTerm]);

    const togglePhotoSelection = (photoId) => {
        const isSelected = selectedPhotos.some(photo => photo.id === photoId);
        let newSelection;
        
        if (isSelected) {
            newSelection = selectedPhotos.filter(photo => photo.id !== photoId);
        } else {
            newSelection = [...selectedPhotos, libraryPhotos.find(photo => photo.id === photoId)];
        }
        
        onSelectPhotos(newSelection);
    };

    const isPhotoSelected = (photoId) => {
        return selectedPhotos.some(photo => photo.id === photoId);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaImage className="mr-2 text-pink-500" />
                    Photo Library
                </h3>
                
                <div className="text-sm text-gray-500">
                    {filteredPhotos.length} photos
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search photos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    {categories.map(category => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading photo library...</p>
                </div>
            ) : (
                <>
                    {/* Photo Grid */}
                    {filteredPhotos.length === 0 ? (
                        <div className="text-center py-12">
                            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No photos found</p>
                            <p className="text-sm text-gray-400 mt-2">
                                {searchTerm ? 'Try different search terms' : 'Upload some photos to get started'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                            {filteredPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                        isPhotoSelected(photo.id)
                                            ? 'border-pink-500 ring-2 ring-pink-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => togglePhotoSelection(photo.id)}
                                >
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isPhotoSelected(photo.id)
                                                ? 'bg-pink-500 border-pink-500'
                                                : 'bg-white border-gray-300'
                                        }`}>
                                            {isPhotoSelected(photo.id) && (
                                                <FaCheck className="text-white text-xs" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Photo Image */}
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={photo.thumbnail}
                                            alt={photo.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Photo Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-2">
                                        <div className="text-white text-xs">
                                            <div className="font-medium truncate">{photo.name}</div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="opacity-75">{photo.category}</span>
                                                <span className="opacity-75">{photo.size}</span>
                                            </div>
                                            <div className="flex gap-1 mt-1 opacity-75">
                                                {photo.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="bg-white bg-opacity-20 px-1 py-0.5 rounded text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {photo.tags.length > 3 && (
                                                    <span className="text-xs">+{photo.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Photos Summary */}
                    {selectedPhotos.length > 0 && (
                        <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-pink-800">
                                    {selectedPhotos.length} photos selected
                                </h4>
                                <button
                                    onClick={() => onSelectPhotos(selectedPhotos)}
                                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Use Selected Photos
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PhotoLibrary;
