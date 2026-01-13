import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { User, Mail, Lock, Phone, Droplet, Activity, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'donor', bloodGroup: 'A+', phone: '', age: '', weight: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', formData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="font-medium text-blood-600 hover:text-blood-500">Sign in</Link>
                        </p>
                    </div>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blood-500 focus:border-blood-500 sm:text-sm">
                                    <option value="donor">Donor</option>
                                    <option value="receiver">Receiver</option>
                                    <option value="admin">Admin (Demo)</option>
                                </select>
                            </div>

                            <div className="col-span-2 relative">
                                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input name="name" type="text" required className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2" placeholder="Full Name" onChange={handleChange} />
                            </div>

                            <div className="col-span-2 relative">
                                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input name="email" type="email" required className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2" placeholder="Email Address" onChange={handleChange} />
                            </div>

                            <div className="col-span-2 relative">
                                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input name="password" type="password" required className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2" placeholder="Password" onChange={handleChange} />
                            </div>

                            <div className="relative">
                                <Droplet className="absolute top-3 left-3 text-gray-400" size={18} />
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2">
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>

                            <div className="relative">
                                <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input name="phone" type="text" className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2" placeholder="Phone" onChange={handleChange} />
                            </div>
                             
                            <div className="relative">
                                <input name="age" type="number" className="pl-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2" placeholder="Age" onChange={handleChange} />
                            </div>

                            <div className="relative">
                                <input name="weight" type="number" className="pl-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blood-500 focus:border-blood-500 sm:text-sm py-2" placeholder="Weight (kg)" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blood-600 hover:bg-blood-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood-500 transition">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
