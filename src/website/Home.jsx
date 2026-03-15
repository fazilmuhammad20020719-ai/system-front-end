// src/website/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Our Website</h1>
            <p>Ithu thaan unga website oda mudhal page (Landing Page).</p>

            {/* Admin Login Button */}
            <Link to="/login">
                <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                    Admin Login
                </button>
            </Link>
        </div>
    );
};

export default Home;