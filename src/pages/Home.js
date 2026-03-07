// src/pages/Home.js
import React from 'react';
import CategoryList from '../components/CategoryList';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            {/* Enhanced Fashion Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 text-white">
                {/* Background Pattern */}
                <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>
                
                <div className="relative container mx-auto px-4 md:px-8 lg:px-16 py-24 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                                ✨ New Collection 2024
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Discover Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                                Perfect Style
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Elevate your wardrobe with our curated collection of premium ethnic wear, 
                            contemporary fashion, and timeless elegance
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="group relative px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                <span className="relative z-10">Shop New Arrivals</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300">
                                View Collections
                            </button>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-200">1000+</div>
                                <div className="text-sm text-white/80 mt-1">Products</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-200">50+</div>
                                <div className="text-sm text-white/80 mt-1">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-200">24/7</div>
                                <div className="text-sm text-white/80 mt-1">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fill-opacity="0.1"/>
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 40C840 50 960 70 1080 80C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fill-opacity="0.2"/>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Free shipping on orders above ₹999</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                            <p className="text-gray-600">100% authentic products guaranteed</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                            <p className="text-gray-600">30-day return policy on all items</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Categories Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
                            Shop by Category
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Find Your Perfect Style
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore our curated collections designed for every occasion and personality
                        </p>
                    </div>
                    <CategoryList />
                </div>
            </section>

            <FeaturedProducts />
            <Banner index={1} />
            <Footer />
        </div>
    );
};

export default Home;
