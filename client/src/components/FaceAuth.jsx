import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Scan, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const FaceAuth = ({ onVerify, onCancel, successMessage = "Accessing secure data..." }) => {
    const webcamRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, verified, failed
    const [progress, setProgress] = useState(0);

    const startScan = () => {
        setStatus('scanning');
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setStatus('verified');
                        setTimeout(() => onVerify(), 1000);
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[6000] flex items-center justify-center bg-gray-900/90 backdrop-blur-xl p-4"
        >
            <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                    <div className="w-16 h-16 bg-blood-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blood-600/20">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Biometric Verification</h2>
                    <p className="text-gray-500 font-medium">Please position your face clearly in the frame</p>
                </div>

                {/* Webcam Container */}
                <div className="relative aspect-video bg-black overflow-hidden group">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    
                    {/* Scanning Overlay */}
                    <AnimatePresence>
                        {status === 'scanning' && (
                            <motion.div 
                                initial={{ top: '0%' }}
                                animate={{ top: ['0%', '90%', '0%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-blood-500 shadow-[0_0_20px_2px_#BE123C] z-20"
                            />
                        )}
                    </AnimatePresence>

                    {/* Status Overlays */}
                    <AnimatePresence>
                        {status === 'verified' && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-30"
                            >
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-2xl"
                                >
                                    <CheckCircle2 size={64} />
                                </motion.div>
                                <p className="mt-4 text-white font-black text-xl uppercase tracking-tighter">Identity Verified</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Corner Borders */}
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl"></div>
                    <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl"></div>
                </div>

                {/* Footer / Controls */}
                <div className="p-8 space-y-4">
                    {status === 'idle' ? (
                        <button 
                            onClick={startScan}
                            className="w-full bg-blood-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blood-700 transition-all shadow-xl shadow-blood-600/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Scan size={24} /> Start Face Scan
                        </button>
                    ) : status === 'scanning' ? (
                        <div className="space-y-4">
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    style={{ width: `${progress}%` }} 
                                    className="h-full bg-blood-600"
                                />
                            </div>
                            <p className="text-center font-bold text-gray-400 animate-pulse flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                                <Loader2 className="animate-spin" size={14} /> Analyzing Biometric Points... {progress}%
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-emerald-600 font-bold flex items-center justify-center gap-2">
                             {successMessage}
                        </div>
                    )}
                    
                    <button 
                        onClick={onCancel}
                        disabled={status === 'verified'}
                        className="w-full bg-gray-50 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                    >
                        Use Password Instead
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FaceAuth;
