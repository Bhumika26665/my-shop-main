// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
    // State variables for username, password, and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function from React Router

    const handleLogin = (e) => {
        e.preventDefault();

        // Hardcoded credentials for demonstration
        const validUsername = 'bhumika@89';
        const validPassword = 'Bhumika@09';

        if (username === validUsername && password === validPassword) {
            onLogin(); // Call the onLogin function passed as a prop
            navigate('/admin'); // Redirect to Admin Page upon successful login
        } else {
            setError('Invalid username or password'); // Set error message for invalid credentials
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl mb-4">Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded w-full p-2">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
