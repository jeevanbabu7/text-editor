import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import app from '../../firebase.js'
import useStore from '../../zustand/store.js';


const Landing = () => {
    
    const navigate = useNavigate();
    const setUserData = useStore((state) => state.setUserData)
    const handleGoogleSubmit = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
    
          const result = await signInWithPopup(auth, provider);
    
          const res = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: {
              "Content-Type": 'application/json',
            },
            body: JSON.stringify({
              email: result.user.email
            })
          });
    
          const data = await res.json();
          setUserData(data);
          navigate('/home');
        } catch (e) {
          console.log(e.message);
        }
      }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-grey-600">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to the Text Editor App</h1>
        <button
            onClick={handleGoogleSubmit}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
            Sign in with Google
        </button>
    </div>

  );
};

export default Landing;
