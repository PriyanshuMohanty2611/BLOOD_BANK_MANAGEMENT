import React, { useState, useEffect } from 'react';
import { Phone, Siren, X, AlertTriangle, MapPin, Ambulance, Heart, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const EmergencySystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [nearestHospital, setNearestHospital] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNearest();
        }
    }, [isOpen]);

    const fetchNearest = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await api.get(`/predictions/nearest?lat=${latitude}&lng=${longitude}`);
                    if (res.data.success && res.data.hospitals.length > 0) {
                        setNearestHospital({
                            ...res.data.hospitals[0],
                            phone: '+91 999 888 7777' // Simulated primary contact
                        });
                    }
                } catch (e) {
                    // Fallback mock
                    setNearestHospital({
                        name: 'Lifeflow Premium Hospital',
                        address: 'Medical Square, City Center',
                        phone: '+91 102',
                        distance: 1.2
                    });
                }
            });
        }
    };

    const handleAmbulanceRequest = () => {
        setIsRequesting(true);
        setTimeout(() => {
            setIsRequesting(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
            }, 3000);
        }, 2000);
    };

    return (
        <>
            {/* Floating SOS Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-32 right-8 z-[5000] w-20 h-20 bg-blood-600 text-white rounded-full shadow-[0_0_50px_rgba(190,18,60,0.5)] flex flex-col items-center justify-center border-4 border-white/20 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <Siren className="relative z-10 animate-pulse mb-1" size={32} />
                <span className="relative z-10 text-[10px] font-black uppercase tracking-tighter">SOS</span>
                
                {/* Ripples */}
                <div className="absolute inset-0 animate-ping bg-blood-600/30 rounded-full"></div>
            </motion.button>

            {/* Emergency Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-premium-dark/95 backdrop-blur-xl"
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="bg-blood-700 p-10 text-white relative">
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <AlertTriangle size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter">Emergency Response</h2>
                                </div>
                                <p className="text-blood-100 font-medium">Critical assistance is one touch away.</p>
                            </div>

                            <div className="p-10 space-y-8">
                                {success ? (
                                    <div className="py-10 text-center space-y-4">
                                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                                            <Siren size={40} className="animate-spin" />
                                        </div>
                                        <h3 className="text-3xl font-black text-emerald-600">Ambulance Dispatched</h3>
                                        <p className="text-gray-500 font-bold">Estimated arrival time: <span className="text-gray-900">4-6 minutes</span></p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Nearest Info */}
                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative group">
                                            <div className="absolute top-4 right-6 text-emerald-500 font-black text-[10px] tracking-widest uppercase flex items-center gap-1">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Active
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-white rounded-xl shadow-sm text-blood-600">
                                                    <MapPin size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900">{nearestHospital?.name || 'Searching...'}</h3>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">{nearestHospital?.distance?.toFixed(1) || '0.0'} KM AWAY</p>
                                                </div>
                                            </div>
                                            <a 
                                                href={`tel:${nearestHospital?.phone || '102'}`}
                                                className="w-full bg-white border-2 border-emerald-500 text-emerald-600 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                                            >
                                                <Phone size={20} /> Call Hospital: {nearestHospital?.phone || '102'}
                                            </a>
                                        </div>

                                        {/* Action Grid */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <button 
                                                onClick={handleAmbulanceRequest}
                                                disabled={isRequesting}
                                                className="w-full bg-blood-600 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-xl shadow-blood-600/20 active:scale-95 transition-all"
                                            >
                                                {isRequesting ? (
                                                    <div className="flex items-center gap-3">
                                                        <Ambulance className="animate-bounce" /> Processing...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Ambulance size={28} /> Request Ambulance
                                                    </>
                                                )}
                                            </button>
                                            
                                            <div className="flex gap-4">
                                                <a 
                                                    href="tel:102"
                                                    className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-colors"
                                                >
                                                    <Phone size={18} /> Call 102
                                                </a>
                                                <a 
                                                    href="tel:108"
                                                    className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-colors"
                                                >
                                                    <Phone size={18} /> Call 108
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest px-10">
                                    Misuse of emergency services is a punishable offense. Stay calm.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EmergencySystem;
