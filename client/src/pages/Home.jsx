import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Activity, MapPin, ArrowRight, ShieldCheck, Clock, Hospital, Star, HeartPulse, ChevronRight, Search, Phone } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-premium-dark/95 z-[1]"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615461166324-cd9f9a46677c?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 animate-pulse-slow"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blood-600/20 rounded-full blur-[120px] z-0 animate-blob"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blood-900/40 rounded-full blur-[120px] z-0 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-[-5rem]">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blood-400 text-sm font-bold mb-8 shadow-2xl">
                            <span className="flex h-2 w-2 rounded-full bg-blood-500 animate-pulse"></span>
                            Trusted by 500+ Hospitals Globally
                        </div>
                        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
                            Save Lives with <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood-400 via-red-500 to-blood-600">Every Heartbeat</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            The world's most advanced blood management ecosystem. Connecting heroes with those in need, instantly.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/register" className="px-10 py-5 bg-blood-600 text-white rounded-2xl font-bold text-xl hover:bg-blood-700 transition-all shadow-2xl shadow-blood-600/40 flex items-center justify-center gap-3 group hover:-translate-y-1">
                                Become a Donor <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link to="/search" className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 group hover:-translate-y-1">
                                Find Blood <Search size={22} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
                
                {/* Scroll Indicator */}
                <motion.div 
                   animate={{ y: [0, 15, 0] }}
                   transition={{ repeat: Infinity, duration: 2.5 }}
                   className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-8 h-14 border-2 border-white/20 rounded-full flex justify-center p-2 backdrop-blur-md">
                        <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* Live Statistics */}
            <StatsSection />

            {/* Why Choose Us */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-blood-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Excellence</span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">Technology Powered <br/>by Compassion</h2>
                            <p className="text-xl text-gray-500 font-medium">We've reimagined blood management to be faster, safer, and more accessible than ever before.</p>
                        </div>
                        <Link to="/donate-ads" className="flex items-center gap-2 text-blood-600 font-bold text-lg hover:gap-4 transition-all">
                            Learn more about our impact <ChevronRight />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard 
                            icon={<MapPin size={32} />} 
                            title="Precision Mapping" 
                            desc="Real-time geo-synchronization connects you to the nearest available blood supply in seconds."
                            gradient="from-blue-500 to-indigo-600"
                        />
                        <FeatureCard 
                            icon={<HeartPulse size={32} />} 
                            title="Predictive AI" 
                            desc="Proprietary algorithms forecast demand trends to prevent shortages before they even happen."
                            gradient="from-blood-500 to-blood-700"
                        />
                        <FeatureCard 
                            icon={<ShieldCheck size={32} />} 
                            title="Blockchain Verified" 
                            desc="Securing every drop with immutable verification records for maximum safety and trust."
                            gradient="from-emerald-500 to-teal-600"
                        />
                    </div>
                </div>
            </section>

            {/* Best Hospitals Snapshot */}
            <section className="py-32 bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Top Partner Hospitals</h2>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">Providing world-class facilities and emergency response services.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <HospitalCard name="City Medical Center" location="Downtown" rating={4.9} units={120} phone="+91 888 222 1111" />
                        <HospitalCard name="St. Mary's General" location="Westside" rating={4.8} units={85} phone="+91 102" />
                        <HospitalCard name="Apex Care Hospital" location="North Square" rating={4.7} units={210} phone="+91 777 333 4444" />
                        <HospitalCard name="Heritage Health" location="South View" rating={4.9} units={65} phone="+91 108" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto bg-premium-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blood-600/10 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">Ready to be someone's Hero?</h2>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Your verification takes less than 2 minutes. Start your journey of saving lives today.</p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/register" className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:bg-blood-50 transition-all hover:scale-105">
                                Start Donating
                            </Link>
                            <Link to="/map" className="px-10 py-5 border-2 border-white/20 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">
                                Locate Facilities
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ icon, count, label }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="flex flex-col items-center p-8 bg-white rounded-3xl group transition-all"
    >
        <div className="w-16 h-16 bg-blood-50 rounded-2xl flex items-center justify-center text-blood-600 mb-6 group-hover:bg-blood-600 group-hover:text-white transition-all duration-300 shadow-sm">
            {icon}
        </div>
        <h3 className="text-5xl font-black text-gray-900 mb-2 leading-none">{count}</h3>
        <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">{label}</p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, gradient }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 hover:border-blood-100 transition-all duration-500 group relative overflow-hidden hover:-translate-y-2">
        <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center text-white mb-10 shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
            {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-6">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-lg font-medium">{desc}</p>
    </div>
);

const HospitalCard = ({ name, location, rating, units, phone }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blood-100 transition-all group flex flex-col">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-600 group-hover:bg-blood-50 group-hover:text-blood-600 transition-colors">
                <Hospital size={24} />
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                <Star size={14} fill="currentColor" /> {rating}
            </div>
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-1">{name}</h4>
        <p className="text-gray-500 text-sm mb-6 flex items-center gap-1"><MapPin size={14}/> {location}</p>
        
        <div className="mt-auto space-y-4">
            <a 
                href={`tel:${phone}`}
                className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
                <Phone size={14} /> Call Emergency
            </a>
            
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Stock</span>
                <span className="text-blood-600 font-black">{units} Units</span>
            </div>
        </div>
    </div>
);

const StatsSection = () => {
    const [stats, setStats] = useState({ donors: 1240, livesSaved: 4820, hospitals: 42, bloodUnits: 850 });

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/analytics/stats');
            const data = await res.json();
            if(data.success) {
                const s = data.stats;
                // Calculate total blood units from inventory array
                const totalUnits = s.inventory?.reduce((acc, curr) => acc + parseInt(curr.totalQuantity || 0), 0) || 0;
                
                const donorCount = parseInt(s.totalDonors || 0);
                setStats({
                    donors: donorCount,
                    hospitals: s.totalHospitals || 0,
                    bloodUnits: totalUnits,
                    livesSaved: (donorCount * 3) + 400 
                });
            }
        } catch (e) {
            console.error("Stats fetch error", e);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="px-4 relative z-20 -mt-24">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-1 p-2 bg-gray-100/50 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/20">
                <StatCard icon={<Users size={32} />} count={`${stats.donors}+`} label="Active Donors" />
                <StatCard icon={<Heart size={32} />} count={`${stats.livesSaved}+`} label="Lives Saved" />
                <StatCard icon={<Activity size={32} />} count={`${stats.bloodUnits}`} label="Blood Units" />
                <StatCard icon={<Hospital size={32} />} count={`${stats.hospitals}+`} label="Partner Hospitals" />
            </div>
        </section>
    );
};

export default Home;
