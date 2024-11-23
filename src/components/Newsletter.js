// // src/components/Newsletter.js
// import React from 'react';

// const Newsletter = () => {
//     return (
//         <div className="text-center">
//             <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
//             <p className="mb-6">Get the latest deals and updates delivered to your inbox.</p>
//             <form className="flex justify-center">
//                 <input type="email" className="p-3 rounded-l-lg w-64" placeholder="Your email" />
//                 <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300">Subscribe</button>
//             </form>
//         </div>
//     );
// };

// export default Newsletter;
import React, { useState } from 'react';

const Newsletter = () => {
    // State to store the email and message entered in the form
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleWhatsAppSend = (e) => {
        e.preventDefault();
        const phoneNumber = '+916260871706';
        const whatsappMessage = `Email: ${email} \n Message: ${message}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank'); // Opens WhatsApp in a new tab

        // Clear the inputs after sending
        setEmail('');
        setMessage('');
    };

    return (
    <div>
        <h4 className="text-lg font-semibold mb-3">Support Related to Your Order</h4>
        <form onSubmit={handleWhatsAppSend} className="flex flex-col space-y-3">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3 w-full border border-gray-300 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="p-3 w-full border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
            ></textarea>
            <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md font-semibold transition duration-300 transform hover:scale-105 shadow-lg"
            >
                Send via WhatsApp
            </button>
        </form>
        <p className="text-sm text-gray-400 mt-2">Stay updated with our latest offers and products.</p>
    </div>
    );
};

export default Newsletter;
