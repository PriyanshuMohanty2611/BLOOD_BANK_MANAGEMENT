import React, { useState, useEffect } from 'react';
import { Gift, Award, ShoppingBag, Star, Zap, ChevronRight, Sparkles, Wallet, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RewardsPage = () => {
    const [tokens, setTokens] = useState(1250);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const rewards = [
        { id: 1, title: 'Health Checkup Voucher', cost: 500, icon: <Award className="text-blue-500" />, desc: 'Full body screening at partnered centers' },
        { id: 2, title: 'Premium Movie Pass', cost: 300, icon: <ShoppingBag className="text-purple-500" />, desc: 'Duo entry for any cinematic screening' },
        { id: 3, title: 'LifeFlow Elite Badge', cost: 1000, icon: <Star className="text-premium-gold" />, desc: 'Exclusive profile frame and network priority' },
        { id: 4, title: 'Fitness Ecosystem', cost: 800, icon: <Zap className="text-amber-500" />, desc: '30-day access to national gym networks' },
        { id: 5, title: 'Nutrition Care Kit', cost: 450, icon: <Sparkles className="text-emerald-500" />, desc: 'Curated recovery basket for donors' },
        { id: 6, title: 'Emergency Air-Credit', cost: 2500, icon: <Zap className="text-blood-600" />, desc: 'Priority transport credits for emergencies' },
    ];

    const handleRedeem = (reward) => {
        if (tokens >= reward.cost) {
            setTokens(tokens - reward.cost);
            alert(`Reward "${reward.title}" Redeemed Successfully!`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Balance Hero */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-premium-dark rounded-[3rem] p-12 text-white overflow-hidden mb-12 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blood-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="max-w-md">
                            <div className="flex items-center gap-3 text-blood-400 font-bold text-xs uppercase tracking-[0.3em] mb-4">
                                <Sparkles size={16} /> Elite Rewards Program
                            </div>
                            <h1 className="text-5xl font-black mb-6 tracking-tighter">Turn Your Compassion Into Currency.</h1>
                            <p className="text-gray-400 font-medium">Earn tokens for every successful donation and redeem them for exclusive benefits and lifestyle rewards.</p>
                        </div>

                        <div className="glass bg-white/5 border-white/10 p-10 rounded-[2.5rem] flex items-center gap-8 shadow-2xl min-w-[320px]">
                            <div className="p-5 bg-blood-600 rounded-3xl shadow-xl shadow-blood-600/20">
                                <Wallet className="text-white" size={40} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
                                <div className="text-5xl font-black text-white">{tokens}</div>
                                <p className="text-[10px] text-blood-400 font-bold mt-2">≈ LifeFlow Credits</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filter / Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Exclusive Rewards</h2>
                        <p className="text-gray-500 font-medium italic">Curated benefits for our most dedicated lifesavers.</p>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        {['All', 'Lifestyle', 'Health', 'Special'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-premium-dark text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rewards.map((reward, index) => (
                        <motion.div 
                            key={reward.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:-translate-y-2 transition-all flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blood-50 transition-colors">
                                    {reward.icon}
                                </div>
                                <div className="flex flex-col items-end text-blood-600">
                                    <span className="text-2xl font-black">{reward.cost}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Tokens</span>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.title}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-auto">{reward.desc}</p>
                            
                            <button 
                                onClick={() => handleRedeem(reward)}
                                disabled={tokens < reward.cost}
                                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                                    tokens >= reward.cost 
                                    ? 'bg-blood-600 text-white hover:bg-blood-700 shadow-lg shadow-blood-600/10' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {tokens >= reward.cost ? 'Redeem Now' : 'Insufficient Tokens'}
                                {tokens >= reward.cost && <ChevronRight size={18} />}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-20 p-8 border-t-2 border-dashed border-gray-200 text-center max-w-2xl mx-auto">
                    <p className="text-sm text-gray-400 font-medium">
                        Rewards are subject to availability and terms of service. Tokens earned are non-transferable and can only be used within the LifeFlow ecosystem.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RewardsPage;
