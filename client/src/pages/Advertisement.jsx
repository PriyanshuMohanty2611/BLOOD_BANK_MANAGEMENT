import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Heart, Activity, AlertTriangle } from 'lucide-react';

const Advertisement = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative bg-blood-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                 <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80" alt="Hospital Context" className="w-full h-full object-cover opacity-10" />
                 </div>
                 <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
                        The Silent Crisis: <span className="text-blood-400">Waiting for a Miracle</span>
                    </h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blood-100 mb-10">
                        Every 2 seconds, someone in the world needs blood. For many, that wait is a matter of life and death.
                    </p>
                 </div>
            </div>

            {/* Emotional Story / Impact Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-blood-700 font-bold mb-6">
                            <AlertTriangle size={18} className="mr-2" />
                            Critical Shortage
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Imagine Watching a Loved One Fade Away...
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            It starts with an accident, a surgery complication, or a chronic illness like Thalassemia. The doctors do their best, but they need one crucial ingredient that cannot be manufactured in a factory: <strong>Human Blood</strong>.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            When blood shelves are empty, surgeries are cancelled. Cancer treatments are paused. Accident victims are left vulnerable. The pain of a family waiting for a donor is unimaginable.
                        </p>
                        <div className="border-l-4 border-blood-600 pl-6 italic text-gray-500 text-lg mb-8">
                            "I felt helpless watching my daughter fight for her life, knowing that a simple donation could save her. Please, don't let another parent go through this."
                        </div>
                        <Link to="/register" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                            <Heart className="mr-2 animate-pulse" fill="currentColor" /> Become a Donor Today
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blood-600 rounded-2xl transform rotate-3 opacity-20"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                            alt="Patient holding hand" 
                            className="relative rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why We Need You</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blood-500 text-center">
                            <div className="text-5xl font-bold text-blood-600 mb-4">1 in 7</div>
                            <p className="text-gray-600 text-lg">Hospital patients entered need blood.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blood-500 text-center">
                            <div className="text-5xl font-bold text-blood-600 mb-4">3 Lives</div>
                            <p className="text-gray-600 text-lg">Can be saved by a single pint of donation.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blood-500 text-center">
                            <div className="text-5xl font-bold text-blood-600 mb-4">&lt; 10%</div>
                            <p className="text-gray-600 text-lg">Of eligible people actually donate blood annually.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-blood-600 py-16 text-center text-white px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't Wait Until It's Too Late</h2>
                <p className="text-xl max-w-2xl mx-auto mb-10 text-blood-100">
                    Your blood is replaceable. A life is not. Join our mission to ensure no one suffers due to a lack of blood.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/register" className="bg-white text-blood-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                        Start Saving Lives
                    </Link>
                    <Link to="/map" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blood-700 transition">
                        Find Donation Center
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Advertisement;
