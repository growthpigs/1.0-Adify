import React from 'react';

export const GenerationLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
                {/* AI Art Animation */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto relative">
                        {/* Pulsing palette */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
                        
                        {/* Orbiting sparkles */}
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}>
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2"></div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s'}}>
                            <div className="w-1 h-1 bg-blue-400 rounded-full absolute -bottom-1 left-1/3 transform -translate-x-1/2"></div>
                        </div>
                        
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            🎨
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        🎨 Creating Your Ad...
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                            <span>Placing your product</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <span>Adding perfect environment</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            <span>Applying professional styling</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                        Your product is being preserved in its original form!
                    </div>
                </div>
            </div>
        </div>
    );
};