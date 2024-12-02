import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Newsletter from './Newsletter';

const Footer = () => {
    const latitude = 21.639727808935934;  // Example Latitude
    const longitude = 78.27353820897305; // Example Longitude

    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 lg:px-0">
                {/* Map Embed */}
                <div className="mb-8 lg:mb-0">
                    <h3 className="text-xl font-bold mb-4">Our Location</h3>
                    <iframe
                        src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=k&z=15&ie=UTF8&iwloc=&output=embed`} // 't=k' for satellite view
                        frameBorder="0"
                        style={{ border: 0, width: '100%', height: '300px' }} // Increased height
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex="0"
                        className="transition-transform duration-500 transform hover:scale-105 rounded-lg shadow-lg"
                    ></iframe>
                </div>

                {/* Information Sections */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Privacy Policy */}
                    {/* <div>
                        <h4 className="text-lg font-semibold mb-3">Privacy Policy</h4>
                        <p className="text-sm leading-relaxed text-gray-300">
                            We are committed to protecting your privacy. All information collected is used only to provide you with a better shopping experience.
                        </p>
                    </div> */}

                    {/* Terms and Conditions */}
                    {/* <div>
                        <h4 className="text-lg font-semibold mb-3">Terms and Conditions</h4>
                        <p className="text-sm leading-relaxed text-gray-300">
                            By using our site, you agree to our terms and conditions. Please review them carefully before making any purchases.
                        </p>
                    </div> */}

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
                        <p className="text-sm leading-relaxed text-gray-300">
                            Support Number: <a href="tel:+918817173959" className="text-blue-400 hover:text-blue-300 transition duration-300">+91 8817173959</a>
                        </p>
                        {/* <p className="text-sm leading-relaxed text-gray-300 mt-2">
                            Email: <a href="mailto:support@eshop.com" className="text-blue-400 hover:text-blue-300 transition duration-300">support@eshop.com</a>
                        </p> */}
                    </div>
                    <Newsletter />
                </div>
            </div>

            {/* Social Media Links */}
            <div className="container mx-auto flex justify-center space-x-6 mt-10">
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-gray-400 hover:text-white transition duration-300"
                >
                    <FaFacebook size={24} />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-gray-400 hover:text-white transition duration-300"
                >
                    <FaTwitter size={24} />
                </a>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gray-400 hover:text-white transition duration-300"
                >
                    <FaInstagram size={24} />
                </a>
            </div>

            {/* Copyright */}
            <div className="text-center mt-12">
                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} <a href='https://bhumika-portfolio.onrender.com' target='_blank'>Bhumika Pandey.</a> All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
 
export default Footer;
