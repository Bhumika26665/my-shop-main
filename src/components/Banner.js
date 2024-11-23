// src/components/Banner.js
import React from 'react';
import 'animate.css';  // Importing animation library

const banners = [
    {
        // image: 'https://res.cloudinary.com/dtezcrxpw/image/upload/f_auto,q_auto/v1/my-shop/ikrjprpnd784p4cbe5jo',
        image: 'https://res.cloudinary.com/dswf2lsf4/image/upload/f_auto,q_auto/v1/banner/t6iyxa1rkhckozeyxske',
        title: 'Big Saving!',
        description: "on ॐ साईं Women's collection Store.",
        button1Text: 'Shop Now',
        button2Text: 'Learn More',
    },
    {
        // image: 'https://res.cloudinary.com/dtezcrxpw/image/upload/c_scale,h_615,w_1858/samples/food/spices.jpg',
        image: 'https://res.cloudinary.com/dswf2lsf4/image/upload/f_auto,q_auto/v1/banner/qfyqe34uimdrmnkzfljo',
        title: 'Special Offer!',
        description: 'Get free shipping on all orders.',
        button1Text: 'Shop Now',
        button2Text: 'Get Details',
    },
    {
        image: 'https://via.placeholder.com/1200x400?text=Sale+Banner+3',
        title: 'Limited Time Only!',
        description: 'Exclusive deals just for you.',
        button1Text: 'Shop Now',
        button2Text: 'Discover More',
    },
];

const Banner = ({ index }) => {
    const banner = banners[index];

    return (
        <div className="">
            <div className="relative w-full overflow-hidden">
                {/* Render the banner image */}
                {banner && (
                    <div className="relative">
                        <img 
                            src={banner.image} 
                            alt={`Banner ${index + 1}`} 
                            className="w-full h-auto animate__animated animate__fadeIn banner"
                        />
                        
                        {/* Overlay Text and Buttons */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-white bg-black bg-opacity-50">
                            <h2 className="text-3xl font-bold mb-2 animate__animated animate__fadeInDown">{banner.title}</h2>
                            <p className="text-lg mb-4 animate__animated animate__fadeInUp">{banner.description}</p>
                            <div className="flex space-x-4">
                               <a href='/products' ><button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded animate__animated animate__fadeInLeft">
                                    {banner.button1Text}
                                </button></a>
                                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded animate__animated animate__fadeInRight">
                                    {banner.button2Text}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Banner;
