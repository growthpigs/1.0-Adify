import React from 'react';

export const AnalysisLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-yellow-50 rounded-lg p-8 max-w-sm w-full mx-4 text-center border-2 border-yellow-200">
                {/* Banana Peeling Animation */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto relative">
                        {/* Animated Banana SVG */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" style={{ animation: 'wiggle 2s ease-in-out infinite' }}>
                            {/* Banana body */}
                            <path 
                                d="M30 50 Q20 30, 40 25 T70 30 Q80 40, 75 55 T60 70 Q45 75, 30 65 Z"
                                fill="#FFD700"
                                stroke="#FFA500"
                                strokeWidth="2"
                            />
                            {/* Peeling parts that animate */}
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
                            <path 
                                d="M65 32 Q60 17, 73 25"
                                fill="#FFF8DC"
                                stroke="#FFA500"
                                strokeWidth="1.5"
                                style={{ 
                                    transformOrigin: '65px 32px',
                                    animation: 'peel 2s ease-in-out infinite 0.6s' 
                                }}
                            />
                            {/* Banana spots */}
                            <circle cx="45" cy="45" r="2" fill="#8B4513" opacity="0.3" />
                            <circle cx="55" cy="50" r="1.5" fill="#8B4513" opacity="0.3" />
                            <circle cx="50" cy="58" r="1.8" fill="#8B4513" opacity="0.3" />
                            
                            {/* Cute face */}
                            <circle cx="42" cy="45" r="1.5" fill="#000" />
                            <circle cx="52" cy="45" r="1.5" fill="#000" />
                            <path d="M40 52 Q47 56, 54 52" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-yellow-900">
                        🍌 Analyzing Your Product...
                    </h3>
                    
                    <div className="space-y-2 text-sm text-yellow-800">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                            <span>Peeling back the details</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <span>Finding the ripe audience</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            <span>Splitting perfect strategies</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-yellow-700">
                        Going bananas to make your ads a-peel-ing!
                    </div>
                </div>
            </div>
        </div>
    );
};