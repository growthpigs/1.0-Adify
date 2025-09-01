import React, { useState, useEffect } from 'react';

const generationMessages = [
    "🎨 Painting pixels like Picasso...",
    "🌟 Making it Instagram-worthy...",
    "🚀 Launching creativity rockets...",
    "✨ Sprinkling viral dust...",
    "🎭 Directing the perfect scene...",
    "🎪 Orchestrating visual magic...",
    "🌈 Blending reality and dreams...",
    "🎯 Nailing the perfect shot..."
];

const quickTips = [
    "Tip: You can regenerate for variations!",
    "Pro tip: Try different environments!",
    "Did you know? Each generation is unique!",
    "Fun fact: AI dreams in pixels!",
    "Hint: Text can be regenerated too!"
];

export const GenerationLoader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    
    useEffect(() => {
        // Rotate messages faster during generation
        const messageTimer = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % generationMessages.length);
        }, 1200);
        
        // Change tips slower
        const tipTimer = setInterval(() => {
            setTipIndex(prev => (prev + 1) % quickTips.length);
        }, 3000);
        
        // Progress animation
        const progressTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 85) return 85; // Stop at 85% until real completion
                return prev + Math.random() * 8;
            });
        }, 400);
        
        // Elapsed time counter
        const elapsedTimer = setInterval(() => {
            setElapsed(prev => prev + 0.1);
        }, 100);
        
        return () => {
            clearInterval(messageTimer);
            clearInterval(tipTimer);
            clearInterval(progressTimer);
            clearInterval(elapsedTimer);
        };
    }, []);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="rounded-lg p-6 max-w-sm w-full mx-4" style={{ backgroundColor: '#FAC625' }}>
                {/* Progress Bar with percentage */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-700 mb-1">
                        <span>Generating...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-yellow-300 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gray-900 transition-all duration-500 ease-out relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            {/* Animated shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>
                
                {/* Compact Banana GIF */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-10 h-10 relative">
                        <img 
                            src="/banana-loading-trimmed.gif" 
                            alt="Loading..." 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    
                    {/* Time elapsed */}
                    <div className="text-sm text-gray-700">
                        {elapsed.toFixed(1)}s
                    </div>
                </div>

                {/* Dynamic Message */}
                <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-gray-900 animate-pulse">
                        {generationMessages[messageIndex]}
                    </p>
                    
                    <p className="text-xs text-gray-600 italic">
                        {quickTips[tipIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
};