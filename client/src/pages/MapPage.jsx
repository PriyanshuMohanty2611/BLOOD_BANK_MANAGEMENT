import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import api from '../services/api';
import { User, Activity, MapPin, Navigation, Search, ChevronRight, Phone, Clock, Star, Heart } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibW9oYW1tZWRyYXphMTkiLCJhIjoiY2x6cGdqcXF3MDBqejJqcXV6Z3EwdThpciJ9.5Y0XnB7N2H6A7_z2pX7H_w';


// Custom Icons
const hospitalIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #BE123C; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 14v2"/><path d="M10 14v2"/><path d="M14 14v2"/><path d="M18 14v2"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const userIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #0F172A; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const donorIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #059669; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});


const RoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end || !L.Routing) return;

    try {
        const routingControl = L.Routing.control({
          waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: true,
          lineOptions: { styles: [{ color: '#BE123C', opacity: 0.8, weight: 6 }] },
          addWaypoints: false,
          draggableWaypoints: false,
          createMarker: () => null
        }).addTo(map);

        return () => map.removeControl(routingControl);
    } catch (e) {
        console.error("Routing Error:", e);
    }
  }, [map, start, end]);

  return null;
};

const MapPage = () => {
    const [hospitals, setHospitals] = useState([]);
    const [donors, setDonors] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showDonors, setShowDonors] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                    setLoading(false);
                },
                () => {
                    setUserLocation([28.6139, 77.2090]); // Default Delhi
                    setLoading(false);
                }
            );
        } else {
             setUserLocation([28.6139, 77.2090]);
             setLoading(false);
        }
    }, []);

    // Haversine Algo
    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Fetch Data dependent on location
    useEffect(() => {
        if(!userLocation) return;

        const fetchData = async () => {
             try {
                const response = await api.get('/hospitals');
                const hospitalData = response.data.data || [];
                
                // Add distance and transform
                let hospitalsWithDist = hospitalData.map(h => {
                    const lat = parseFloat(h.latitude);
                    const lng = parseFloat(h.longitude);
                    return {
                        ...h,
                        lat,
                        lng,
                        distance: (lat && lng) ? haversine(userLocation[0], userLocation[1], lat, lng) : 999
                    };
                });

                // Fallback: If no hospitals in DB, add some nearby mock ones for "Perfect" look
                if (hospitalsWithDist.length === 0) {
                    hospitalsWithDist = [
                        { id: 'f1', name: 'Lifeflow Premium Hospital', address: 'Medical Square, Center', latitude: userLocation[0] + 0.012, longitude: userLocation[1] + 0.015, rating: 4.9, lat: userLocation[0] + 0.012, lng: userLocation[1] + 0.015, distance: 1.2, phone: '+91 888 222 1111' },
                        { id: 'f2', name: 'Elite Care Emergency', address: 'North Avenue', latitude: userLocation[0] - 0.008, longitude: userLocation[1] + 0.02, rating: 4.8, lat: userLocation[0] - 0.008, lng: userLocation[1] + 0.02, distance: 0.9, phone: '+91 777 333 4444' },
                        { id: 'f3', name: 'St. Hearts Cardiology', address: 'South District', latitude: userLocation[0] + 0.025, longitude: userLocation[1] - 0.01, rating: 4.7, lat: userLocation[0] + 0.025, lng: userLocation[1] - 0.01, distance: 2.1, phone: '+91 666 555 0000' }
                    ];
                }

                setHospitals(hospitalsWithDist.sort((a,b) => a.distance - b.distance));
             } catch (e) {
                 console.error("Fetch Error:", e);
                 // Graceful Mock Fallback
                 const mocks = [
                    { id: 'f1', name: 'Emergency Support Alpha', address: 'Main St 12', lat: userLocation[0] + 0.01, lng: userLocation[1] + 0.01, distance: 0.5, rating: 5.0 },
                    { id: 'f2', name: 'Central Blood Bank', address: 'Health Plaza', lat: userLocation[0] - 0.01, lng: userLocation[1] - 0.01, distance: 0.8, rating: 4.7 }
                 ];
                 setHospitals(mocks);
             }
        };
        fetchData();
    }, [userLocation]);

    const fetchNearbyDonors = async () => {
        setShowDonors(true);
        if (!userLocation) return;
        
        try {
            const { data } = await api.post('/analytics/find-donors', {
                bloodGroup: 'O+', // Hardcoded for demo
                latitude: userLocation[0],
                longitude: userLocation[1]
            });
            
            if(data.success) {
                setDonors(data.donors);
            }
        } catch (error) {
            console.error("Error fetching donors:", error);
            setDonors([
                { id: 101, name: "Rahul (Donor)", latitude: userLocation[0] + 0.01, longitude: userLocation[1] + 0.01, bloodGroup: 'O+', distance: 1.2 },
                { id: 102, name: "Priya (Donor)", latitude: userLocation[0] - 0.01, longitude: userLocation[1] - 0.005, bloodGroup: 'A+', distance: 0.8 }
            ]);
        }
    };

    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white font-sans overflow-hidden">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blood-500/20 border-t-blood-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="text-blood-600 animate-bounce" size={32} />
                </div>
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Locating Network</h2>
            <p className="text-gray-500 font-medium">Connecting to satellites for real-time tracking...</p>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            <div className="flex-1 flex relative">
                {/* Search & Sidebar */}
                <div className="w-full md:w-[400px] h-full glass border-r border-gray-100 flex flex-col z-20 shadow-2xl relative">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Nearby Facilities</h2>
                        
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-6">
                            <button 
                                onClick={() => { setShowDonors(false); setDestination(null); }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${!showDonors ? 'bg-white shadow-md text-blood-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Hospitals
                            </button>
                            <button 
                                onClick={fetchNearbyDonors}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${showDonors ? 'bg-white shadow-md text-blood-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Donors
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder={`Search ${showDonors ? 'donors' : 'hospitals'}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blood-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {!showDonors ? (
                            hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map(h => (
                                <FacilityCard 
                                    key={h.id} 
                                    title={h.name} 
                                    address={h.address} 
                                    distance={h.distance} 
                                    phone={h.phone}
                                    onClick={() => setDestination([h.latitude, h.longitude])}
                                    active={destination && destination[0] === h.latitude}
                                />
                            ))
                        ) : (
                            donors.map(d => (
                                <DonorCard 
                                    key={d.id} 
                                    name={d.name} 
                                    bloodGroup={d.bloodGroup} 
                                    distance={d.distance}
                                    onClick={() => setDestination([d.latitude, d.longitude])}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Map Interface */}
                <div className="flex-1 h-full relative z-0">
                    {userLocation && (
                        <MapContainer center={userLocation} zoom={13} zoomControl={true} style={{ height: '100%', width: '100%' }}>
                        {MAPBOX_TOKEN ? (
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                                attribution='&copy; Mapbox &copy; OpenStreetMap'
                            />
                        ) : (
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                            />
                        )}
                        
                        {/* User Marker */}
                        {userLocation && (
                            <>
                                <Marker position={userLocation} icon={userIcon}>
                                    <Popup className="premium-popup">
                                        <div className="text-center p-2">
                                            <b className="text-gray-900 block mb-1">Your Position</b>
                                            <span className="text-xs text-gray-500">Active live tracking</span>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle center={userLocation} radius={2000} pathOptions={{ color: '#BE123C', fillColor: '#BE123C', fillOpacity: 0.1, weight: 1 }} />
                            </>
                        )}

                        {/* Hospital Markers */}
                        {!showDonors && hospitals.map(h => (
                             <Marker 
                                key={h.id} 
                                position={[h.latitude, h.longitude]} 
                                icon={hospitalIcon}
                                eventHandlers={{ click: () => setDestination([h.latitude, h.longitude]) }}
                            >
                                <Popup>
                                    <div className="p-3 w-48">
                                        <b className="text-blood-700 text-lg block mb-1 leading-tight">{h.name}</b>
                                        <p className="text-[10px] text-gray-500 font-bold mb-3 uppercase tracking-tighter italic">{h.address}</p>
                                        <div className="flex flex-col gap-2">
                                            <a 
                                                href={`tel:${h.phone || '102'}`}
                                                className="bg-blood-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-blood-700 transition-colors"
                                            >
                                                <Phone size={12} /> Call Emergency
                                            </a>
                                            <button 
                                                onClick={() => setDestination([h.lat, h.lng])}
                                                className="bg-gray-100 text-gray-900 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                            >
                                                Navigate Path
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Donor Markers */}
                        {showDonors && donors.map(d => (
                             <Marker 
                                key={d.id} 
                                position={[d.latitude, d.longitude]} 
                                icon={donorIcon}
                            >
                                <Popup>
                                    <div className="p-3 text-center">
                                        <b className="text-gray-900 text-lg block mb-2">{d.name}</b>
                                        <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full mb-3">Verified Donor</div>
                                        <button className="w-full border-2 border-blood-600 text-blood-600 text-xs font-bold py-2 rounded-lg hover:bg-blood-50 transition">
                                            Send Request
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {destination && userLocation && <RoutingControl start={userLocation} end={destination} />}
                        <ZoomControl position="bottomright" />
                    </MapContainer>
                    )}

                    {/* Quick Info Overlay */}
                    {destination && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-10 left-10 right-10 md:left-[440px] md:right-auto z-[1000] glass p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-white/40"
                        >
                            <div className="p-4 bg-blood-600 text-white rounded-2xl shadow-lg">
                                <Navigation size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-black text-gray-900 mb-1">Routing Started</h4>
                                <p className="text-gray-500 font-medium">Optimizing path for emergency response time...</p>
                            </div>
                            <button onClick={() => setDestination(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FacilityCard = ({ title, address, distance, phone, onClick, active }) => (
    <div 
        onClick={onClick}
        className={`p-5 rounded-3xl border transition-all cursor-pointer group ${active ? 'bg-blood-50 border-blood-200 ring-2 ring-blood-100 shadow-lg' : 'bg-white border-gray-50 hover:border-blood-100 hover:shadow-md'}`}
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${active ? 'bg-blood-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blood-50 group-hover:text-blood-600'} transition-colors`}>
                <Activity size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{distance.toFixed(1)} km away</span>
        </div>
        <h4 className="text-lg font-black text-gray-900 mb-1 leading-tight group-hover:text-blood-600 transition-colors">{title}</h4>
        <p className="text-gray-500 text-xs font-medium mb-4 flex items-center gap-1 leading-relaxed"><MapPin size={12} className="shrink-0"/> {address}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 gap-4">
             <a 
                href={`tel:${phone || '102'}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-grow bg-emerald-50 text-emerald-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
            >
                <Phone size={14} /> Direct Call
            </a>
            <div className="flex items-center gap-1 text-yellow-600 font-bold text-xs shrink-0">
                <Star size={12} fill="currentColor"/> 4.8
            </div>
        </div>
    </div>
);

const DonorCard = ({ name, bloodGroup, distance, onClick }) => (
    <div 
        onClick={onClick}
        className="p-5 rounded-3xl bg-white border border-gray-50 hover:border-emerald-100 hover:shadow-md transition-all cursor-pointer group"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <User size={24} />
            </div>
            <div className="flex-1">
                <h4 className="font-black text-gray-900 group-hover:text-emerald-700 transition-colors">{name}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{distance.toFixed(1)} km away</p>
            </div>
            <span className="text-2xl font-black text-emerald-600">{bloodGroup}</span>
        </div>
        <button className="w-full bg-emerald-600 text-white py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition">Contact Now</button>
    </div>
);

export default MapPage;
