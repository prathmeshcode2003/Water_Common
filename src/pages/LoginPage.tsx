import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        setError('');
        try {
            const response = await fetch(`https://localhost:44346/api/wtis/search-consumer?query=${encodeURIComponent(input)}`);
            if (!response.ok) throw new Error('User not found');
            const data = await response.json();
            // Pass data to OTP page (use state or context as needed)
            navigate('/otp', { state: { consumerData: data } });
        } catch (err: any) {
            setError('User not found');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your details"
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p>{error}</p>}
            {/* Add consumer details display and OTP navigation here */}
        </div>
    );
};

export default LoginPage;