import React from 'react';

export const GenerationLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="rounded-lg p-8 max-w-sm w-full mx-4 text-center" style={{ backgroundColor: '#FAC625' }}>
                {/* Banana Loading GIF */}
                <div className="relative mb-6" style={{ marginTop: '20px' }}>
                    <div className="w-14 h-14 mx-auto relative">
                        <img 
                            src="/banana-loading-trimmed.gif" 
                            alt="Loading..." 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Loading Text - Made 2 points bigger */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Creating Your Masterpiece
                    </h3>
                    
                    <div className="space-y-2 text-base text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                            <span>Painting your product perfectly</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <span>Adding natural environment</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            <span>Making it picture perfect</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-800">
                        Your banana is working its magic
                    </div>
                </div>
            </div>
        </div>
    );
};