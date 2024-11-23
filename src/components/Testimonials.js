// src/components/Testimonials.js
import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'John Doe',
            text: 'Amazing products and quick delivery! Will definitely shop again.',
            rating: 5,
        },
        {
            name: 'Jane Smith',
            text: 'Great quality and service. Highly recommend!',
            rating: 4,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-lg italic">"{testimonial.text}"</p>
                    <h3 className="text-xl font-bold mt-4">{testimonial.name}</h3>
                    <div className="mt-2">{"★".repeat(testimonial.rating)}</div>
                </div>
            ))}
        </div>
    );
};

export default Testimonials;
