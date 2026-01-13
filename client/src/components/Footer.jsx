import React from 'react';
import { Droplet, Facebook, Twitter, Instagram, Linkedin, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="h-8 w-8 text-blood-500" fill="currentColor" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blood-400 to-red-600">
                LifeFlow
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting donors with those in need. Our mission is to ensure no life is lost due to a lack of blood.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 transition duration-300"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 transition duration-300"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 transition duration-300"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blood-600 transition duration-300"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Home</Link></li>
              <li><Link to="/map" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Locate Hospital</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Find Blood</Link></li>
              <li><Link to="/donate-ads" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Why Donate</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/rewards" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Rewards Program</Link></li>
              <li><Link to="/calendar" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Events Calendar</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-blood-400 transition flex items-center gap-2"><span className="text-blood-500">›</span> Emergency Request</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="pt-1 text-blood-500 flex-shrink-0" />
                <span>123 Life Street, Healthy City,<br />New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="text-blood-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="text-blood-500 flex-shrink-0" />
                <span>help@lifeflow.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LifeFlow Blood Management. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart size={14} className="text-red-500 fill-current animate-pulse" /> by Team LifeFlow
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
