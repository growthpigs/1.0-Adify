import React from 'react';

export const AnalysisLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="rounded-lg p-8 max-w-sm w-full mx-4 text-center" style={{ backgroundColor: '#FAC625' }}>
                {/* Banana Loading GIF - 40% smaller */}
                <div className="relative mb-6" style={{ marginTop: '20px' }}>
                    <div className="w-14 h-14 mx-auto relative">
                        <img 
                            src="/banana-loading-trimmed.gif" 
                            alt="Loading..." 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Analyzing Your Product
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                            <span>Finding the perfect habitat</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <span>Identifying ideal environments</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            <span>Crafting natural contexts</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-800">
                        Placing your product in its natural environment
                    </div>
                </div>
            </div>
        </div>
    );
};