import React, { useState } from 'react';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());

    // Simple calendar logic
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateDays = () => {
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-4"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(
                <div key={i} className="p-4 border border-amber-900/20 text-center font-serif hover:bg-amber-100/50 cursor-pointer transition">
                    <span className="text-amber-900 font-bold text-lg">{i}</span>
                    {/* Mock events */}
                    {i === 14 && <div className="text-xs text-red-600 mt-1">🩸 Donation Camp</div>}
                    {i === 22 && <div className="text-xs text-blue-600 mt-1">🏥 Health Talk</div>}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="container mx-auto p-6 min-h-screen flex items-center justify-center relative z-10">
            {/* Parchment Background Effect */}
            <div className="bg-[#f4e4bc] p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl w-full border-8 border-double border-amber-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                     style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")'}}></div>
                
                <header className="flex justify-between items-center mb-8 border-b-4 border-amber-900/50 pb-4">
                    <button className="text-amber-900 text-4xl font-serif hover:scale-110 transition" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
                        ☜
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-amber-900 uppercase tracking-widest drop-shadow-sm">
                            {monthNames[date.getMonth()]}
                        </h1>
                        <p className="text-amber-800 font-serif text-xl tracking-widest">{date.getFullYear()}</p>
                    </div>
                    <button className="text-amber-900 text-4xl font-serif hover:scale-110 transition" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
                        ☞
                    </button>
                </header>

                <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-serif font-bold text-amber-900 uppercase tracking-wider">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 bg-[#fffbf0] border-4 border-amber-900/30">
                    {generateDays()}
                </div>

                <div className="mt-8 text-center font-serif text-amber-900/70 italic">
                    "The blood you donate gives someone another chance at life."
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
