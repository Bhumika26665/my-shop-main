import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('/login', { username, password })
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('token', token);  // Store token in localStorage
                console.log('Logged in successfully');
            })
            .catch(error => {
                console.error('Login error:', error);
            });
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            /> 
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
 