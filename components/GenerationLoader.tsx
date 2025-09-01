import React from 'react';

export const GenerationLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-yellow-50 rounded-lg p-8 max-w-sm w-full mx-4 text-center border-2 border-yellow-200">
                {/* Banana Creating Art Animation */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto relative">
                        {/* Animated Banana with Paintbrush */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" style={{ animation: 'wiggle 2s ease-in-out infinite' }}>
                            {/* Banana body */}
                            <path 
                                d="M30 50 Q20 30, 40 25 T70 30 Q80 40, 75 55 T60 70 Q45 75, 30 65 Z"
                                fill="#FFD700"
                                stroke="#FFA500"
                                strokeWidth="2"
                            />
                            {/* Peeling parts */}
                            <path 
                                d="M40 25 Q35 10, 48 18"
                                fill="#FFF8DC"
                                stroke="#FFA500"
                                strokeWidth="1.5"
                                style={{ 
                                    transformOrigin: '40px 25px',
                                    animation: 'peel 2s ease-in-out infinite' 
                                }}
                            />
                            <path 
                                d="M55 28 Q50 13, 63 21"
                                fill="#FFF8DC"
                                stroke="#FFA500"
                                strokeWidth="1.5"
                                style={{ 
                                    transformOrigin: '55px 28px',
                                    animation: 'peel 2s ease-in-out infinite 0.3s' 
                                }}
                            />
                            
                            {/* Paintbrush in banana's "hand" */}
                            <rect x="65" y="40" width="3" height="15" fill="#8B4513" transform="rotate(45 65 40)" />
                            <rect x="63" y="38" width="7" height="4" fill="#FF69B4" transform="rotate(45 65 40)" />
                            
                            {/* Paint drops */}
                            <circle cx="75" cy="45" r="1.5" fill="#FF69B4" opacity="0.7" className="animate-bounce" />
                            <circle cx="72" cy="52" r="1" fill="#87CEEB" opacity="0.7" className="animate-bounce" style={{animationDelay: '0.2s'}} />
                            <circle cx="78" cy="50" r="1.2" fill="#98FB98" opacity="0.7" className="animate-bounce" style={{animationDelay: '0.4s'}} />
                            
                            {/* Banana spots */}
                            <circle cx="45" cy="45" r="2" fill="#8B4513" opacity="0.3" />
                            <circle cx="55" cy="50" r="1.5" fill="#8B4513" opacity="0.3" />
                            
                            {/* Cute concentrated face */}
                            <line x1="40" y1="43" x2="43" y2="43" stroke="#000" strokeWidth="1.5" />
                            <line x1="50" y1="43" x2="53" y2="43" stroke="#000" strokeWidth="1.5" />
                            <circle cx="47" cy="52" r="2" fill="#FF69B4" opacity="0.3" />
                        </svg>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-yellow-900">
                        🍌 Creating Your Masterpiece...
                    </h3>
                    
                    <div className="space-y-2 text-sm text-yellow-800">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                            <span>Painting your product perfectly</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <span>Adding natural environment</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            <span>Making it picture perfect</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-yellow-700">
                        Your banana is working its magic! 🎨
                    </div>
                </div>
            </div>
        </div>
    );
};