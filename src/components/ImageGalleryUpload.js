import React, { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage, FaPlus } from 'react-icons/fa';

const ImageGalleryUpload = ({ images = [], onChange, maxImages = 10 }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const processFiles = (files) => {
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (validFiles.length === 0) {
            alert('Please select valid image files');
            return;
        }

        setIsUploading(true);
        
        Promise.all(validFiles.map(file => readFileAsDataURL(file)))
            .then(dataUrls => {
                const newImages = dataUrls.map((dataUrl, index) => ({
                    id: Date.now() + index,
                    url: dataUrl,
                    name: validFiles[index].name,
                    file: validFiles[index],
                    isNew: true
                }));

                const updatedImages = [...images, ...newImages].slice(0, maxImages);
                setSelectedImages(updatedImages);
                onChange(updatedImages);
                setIsUploading(false);
                
                // Clear file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            })
            .catch(error => {
                console.error('Error processing files:', error);
                setIsUploading(false);
                alert('Error processing images. Please try again.');
            });
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (imageId) => {
        const updatedImages = selectedImages.filter(img => img.id !== imageId);
        setSelectedImages(updatedImages);
        onChange(updatedImages);
    };

    const setAsMainImage = (imageId) => {
        const imageIndex = selectedImages.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;

        const updatedImages = [...selectedImages];
        const [mainImage] = updatedImages.splice(imageIndex, 1);
        updatedImages.unshift(mainImage);
        
        setSelectedImages(updatedImages);
        onChange(updatedImages);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div
                    className={`text-center ${dragActive ? 'border-pink-500 bg-pink-50' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={selectedImages.length >= maxImages}
                    />
                    
                    <div className="space-y-4">
                        {/* Upload Icon */}
                        <div className="flex justify-center">
                            <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center ${
                                dragActive ? 'border-pink-500 bg-pink-100' : 'border-gray-300'
                            }`}>
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                ) : (
                                    <FaUpload className={`text-2xl ${dragActive ? 'text-pink-500' : 'text-gray-400'}`} />
                                )}
                            </div>
                        </div>

                        <p className="text-lg font-medium text-gray-700">
                            {isUploading 
                                ? 'Processing images...' 
                                : dragActive 
                                    ? 'Drop images here' 
                                    : 'Drag & drop images here or click to browse'
                            }
                        </p>
                        
                        <p className="text-sm text-gray-500">
                            Maximum {maxImages} images. JPG, PNG, GIF up to 5MB each.
                        </p>
                    </div>

                    {/* Browse Button */}
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        disabled={selectedImages.length >= maxImages || isUploading}
                        className="mt-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                        <FaPlus className="mr-2" />
                        Choose Images
                    </button>
                </div>
            </div>

            {/* Image Preview Grid */}
            {selectedImages.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Product Images ({selectedImages.length}/{maxImages})
                        </h3>
                        <p className="text-sm text-gray-500">
                            First image will be the main product image
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedImages.map((image, index) => (
                            <div key={image.id} className="relative group">
                                <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    {/* Main Image Badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                                            Main
                                        </div>
                                    )}
                                    
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                        <button
                                            onClick={() => removeImage(image.id)}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            title="Remove image"
                                        >
                                            <FaTrash />
                                        </button>
                                        
                                        {index !== 0 && (
                                            <button
                                                onClick={() => setAsMainImage(image.id)}
                                                className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors ml-2"
                                                title="Set as main image"
                                            >
                                                <FaImage />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Image Name */}
                                <p className="mt-2 text-sm text-gray-600 truncate">
                                    {image.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGalleryUpload;
