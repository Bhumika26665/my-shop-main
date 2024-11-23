import React from 'react';
import { useCart } from '../context/CartContext';

const ShippingDetails = () => {
    const { shippingDetails, setShippingDetails } = useCart();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const inputFields = [
        { name: 'shippingAddress1', placeholder: 'Address Line 1', required: true },
        { name: 'shippingAddress2', placeholder: 'Address Line 2' },
        { name: 'city', placeholder: 'City', required: true },
        { name: 'zip', placeholder: 'Zip Code', required: true },
        { name: 'country', placeholder: 'Country', required: true },
        { name: 'phone', placeholder: 'Phone Number', required: true },
    ];

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Shipping Details</h2>
            {inputFields.map(field => (
                <div key={field.name} className="mb-2">
                    <label htmlFor={field.name} className="block mb-1 text-sm font-medium">
                        {field.placeholder}
                    </label>
                    <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={shippingDetails[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="border p-2 w-full"
                        required={field.required}
                    />
                </div>
            ))}
        </div>
    );
};

export default ShippingDetails;
