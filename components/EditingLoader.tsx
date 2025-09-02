import React, { useState, useEffect } from 'react';

const editingMessages = [
    "✏️ Applying your changes...",
    "🎨 Adjusting the design...",
    "✨ Making it perfect...",
    "🔧 Fine-tuning details...",
    "🎯 Almost there..."
];

export const EditingLoader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    
    useEffect(() => {
        // Rotate messages
        const messageTimer = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % editingMessages.length);
        }, 1500);
        
        // Elapsed time counter
        const elapsedTimer = setInterval(() => {
            setElapsed(prev => prev + 0.1);
        }, 100);
        
        return () => {
            clearInterval(messageTimer);
            clearInterval(elapsedTimer);
        };
    }, []);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="rounded-lg p-6 max-w-sm w-full mx-4" style={{ backgroundColor: '#FAC625' }}>
                {/* Compact Banana GIF */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-12 h-12 relative">
                        <img 
                            src="/banana-loading-trimmed.gif" 
                            alt="Loading..." 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Title and Message */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                        Editing Image
                    </h3>
                    <p className="text-sm text-gray-700 animate-pulse">
                        {editingMessages[messageIndex]}
                    </p>
                    
                    {/* Simple progress dots */}
                    <div className="flex justify-center gap-1 mt-3">
                        {[0, 1, 2].map((i) => (
                            <div 
                                key={i}
                                className={`w-2 h-2 rounded-full bg-gray-900 ${
                                    i === messageIndex % 3 ? 'animate-bounce' : 'opacity-30'
                                }`}
                            />
                        ))}
                    </div>
                    
                    {/* Time elapsed */}
                    <p className="text-xs text-gray-600 mt-2">
                        {elapsed.toFixed(1)}s elapsed
                    </p>
                </div>
            </div>
        </div>
    );
};