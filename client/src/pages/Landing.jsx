import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store.js';

const Landing = () => {
    const navigate = useNavigate();
    const setUserData = useStore((state) => state.setUserData);

  

    const handleLogin = () => {
        navigate('/login'); // Navigate to your login page
    };

    const handleSignUp = () => {
        navigate('/signup'); // Navigate to your signup page
        
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-grey-600" style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080')" }}>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to the Text Editor App</h1>
            <div className="flex space-x-4">
                <button
                    onClick={handleLogin}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                >
                    Login
                </button>
                <button
                    onClick={handleSignUp}
                    className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Landing;
