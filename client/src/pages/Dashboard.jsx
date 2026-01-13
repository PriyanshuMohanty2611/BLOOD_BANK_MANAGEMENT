import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Download, MapPin, Activity, Heart, Calendar, User as UserIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [hospitals, setHospitals] = useState([]);
    
    // Admin States
    const [newHospital, setNewHospital] = useState({ name: '', email: '', phone: '', address: '', latitude: '', longitude: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchHospitals();
        }
    }, [user]);

    const fetchHospitals = async () => {
        try {
            const { data } = await api.get('/hospitals');
            setHospitals(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddHospital = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hospitals', newHospital);
            setMessage('Hospital added successfully');
            setNewHospital({ name: '', email: '', phone: '', address: '', latitude: '', longitude: '' });
            fetchHospitals();
        } catch (error) {
            setMessage('Error adding hospital');
        }
    };

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
            setMessage('Error downloading report');
        }
    };

    // Mock Data for User Dashboard
    const healthData = [
        { name: 'Jan', hemoglobulin: 13.5, bp: 120 },
        { name: 'Feb', hemoglobulin: 13.2, bp: 118 },
        { name: 'Mar', hemoglobulin: 14.0, bp: 122 },
        { name: 'Apr', hemoglobulin: 13.8, bp: 121 },
        { name: 'May', hemoglobulin: 14.2, bp: 119 },
    ];

    const bloodComposition = [
        { name: 'Plasma', value: 55 },
        { name: 'Red Cells', value: 45 },
        { name: 'White Cells', value: 1 },
    ];
    const COLORS = ['#FFBB28', '#FF8042', '#0088FE'];

    if (!user) return <div>Please login</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user.name} ({user.role})</p>
                    </div>
                    {user.role !== 'admin' && (
                         <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex gap-4">
                             <div className="text-center">
                                 <p className="text-xs text-gray-500 uppercase">Blood Group</p>
                                 <p className="text-2xl font-bold text-blood-600">{user.bloodGroup || 'N/A'}</p>
                             </div>
                             <div className="w-px bg-gray-200"></div>
                             <div className="text-center">
                                 <p className="text-xs text-gray-500 uppercase">Donations</p>
                                 <p className="text-2xl font-bold text-gray-800">5</p>
                             </div>
                         </div>
                    )}
                </header>

                {user.role === 'admin' ? (
                    <div className="space-y-8">
                        {/* Admin Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Add Hospital */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-4 flex items-center"><Plus className="mr-2" /> Add Hospital</h2>
                                {message && <p className="mb-4 text-green-600">{message}</p>}
                                <form onSubmit={handleAddHospital} className="space-y-4">
                                    <input type="text" placeholder="Name" className="w-full border p-2 rounded" value={newHospital.name} onChange={e => setNewHospital({...newHospital, name: e.target.value})} required />
                                    <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={newHospital.email} onChange={e => setNewHospital({...newHospital, email: e.target.value})} />
                                    <input type="text" placeholder="Phone" className="w-full border p-2 rounded" value={newHospital.phone} onChange={e => setNewHospital({...newHospital, phone: e.target.value})} required />
                                    <input type="text" placeholder="Address" className="w-full border p-2 rounded" value={newHospital.address} onChange={e => setNewHospital({...newHospital, address: e.target.value})} required />
                                    <div className="flex gap-2">
                                        <input type="number" step="any" placeholder="Latitude" className="w-full border p-2 rounded" value={newHospital.latitude} onChange={e => setNewHospital({...newHospital, latitude: e.target.value})} required />
                                        <input type="number" step="any" placeholder="Longitude" className="w-full border p-2 rounded" value={newHospital.longitude} onChange={e => setNewHospital({...newHospital, longitude: e.target.value})} required />
                                    </div>
                                    <button type="submit" className="w-full bg-blood-600 text-white py-2 rounded hover:bg-blood-700">Add Hospital</button>
                                </form>
                            </div>

                            {/* Reports & Stats */}
                            <div className="bg-white p-6 rounded-lg shadow flex flex-col">
                                <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
                                <button onClick={handleDownloadReport} className="flex items-center justify-center w-full border border-gray-300 p-4 rounded hover:bg-gray-50 text-gray-700 font-medium transition mb-6">
                                    <Download className="mr-2" /> Download Inventory Report (CSV)
                                </button>
                                
                                <div className="mt-auto">
                                    <h3 className="font-medium text-gray-900 mb-2">Manage Hospitals ({hospitals.length})</h3>
                                    <div className="max-h-64 overflow-y-auto pr-2 border-t border-gray-100 pt-2">
                                        {hospitals.map(h => (
                                            <div key={h.id} className="border-b py-3 text-sm text-gray-600 flex justify-between items-center last:border-0">
                                                <div>
                                                    <p className="font-semibold">{h.name}</p>
                                                    <p className="text-xs">{h.address}</p>
                                                </div>
                                                <div className="text-gray-400">
                                                    <MapPin size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Health Parameters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Hemoglobin</h3>
                                    <Activity className="w-5 h-5 text-blood-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">14.2 <span className="text-sm text-gray-400 font-normal">g/dL</span></p>
                                <p className="text-xs text-green-500 mt-1">+2.1% from last visit</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Blood Pressure</h3>
                                    <Heart className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">120/80 <span className="text-sm text-gray-400 font-normal">mmHg</span></p>
                                <p className="text-xs text-gray-400 mt-1">Normal Range</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Heart Rate</h3>
                                    <Activity className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">72 <span className="text-sm text-gray-400 font-normal">bpm</span></p>
                                <p className="text-xs text-gray-400 mt-1">Resting</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Next Eligibility</h3>
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">12 Days</p>
                                <p className="text-xs text-blue-500 mt-1">You can help soon!</p>
                            </div>
                        </div>

                        {/* Graphs */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Health Trends</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={healthData}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar dataKey="hemoglobulin" fill="#e11d48" name="Hemoglobin (g/dL)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="bp" fill="#8884d8" name="Sys. BP (mmHg)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Blood Composition</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={bloodComposition}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {bloodComposition.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Previous History */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                                <button className="text-sm text-blood-600 hover:text-blood-800 font-medium">View All</button>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {[1, 2, 3].map((item) => (
                                        <li key={item} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <UserIcon size={20} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">Dr. Sarah Wilson</div>
                                                        <div className="text-sm text-gray-500">General Checkup</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="text-sm text-gray-900">City Hospital</div>
                                                    <div className="text-sm text-gray-500">Oct {10 + item}, 2024</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
