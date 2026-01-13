import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPin, Bed, Droplet, Activity, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Predictions = () => {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [predictionType, setPredictionType] = useState('stock'); // 'stock' or 'beds'
    const [bloodGroup, setBloodGroup] = useState('A+');
    const [chartData, setChartData] = useState([]);
    const [nearestHospitals, setNearestHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        fetchHospitals();
        getUserLocation();
    }, []);

    useEffect(() => {
        if (selectedHospital) {
            fetchPredictions();
        }
    }, [selectedHospital, predictionType, bloodGroup]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    fetchNearest(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location", error);
                    toast.error("Could not get your location.");
                }
            );
        }
    };

    const fetchHospitals = async () => {
        try {
            // Need a route to get all hospitals, usually exists or we pick from search
            // For now, assuming search endpoint or just generic
            const res = await axios.get('http://localhost:5000/api/hospitals'); // Assuming this exists or similar
            // If not, we might need to rely on nearest
            if(res.data.success) {
                setHospitals(res.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch hospitals");
        }
    };

    const fetchNearest = async (lat, lng) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/predictions/nearest?lat=${lat}&lng=${lng}`);
            if (res.data.success) {
                setNearestHospitals(res.data.hospitals);
                if (!selectedHospital && res.data.hospitals.length > 0) {
                    setSelectedHospital(res.data.hospitals[0].id);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to find nearest hospitals");
        }
    };

    const fetchPredictions = async () => {
        setLoading(true);
        try {
            let url = '';
            if (predictionType === 'stock') {
                url = `http://localhost:5000/api/predictions/stock/${selectedHospital}/${encodeURIComponent(bloodGroup)}`;
            } else {
                url = `http://localhost:5000/api/predictions/beds/${selectedHospital}`;
            }

            const res = await axios.get(url);
            if (res.data.success) {
                setChartData(res.data.predictions);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load predictions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 shadow-xl">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                            AI Inventory Predictions
                        </h1>
                        <p className="text-gray-400 mt-2">Forecast blood stocks and bed availability with advanced ML models.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <button 
                            onClick={getUserLocation}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                        >
                            <MapPin size={20} /> Locate Nearest
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Sidebar / Controls */}
                    <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 lg:col-span-1 space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Activity className="text-red-400" /> Configuration
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Prediction Target</label>
                                <div className="flex bg-gray-700 rounded-lg p-1">
                                    <button 
                                        onClick={() => setPredictionType('stock')}
                                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${predictionType === 'stock' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Blood Stock
                                    </button>
                                    <button 
                                        onClick={() => setPredictionType('beds')}
                                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${predictionType === 'beds' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Bed Availability
                                    </button>
                                </div>
                            </div>

                            {predictionType === 'stock' && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Blood Group</label>
                                    <select 
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className="w-full bg-gray-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500"
                                    >
                                        {bloodGroups.map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Select Hospital</label>
                                <select 
                                    value={selectedHospital || ''}
                                    onChange={(e) => setSelectedHospital(e.target.value)}
                                    className="w-full bg-gray-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select a hospital...</option>
                                    {nearestHospitals.length > 0 ? (
                                        <optgroup label="Nearest to You">
                                            {nearestHospitals.map(h => (
                                                <option key={h.id} value={h.id}>{h.name} ({h.distance.toFixed(1)} km)</option>
                                            ))}
                                        </optgroup>
                                    ) : null}
                                    {/* Fallback to full list if available */}
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Nearest List Mini-View */}
                        {nearestHospitals.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <h3 className="text-lg font-semibold mb-4 text-green-400">Nearest Centers</h3>
                                <div className="space-y-3">
                                    {nearestHospitals.map(h => (
                                        <div 
                                            key={h.id} 
                                            onClick={() => setSelectedHospital(h.id)}
                                            className={`p-3 rounded-lg cursor-pointer transition-all border ${selectedHospital == h.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'}`}
                                        >
                                            <div className="font-medium">{h.name}</div>
                                            <div className="flex justify-between text-sm text-gray-400 mt-1">
                                                <span>{h.distance.toFixed(1)} km away</span>
                                                <span className={h.availableBeds > 5 ? 'text-green-400' : 'text-red-400'}>
                                                    {h.availableBeds} beds
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                {predictionType === 'stock' ? `Blood Stock Forecast (${bloodGroup})` : 'Bed Availability Forecast'}
                            </h2>
                            {loading && <span className="text-blue-400 animate-pulse text-sm">Running ML Model...</span>}
                        </div>

                        <div className="flex-grow min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" // History
                                        name="Historical Data" 
                                        stroke="#9CA3AF" 
                                        strokeWidth={2} 
                                        dot={false}
                                        strokeDasharray="5 5"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="predicted_value" 
                                        name="Prediction" 
                                        stroke={predictionType === 'stock' ? '#EF4444' : '#3B82F6'} 
                                        strokeWidth={3}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-sm text-blue-200">
                                <span className="font-bold">AI Insight:</span> Values shown in color are generated by our linear regression model trained on the last 30 days of data. Use these trends to optimize inventory and manage bed capacity.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Predictions;
