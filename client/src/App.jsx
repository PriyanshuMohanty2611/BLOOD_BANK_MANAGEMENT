import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Search from './pages/Search';
import ReportPage from './pages/ReportPage';
import Advertisement from './pages/Advertisement';
import BloodRain from './components/BloodRain';
import CalendarPage from './pages/CalendarPage';
import RewardsPage from './pages/RewardsPage';
import CertificatePage from './pages/CertificatePage';
import Predictions from './pages/Predictions';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import EmergencySystem from './components/EmergencySystem';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
        <div className="min-h-screen flex flex-col relative">
            <Toaster position="top-center" reverseOrder={false} />
            <BloodRain />
            <Navbar />
            <Chatbot />
            <EmergencySystem />
            <div className="flex-grow">
               <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/donate-ads" element={<Advertisement />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/predictions" element={<Predictions />} />
            </Routes>
            </div>
            <Footer />
        </div>
    </Router>
  );
}

export default App;
