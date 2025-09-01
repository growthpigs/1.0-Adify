import React, { useState, useEffect } from 'react';

const funMessages = [
    "🍌 Peeling back the layers...",
    "🎨 Mixing the perfect colors...",
    "✨ Sprinkling magic dust...",
    "🚀 Warming up the engines...",
    "🎯 Finding your sweet spot...",
    "🌟 Polishing the pixels...",
    "🎪 Setting up the show...",
    "🎭 Getting into character..."
];

export const AnalysisLoader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        // Rotate messages every 800ms
        const messageTimer = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % funMessages.length);
        }, 800);
        
        // Smooth progress animation
        const progressTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return 90; // Stop at 90% until real completion
                return prev + Math.random() * 15;
            });
        }, 300);
        
        return () => {
            clearInterval(messageTimer);
            clearInterval(progressTimer);
        };
    }, []);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="rounded-lg p-6 max-w-sm w-full mx-4" style={{ backgroundColor: '#FAC625' }}>
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="h-2 bg-yellow-300 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gray-900 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                
                {/* Banana Loading GIF - Smaller */}
                <div className="relative mb-4">
                    <div className="w-12 h-12 mx-auto relative">
                        <img 
                            src="/banana-loading-trimmed.gif" 
                            alt="Loading..." 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Dynamic Message */}
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 animate-pulse">
                        {funMessages[messageIndex]}
                    </p>
                    
                    <p className="text-xs text-gray-700 mt-2">
                        Hang tight, magic happens fast!
                    </p>
                </div>
            </div>
        </div>
    );
};