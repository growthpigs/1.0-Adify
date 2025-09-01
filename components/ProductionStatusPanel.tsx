import React from 'react';
import { AdFormat } from '../types';
import { LoadingState } from '../App';

interface ProductionStatusPanelProps {
    currentGenerationQueue: {
        formats: AdFormat[];
        currentIndex: number;
        results: any[];
    } | null;
    loadingState: LoadingState;
    isVisible: boolean;
}

export const ProductionStatusPanel: React.FC<ProductionStatusPanelProps> = ({
    currentGenerationQueue,
    loadingState,
    isVisible
}) => {
    if (!isVisible || !currentGenerationQueue) return null;

    const { formats, currentIndex } = currentGenerationQueue;
    const progress = Math.round((currentIndex / formats.length) * 100);
    const currentFormat = formats[currentIndex];

    return (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40 min-w-64">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Production Status</h3>
                <div className="text-xs font-medium text-gray-600">
                    {currentIndex + 1} / {formats.length}
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            {/* Current Format Being Generated */}
            <div className="text-sm">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-700">
                        {loadingState === 'generating_text' ? 'Generating text...' :
                         loadingState === 'generating_image' ? 'Generating image...' :
                         'Processing...'}
                    </span>
                </div>
                
                {currentFormat && (
                    <div className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                        📱 {currentFormat.name}
                    </div>
                )}
            </div>
            
            {/* Format Queue */}
            {formats.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Queue:</div>
                    <div className="flex flex-wrap gap-1">
                        {formats.map((format, index) => (
                            <div
                                key={format.id}
                                className={`text-xs px-2 py-1 rounded-full ${
                                    index < currentIndex
                                        ? 'bg-green-100 text-green-700'
                                        : index === currentIndex
                                        ? 'bg-pink-100 text-pink-700'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {index < currentIndex && '✓ '}
                                {index === currentIndex && '🎨 '}
                                {format.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};