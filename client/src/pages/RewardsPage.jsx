import React, { useState } from 'react';

const RewardsPage = () => {
    // Mock data - in real app, fetch from API
    const [tokens, setTokens] = useState(150);

    const rewards = [
        { id: 1, title: 'Health Checkup Voucher', cost: 50, icon: '🏥' },
        { id: 2, title: 'Movie Ticket', cost: 100, icon: '🎬' },
        { id: 3, title: 'Blood Donor Badge', cost: 200, icon: '🎖️' },
        { id: 4, title: 'Gym Membership (1 Month)', cost: 500, icon: '💪' },
    ];

    const handleRedeem = (cost) => {
        if (tokens >= cost) {
            setTokens(tokens - cost);
            alert("Reward Redeemed Successfully! (Mock)");
        } else {
            alert("Insufficient Tokens!");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl relative z-10">
            <h1 className="text-4xl font-bold text-blood-700 mb-8 text-center drop-shadow-md">🩸 Blood Rewards</h1>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-xl border-2 border-blood-100 flex flex-col items-center">
                <span className="text-xl text-gray-600 mb-2">Your Balance</span>
                <div className="text-6xl font-black text-blood-600 mb-4 animate-pulse">
                    {tokens} <span className="text-2xl">Tokens</span>
                </div>
                <p className="text-gray-500 text-center">Donate blood to earn more tokens and save lives!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map(reward => (
                    <div key={reward.id} className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg border border-blood-50 hover:scale-105 transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div className="text-4xl mb-4">{reward.icon}</div>
                            <span className="bg-blood-100 text-blood-700 px-3 py-1 rounded-full text-sm font-bold">
                                {reward.cost} Tokens
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.title}</h3>
                        <button 
                            onClick={() => handleRedeem(reward.cost)}
                            className={`w-full py-2 rounded-lg font-bold transition-colors ${
                                tokens >= reward.cost 
                                ? 'bg-blood-600 text-white hover:bg-blood-700' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={tokens < reward.cost}
                        >
                            Redeem
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RewardsPage;
