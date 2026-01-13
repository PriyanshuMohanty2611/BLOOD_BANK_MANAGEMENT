import React from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Download } from 'lucide-react';

const ReportPage = () => {
    const handleDownloadReport = async () => {
        try {
            const response = await api.get('/report', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
            alert('Error downloading report');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="mb-4 text-gray-600">Generate and download the latest inventory report.</p>
                    <button onClick={handleDownloadReport} className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition">
                        <Download className="mr-2" /> Download Inventory Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
