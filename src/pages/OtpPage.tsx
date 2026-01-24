import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const consumerData = location.state?.consumerData;

    const handleVerify = () => {
        setError('');
        if (otp === '123456') {
            // Proceed to dashboard or show user details
            navigate('/dashboard', { state: { consumerData } });
        } else {
            setError('Invalid OTP');
        }
    };

    return (
        <div>
            <h2>Enter OTP</h2>
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
            />
            <button onClick={handleVerify}>Verify</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default OtpPage;