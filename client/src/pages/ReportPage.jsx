import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Download, ShieldCheck } from 'lucide-react';
import FaceAuth from '../components/FaceAuth';

const ReportPage = () => {
    const [isVerifying, setIsVerifying] = useState(false);

    const handleDownloadReport = () => {
        setIsVerifying(true);
    };

    const proceedWithDownload = async () => {
        setIsVerifying(false);
        try {
            const response = await api.get('/report', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Error downloading report');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 bg-gradient-to-tr from-gray-50 to-red-50/20">
            <Navbar />
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Inventory Intelligence</h1>
                    <p className="text-xl text-gray-500 font-medium">Generate high-precision reports for hospital blood stock and regional analytics.</p>
                </div>

                <div className="max-w-xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blood-600"></div>
                    <div className="w-20 h-20 bg-blood-50 rounded-3xl flex items-center justify-center text-blood-600 mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={40} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Export Protocol</h2>
                    <p className="mb-10 text-gray-500 font-medium leading-relaxed">System-wide inventory aggregation requires secondary biometric verification for security audits.</p>
                    
                    <button 
                        onClick={handleDownloadReport} 
                        className="w-full flex items-center justify-center gap-3 px-8 py-5 text-lg font-black rounded-2xl text-white bg-blood-600 hover:bg-blood-700 hover:shadow-xl hover:shadow-blood-600/20 transition-all active:scale-95"
                    >
                        <Download size={24} /> Generate & Secure Report
                    </button>
                    
                    <p className="mt-8 text-xs font-black text-gray-400 uppercase tracking-widest italic">Encrypted Connection Established</p>
                </div>
            </div>

            {isVerifying && (
                <FaceAuth 
                    onVerify={proceedWithDownload}
                    onCancel={() => setIsVerifying(false)}
                    successMessage="Access Granted. Preparing Report..."
                />
            )}
        </div>
    );
};

export default ReportPage;
