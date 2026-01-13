import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Award, ShieldCheck, Printer, Share2, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CertificatePage = () => {
    const certificateRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const data = localStorage.getItem('userInfo');
            if (data) setUserData(JSON.parse(data));
        } catch (e) {
            console.error("User data error", e);
        }
    }, []);

    const downloadPDF = async () => {
        setLoading(true);
        const input = certificateRef.current;
        try {
            const canvas = await html2canvas(input, { 
                scale: 3, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`LifeFlow_Certificate_${userData?.name || 'Donor'}.pdf`);
        } catch (err) {
            console.error("PDF generation failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                
                {/* Control Panel */}
                <div className="lg:w-1/3 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-10 rounded-[3rem] border border-white shadow-2xl shadow-gray-200/50"
                    >
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-blood-600 transition-colors"
                        >
                            <ChevronLeft size={16} /> Back to Dashboard
                        </button>
                        
                        <div className="w-16 h-16 bg-blood-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blood-600/20">
                            <Award size={32} />
                        </div>
                        
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Merit of Honor</h1>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8">
                            Your selflessness saves lives. This official document certifies your contribution to the global blood bank network.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={downloadPDF}
                                disabled={loading}
                                className="w-full bg-blood-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blood-700 transition-all shadow-xl shadow-blood-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Download size={22} />} 
                                {loading ? 'Generating...' : 'Download PDF'}
                            </button>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                    <Printer size={18} /> Print
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-100 italic text-gray-400 text-sm">
                            "Every drop is a heartbeat for someone else."
                        </div>
                    </motion.div>
                </div>

                {/* Certificate Visualizer */}
                <div className="lg:w-2/3">
                    <div className="sticky top-28 overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white group">
                        <div className="overflow-auto custom-scrollbar max-h-[70vh]">
                            <div
                                ref={certificateRef}
                                className="bg-white w-[1123px] h-[794px] p-20 relative flex flex-col items-center justify-between text-center border-[24px] border-double border-blood-900"
                                style={{ transform: 'scale(1)', transformOrigin: 'top center' }}
                            >
                                {/* Intricate Background Watermark */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
                                    <Droplet className="w-[800px] h-[800px] text-blood-600 fill-current" />
                                </div>

                                {/* Premium Corner Ornaments */}
                                <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-blood-800 rounded-tl-xl opacity-20"></div>
                                <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-blood-800 rounded-tr-xl opacity-20"></div>
                                <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-blood-800 rounded-bl-xl opacity-20"></div>
                                <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-blood-800 rounded-br-xl opacity-20"></div>

                                {/* Header Section */}
                                <div className="relative z-10 w-full">
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-blood-800 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl">
                                            <ShieldCheck size={40} />
                                        </div>
                                        <div className="text-7xl font-serif text-blood-900 font-bold uppercase tracking-[0.2em] mb-2 leading-none">Certificate</div>
                                        <div className="text-2xl font-serif text-gray-400 uppercase tracking-[0.4em] font-light">Of Lifeline Contribution</div>
                                        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-blood-600 to-transparent mx-auto mt-8"></div>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="relative z-10 w-full max-w-4xl py-12">
                                    <p className="text-2xl text-gray-500 font-serif italic mb-8">This highest recognition is proudly bestowed upon</p>
                                    <div className="relative mb-12">
                                        <div className="text-6xl font-serif text-gray-900 font-black border-b-[3px] border-gray-200 pb-4 inline-block min-w-[600px] tracking-tight">
                                            {userData?.name || 'Distinguished Donor'}
                                        </div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-[3px] border-blood-600 rotate-45"></div>
                                    </div>
                                    <p className="text-2xl text-gray-700 leading-relaxed font-serif px-10">
                                        For their heroic and selfless dedication to the cause of humanity through blood donation. 
                                        Their contribution has directly impacted emergency response capabilities and offered a 
                                        second chance at life to patients within our global healthcare network.
                                    </p>
                                </div>

                                {/* Authenticity Section */}
                                <div className="relative z-10 w-full flex justify-between items-end px-20 pb-12">
                                    <div className="text-center">
                                        <div className="w-64 border-t-2 border-gray-300 pt-4 mb-2">
                                            <span className="font-serif italic text-3xl text-gray-900">Dr. Alaric Thorne</span>
                                        </div>
                                        <p className="text-blood-900 font-black uppercase text-[10px] tracking-widest">Global Medical Director</p>
                                    </div>

                                    <div className="relative group">
                                        <div className="w-40 h-40 rounded-full border-[6px] border-blood-800/10 flex items-center justify-center relative overflow-hidden transform hover:scale-110 transition-transform cursor-help">
                                            <div className="absolute inset-0 bg-blood-50/50 flex items-center justify-center">
                                                <div className="border-4 border-blood-800/20 w-32 h-32 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                                            </div>
                                            <div className="text-blood-900 font-black text-center text-[10px] leading-tight z-10">
                                                VERIFIED<br/>LIFELOW<br/>SECURE<br/>2024
                                            </div>
                                        </div>
                                        {/* Serial Number */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-[9px] font-mono text-gray-400 uppercase tracking-tighter">
                                            ID: LF-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-64 border-t-2 border-gray-300 pt-4 mb-2">
                                            <span className="text-2xl font-serif text-gray-900 font-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <p className="text-blood-900 font-black uppercase text-[10px] tracking-widest">Issue Date</p>
                                    </div>
                                </div>

                                {/* Luxury Border Accents */}
                                <div className="absolute inset-4 border border-blood-100 pointer-events-none"></div>
                            </div>
                        </div>
                        {/* Overlay to encourage download */}
                        <div className="absolute inset-0 bg-premium-dark/0 group-hover:bg-premium-dark/5 transition-colors pointer-events-none flex items-center justify-center">
                             <div className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all font-black text-blood-600 flex items-center gap-3 border border-blood-100">
                                <Award size={20} /> Preview Mode
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;
