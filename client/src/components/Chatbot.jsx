import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Mic, Send, Volume2, Sparkles, BrainCircuit, Activity, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Greetings. I am MEDI_PRINCE, your Gemini-powered Medical Intelligence. How can I assist your health journey today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        let location = {};
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            } catch (err) {
                console.warn("Location access denied or timed out");
            }
        }

        try {
            const { data } = await axios.post('http://localhost:5000/api/bot/chat', { 
                message: input,
                ...location
            });
            const botMsg = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            speak(data.reply);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Protocol disruption: Unable to synchronize with Gemini core. Please check your connection.", sender: 'bot' }]);
        }
    };

    const toggleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
        }
    };

    const speak = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        synth.speak(utterance);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[2000] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-[420px] h-[600px] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden mb-6 relative"
                    >
                        {/* Gemini Background Aura */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blood-600/10 via-indigo-500/5 to-transparent z-0"></div>
                        
                        {/* Header */}
                        <div className="px-6 py-6 flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blood-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                    <Sparkles className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 leading-none mb-1">MEDI_PRINCE</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Intelligence Active</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <ChevronDown size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar relative z-10">
                            {messages.map((msg, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={index} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                                        msg.sender === 'user' 
                                        ? 'bg-gray-900 text-white rounded-tr-sm shadow-gray-200' 
                                        : 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-50 relative z-10">
                            <div className="relative flex items-center gap-2">
                                <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-4 border border-transparent focus-within:border-blood-200 transition-all">
                                    <button 
                                        onClick={toggleVoice}
                                        className={`p-2 transition-colors ${isListening ? 'text-blood-600 animate-pulse' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Mic size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask Gemini anything..."
                                        className="flex-1 bg-transparent border-none py-4 text-sm font-bold text-gray-800 focus:ring-0 placeholder:text-gray-300"
                                    />
                                </div>
                                <button 
                                    onClick={handleSend}
                                    className="w-14 h-14 bg-blood-600 text-white rounded-2xl hover:bg-blood-700 transition-all shadow-lg flex items-center justify-center active:scale-95 shrink-0"
                                >
                                    <Send size={22} />
                                </button>
                            </div>
                            <p className="mt-4 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                Powered by Google Gemini Enterprise
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-gradient-to-br from-blood-600 via-red-500 to-indigo-700 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isOpen ? <X size={30} /> : <Sparkles size={32} className="group-hover:rotate-12 transition-transform duration-300" />}
            </motion.button>
        </div>
    );
};

export default Chatbot;
