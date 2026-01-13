import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Download, MapPin, Activity, Heart, Calendar, User as UserIcon, Award, Timer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FaceAuth from '../components/FaceAuth';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [hospitals, setHospitals] = useState([]);
    
    // Auth States
    const [showReportAuth, setShowReportAuth] = useState(false);
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
        setShowReportAuth(true); // Require biometric verification
    };

    const proceedWithDownload = async () => {
        setShowReportAuth(false);
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
            setMessage('Error downloading report');
        }
    };

    // Mock Data for User Dashboard
    const healthData = [
        { name: 'Jan', hemoglobulin: 13.5, bp_sys: 120, bp_dia: 80, pulse: 72, weight: 68 },
        { name: 'Feb', hemoglobulin: 13.2, bp_sys: 118, bp_dia: 78, pulse: 70, weight: 68.5 },
        { name: 'Mar', hemoglobulin: 14.0, bp_sys: 122, bp_dia: 82, pulse: 74, weight: 69 },
        { name: 'Apr', hemoglobulin: 13.8, bp_sys: 121, bp_dia: 81, pulse: 71, weight: 68.8 },
        { name: 'May', hemoglobulin: 14.2, bp_sys: 119, bp_dia: 79, pulse: 69, weight: 68.2 },
    ];

    const bloodComposition = [
        { name: 'Plasma', value: 55, desc: '92% Water + Proteins' },
        { name: 'Red Cells', value: 44, desc: 'Oxygen Transport' },
        { name: 'Platelets/WBC', value: 1, desc: 'Immune Defense' },
    ];
    const COLORS = ['#FFC107', '#E11D48', '#3B82F6'];

    const donorRank = {
        level: 'Platinum Elite',
        color: 'from-blue-600 to-indigo-900',
        icon: <Award className="text-white" size={24} />,
        nextRank: 'Diamond Savior',
        progress: 85
    };

    if (!user) return <div>Please login</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blood-600 font-black text-xs uppercase tracking-[0.3em] mb-2">
                             <div className="w-2 h-2 bg-blood-600 rounded-full animate-ping"></div> Live Pulse System
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Command Center</h1>
                        <p className="text-gray-500 font-medium">Monitoring lifelines for <span className="text-gray-900 font-bold">{user.name}</span></p>
                    </div>

                    <div className="flex gap-4">
                        <div className={`p-1 rounded-[2rem] bg-gradient-to-br ${donorRank.color} shadow-2xl`}>
                            <div className="px-8 py-4 bg-black/10 backdrop-blur-3xl rounded-[1.8rem] flex items-center gap-5 border border-white/10">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
                                    {donorRank.icon}
                                </div>
                                <div className="text-white">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-none mb-1">Donor Status</p>
                                    <h2 className="text-xl font-black tracking-tight">{donorRank.level}</h2>
                                </div>
                            </div>
                        </div>

                         <div className="glass bg-white p-4 px-8 rounded-[2rem] border border-white shadow-xl flex items-center gap-6">
                             <div className="text-center">
                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Group</p>
                                 <p className="text-3xl font-black text-blood-600 leading-none">{user.bloodGroup || 'N/A'}</p>
                             </div>
                             <div className="w-px h-10 bg-gray-200"></div>
                             <div className="text-center">
                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Impact</p>
                                 <p className="text-3xl font-black text-gray-900 leading-none">15 <span className="text-xs text-blood-500 font-bold uppercase">Lives</span></p>
                             </div>
                         </div>
                    </div>
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
                    <div className="space-y-8">
                        {/* Health Parameters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <StatBox title="Hemoglobin" value="14.2" unit="g/dL" trend="+2.1%" status="Optimal" icon={<Activity className="text-blood-500" />} color="blood" />
                            <StatBox title="Blood Pressure" value="120/80" unit="mmHg" trend="Stable" status="Normal" icon={<Heart className="text-red-500" />} color="red" />
                            <StatBox title="Heart Rate" value="72" unit="bpm" trend="-1bpm" status="Resting" icon={<Activity className="text-orange-500" />} color="orange" />
                            <StatBox title="SpO2 Level" value="99" unit="%" trend="MAX" status="Excellent" icon={<Activity className="text-blue-500" />} color="blue" />
                            <StatBox title="Body Temp" value="98.6" unit="°F" trend="0.0°" status="Healthy" icon={<Activity className="text-emerald-500" />} color="emerald" />
                        </div>

                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 w-64 h-64 bg-blood-500/5 rounded-full blur-[80px] group-hover:bg-blood-500/10 transition-colors"></div>
                                         <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter flex items-center gap-3">
                                             <Activity className="text-blood-600" /> Longitudinal Biometrics
                                         </h3>
                                         <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={healthData}>
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                                                    <RechartsTooltip 
                                                        contentStyle={{backgroundColor: '#1E293B', border: 'none', borderRadius: '1rem', color: '#fff'}} 
                                                        itemStyle={{fontSize: '12px', fontWeight: '800'}}
                                                    />
                                                    <Bar dataKey="hemoglobulin" fill="#E11D48" name="Hemoglobin" radius={[6, 6, 0, 0]} />
                                                    <Bar dataKey="bp_sys" fill="#3B82F6" name="Systolic BP" radius={[6, 6, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                         </div>
                                    </div>

                                    {/* Medical Timeline */}
                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Clinical Interactions</h3>
                                            <button className="text-xs font-black text-blood-600 uppercase tracking-widest px-6 py-2 bg-blood-50 rounded-full hover:bg-blood-100 transition-all">Export Data</button>
                                        </div>
                                        <div className="space-y-6">
                                            {[1, 2, 3].map((item) => (
                                                <div key={item} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all group cursor-pointer">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                            <UserIcon size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-gray-900">Dr. Sarah Wilson</h4>
                                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">General Medical Assessment</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-gray-900">St. Mary's General</p>
                                                        <p className="text-xs font-bold text-blood-600 uppercase tracking-widest mt-1">Oct {10 + item}, 2024</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Circle Composition */}
                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                                        <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Plasma Analytics</h3>
                                        <div className="h-64 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={bloodComposition}
                                                        innerRadius={75}
                                                        outerRadius={100}
                                                        paddingAngle={8}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {bloodComposition.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-3xl font-black text-gray-900">5.2L</span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 space-y-4">
                                            {bloodComposition.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                                                        <span className="font-bold text-gray-700">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-gray-900">{item.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Next Donation Box */}
                                    <div className="bg-premium-dark p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blood-600 via-emerald-500 to-blood-600 opacity-50"></div>
                                         <div className="relative z-10">
                                            <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-6">
                                                <Calendar size={14} /> Schedule Advisor
                                            </div>
                                            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">You're almost <br/>eligible.</h3>
                                            <p className="text-gray-400 font-medium text-sm mb-8">Next full whole blood donation window opens in <span className="text-white font-bold text-lg">12 Days</span>.</p>
                                            <button className="w-full bg-blood-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blood-600/20 hover:scale-[1.02] active:scale-95 transition-all">Reserve My Slot</button>
                                         </div>
                                    </div>
                                </div>
                           </div>
                    </div>
                )}
            </div>
            {showReportAuth && (
                <FaceAuth 
                    onVerify={proceedWithDownload}
                    onCancel={() => setShowReportAuth(false)}
                />
            )}
        </div>
    );
};

const StatBox = ({ title, value, unit, trend, status, icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:border-blood-100 transition-all group overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-2 h-full bg-${color}-500/20`}></div>
        <div className="flex items-center justify-between mb-8">
             <div className={`p-4 rounded-2xl bg-gray-50 text-${color}-500 group-hover:scale-110 transition-transform`}>
                {icon}
             </div>
             <div className="text-right">
                <span className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{status}</span>
                <p className="text-xs font-bold text-emerald-500 leading-none mt-1">{trend}</p>
             </div>
        </div>
        <div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">{value} <span className="text-sm font-medium text-gray-400">{unit}</span></p>
        </div>
    </div>
);

export default Dashboard;
