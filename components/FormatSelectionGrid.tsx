import React from 'react';
import { AdFormat } from '../types';

interface FormatSelectionGridProps {
    formats: AdFormat[];
    category: 'mockups' | 'social' | 'facebook';
    selectedFormats: AdFormat[];
    onToggleFormat: (format: AdFormat) => void;
    getRecommendedFormats: (formats: AdFormat[], category: 'mockups' | 'social' | 'facebook') => AdFormat[];
    isFormatRecommended: (format: AdFormat, category: 'mockups' | 'social' | 'facebook') => boolean;
}

export const FormatSelectionGrid: React.FC<FormatSelectionGridProps> = ({
    formats,
    category,
    selectedFormats,
    onToggleFormat,
    getRecommendedFormats,
    isFormatRecommended
}) => {
    const recommendedFormats = getRecommendedFormats(formats, category);
    const isSelected = (format: AdFormat) => selectedFormats.some(f => f.id === format.id);
    
    // Sort formats: recommended first, then alphabetical
    const sortedFormats = [...formats].sort((a, b) => {
        const aRecommended = isFormatRecommended(a, category);
        const bRecommended = isFormatRecommended(b, category);
        
        if (aRecommended && !bRecommended) return -1;
        if (!aRecommended && bRecommended) return 1;
        
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="space-y-6">
            {/* Recommended Section */}
            {recommendedFormats.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-pink-600">🎯 Recommended for You</span>
                        <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                            Based on your product analysis
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200/80">
                        {recommendedFormats.map((format) => {
                            const Icon = format.icon;
                            const selected = isSelected(format);
                            
                            return (
                                <button
                                    key={format.id}
                                    onClick={() => onToggleFormat(format)}
                                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-105 ${
                                        selected
                                            ? 'border-pink-400 bg-pink-100 shadow-lg ring-2 ring-pink-200'
                                            : 'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Icon className={`w-5 h-5 ${selected ? 'text-pink-700' : 'text-pink-600'}`} />
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-pink-600">⭐</span>
                                            {selected && <span className="text-pink-700">✓</span>}
                                        </div>
                                    </div>
                                    <div className={`text-sm font-medium ${selected ? 'text-pink-900' : 'text-pink-800'}`}>
                                        {format.name}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* All Formats Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                        All {category === 'mockups' ? 'Mockups' : category === 'social' ? 'Social Posts' : 'Facebook Ads'} 
                        ({formats.length})
                    </span>
                    <div className="text-xs text-gray-500">
                        {selectedFormats.length} selected
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {sortedFormats.map((format) => {
                        const Icon = format.icon;
                        const selected = isSelected(format);
                        const recommended = isFormatRecommended(format, category);
                        
                        return (
                            <button
                                key={format.id}
                                onClick={() => onToggleFormat(format)}
                                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                                    selected
                                        ? 'border-blue-400 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                                        : 'border-gray-200/80 bg-white hover:border-gray-300/80 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-4 h-4 ${selected ? 'text-blue-700' : 'text-gray-600'}`} />
                                    <div className="flex items-center gap-1">
                                        {recommended && !recommendedFormats.some(f => f.id === format.id) && (
                                            <span className="text-xs text-yellow-500">⭐</span>
                                        )}
                                        {selected && <span className="text-blue-700">✓</span>}
                                    </div>
                                </div>
                                <div className={`text-xs font-medium ${selected ? 'text-blue-900' : 'text-gray-700'}`}>
                                    {format.name}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/80">
                <div className="flex gap-2">
                    <button
                        onClick={() => recommendedFormats.forEach(format => {
                            if (!isSelected(format)) onToggleFormat(format);
                        })}
                        className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                    >
                        + Select All Recommended
                    </button>
                    <button
                        onClick={() => selectedFormats.forEach(format => onToggleFormat(format))}
                        className="text-xs text-gray-500 hover:text-gray-700"
                    >
                        Clear All
                    </button>
                </div>
                <div className="text-xs text-gray-500">
                    Pro tip: Start with recommended formats for best results
                </div>
            </div>
        </div>
    );
};