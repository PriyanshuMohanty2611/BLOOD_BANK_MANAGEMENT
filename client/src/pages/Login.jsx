import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import FaceAuth from '../components/FaceAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showFaceAuth, setShowFaceAuth] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setPendingData(data);
            setShowFaceAuth(true); // Trigger biometric check
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleFaceVerified = () => {
        if (pendingData) {
            localStorage.setItem('userInfo', JSON.stringify(pendingData));
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or <Link to="/register" className="font-medium text-blood-600 hover:text-blood-500">create a new account</Link>
                        </p>
                    </div>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
                            <AlertCircle className="text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative">
                                <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blood-500 focus:border-blood-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blood-500 focus:border-blood-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood-600 hover:bg-blood-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood-500 transition"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Face Auth Modal */}
            {showFaceAuth && (
                <FaceAuth 
                    onVerify={handleFaceVerified} 
                    onCancel={() => setShowFaceAuth(false)} 
                />
            )}
        </div>
    );
};

export default Login;
