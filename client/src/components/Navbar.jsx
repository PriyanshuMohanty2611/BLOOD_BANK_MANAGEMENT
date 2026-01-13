import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, MapPin, Search, User, Menu, X, LogOut, Home, Info, Activity, FileText, Calendar, Gift, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-[1000] w-full border-b border-gray-100">
            <div className="w-full px-4 sm:px-12">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                             <div className="bg-blood-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blood-500/20">
                                <Droplet className="h-6 w-6 text-white" fill="white" />
                             </div>
                             <span className="font-extrabold text-2xl tracking-tighter text-gray-900">Life<span className="text-blood-600">Flow</span></span>
                        </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
                        <NavLink to="/" icon={<Home size={18}/>} label="Home" />
                        <NavLink to="/donate-ads" icon={<Info size={18}/>} label="Why Donate" />
                        <NavLink to="/search" icon={<Search size={18}/>} label="Find Blood" />
                        <NavLink to="/map" icon={<MapPin size={18}/>} label="Locate Hospital" />
                        <NavLink to="/predictions" icon={<Activity size={18}/>} label="Predictions" />
                        <NavLink to="/reports" icon={<Activity size={18}/>} label="Health Report" />
                        <NavLink to="/calendar" icon={<Calendar size={18}/>} label="Calendar" />
                        <NavLink to="/rewards" icon={<Gift size={18}/>} label="Rewards" />
                        
                        <div className="h-8 w-[1px] bg-gray-200 mx-4"></div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blood-600 font-semibold transition-colors">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <button onClick={handleLogout} className="flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md active:scale-95">
                                    <LogOut size={18} className="mr-2" /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary">
                                Login / Register
                            </Link>
                        )}
                    </div>

                    {/* Mobile button */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden glass border-t border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <MobileNavLink to="/" icon={<Home size={20}/>} label="Home" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/search" icon={<Search size={20}/>} label="Find Blood" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/reports" icon={<Activity size={20}/>} label="Health Report" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/rewards" icon={<Gift size={20}/>} label="Rewards" onClick={() => setIsOpen(false)} />
                        
                        <div className="my-4 border-t border-gray-100 pt-4">
                            {user ? (
                                <>
                                    <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => setIsOpen(false)} />
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition-colors">
                                        <LogOut size={20} /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="block w-full text-center px-4 py-3 rounded-xl bg-blood-600 text-white font-bold shadow-lg" onClick={() => setIsOpen(false)}>
                                    Login / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link to={to} className="flex items-center gap-1 px-2 py-2 rounded-lg text-gray-600 hover:text-blood-600 hover:bg-blood-50/50 font-semibold transition-all duration-200 group">
        <span className="text-gray-400 group-hover:text-blood-500 transition-colors">{icon}</span>
        <span className="text-[13px] whitespace-nowrap">{label}</span>
    </Link>
);

const MobileNavLink = ({ to, icon, label, onClick }) => (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-blood-600 hover:bg-blood-50 transition-colors">
        <span className="text-gray-400">{icon}</span>
        {label}
    </Link>
);

export default Navbar;
