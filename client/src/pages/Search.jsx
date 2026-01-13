import React, { useState } from 'react';
import { MapPin, Search as SearchIcon, Filter, Hospital, Droplets, Phone, Clock, Star, ExternalLink, Activity } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
    const [bloodGroup, setBloodGroup] = useState('A+');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.get(`/inventory?bloodGroup=${encodeURIComponent(bloodGroup)}`);
            setResults(data);
            setSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            
            {/* Page Header */}
            <div className="bg-premium-dark py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blood-600/5 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-white mb-6"
                    >
                        Find Blood <span className="text-blood-500">Instantly</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Search across our global network of verified hospitals and blood banks to find the exact match you need.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-24">
                {/* Search Box */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-16"
                >
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-8 py-4 bg-gray-50 rounded-[2rem] border border-transparent focus-within:border-blood-200 transition-all">
                            <Droplets className="text-blood-500 mr-4" size={24} />
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Blood Group Needed</label>
                                <select 
                                    value={bloodGroup} 
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                    className="block w-full bg-transparent border-none p-0 text-xl font-bold text-gray-900 focus:ring-0 cursor-pointer"
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center px-8 py-4 bg-gray-50 rounded-[2rem] border border-transparent focus-within:border-blood-200 transition-all">
                            <MapPin className="text-gray-400 mr-4" size={24} />
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</label>
                                <input 
                                    type="text" 
                                    placeholder="Near your current location"
                                    className="block w-full bg-transparent border-none p-0 text-xl font-bold text-gray-900 placeholder:text-gray-300 focus:ring-0"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blood-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-blood-700 transition-all shadow-xl shadow-blood-600/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                            {loading ? <Activity className="animate-spin" /> : <SearchIcon size={24} />}
                            {loading ? 'Searching...' : 'Find Matches'}
                        </button>
                    </form>
                </motion.div>

                {/* Results Section */}
                <AnimatePresence>
                    {searched && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <h2 className="text-3xl font-black text-gray-900">
                                    {results.length} Matches <span className="text-gray-400 font-medium text-xl ml-2">Found for {bloodGroup}</span>
                                </h2>
                                <button className="flex items-center gap-2 text-gray-500 font-bold hover:text-blood-600 transition-colors">
                                    <Filter size={18} /> Refine Search
                                </button>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {results.length > 0 ? results.map((item, idx) => (
                                    <ResultCard key={item._id || idx} item={item} />
                                )) : (
                                    <div className="col-span-full py-24 text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                            <SearchIcon size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No direct matches found</h3>
                                        <p className="text-gray-500 font-medium">Try broadening your search or contact our emergency hotline.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ResultCard = ({ item }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8 group transition-all"
    >
        <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-blood-50 rounded-2xl flex items-center justify-center text-blood-600 group-hover:bg-blood-600 group-hover:text-white transition-all duration-300">
                <Hospital size={32} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-blood-600 mb-1">{item.bloodGroup}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Stock</span>
            </div>
        </div>

        <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blood-600 transition-colors">{item.hospital?.name || 'Central Health Services'}</h3>
            <p className="text-gray-500 font-medium flex items-start gap-2">
                <MapPin size={18} className="text-blood-400 mt-1 shrink-0" />
                {item.hospital?.address || '123 Medical Drive, Wellness City'}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rating</span>
                <div className="flex items-center gap-1 text-yellow-600 font-black">
                    <Star size={14} fill="currentColor" /> 4.9
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">In Stock</span>
                <div className="text-gray-900 font-black">{item.quantity} Units</div>
            </div>
        </div>

        <div className="flex gap-3">
            <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blood-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                Request Now
            </button>
            <button className="w-14 h-14 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center">
                <ExternalLink size={20} />
            </button>
        </div>
    </motion.div>
);

export default Search;
