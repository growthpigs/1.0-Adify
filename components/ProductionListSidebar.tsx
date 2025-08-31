import React from 'react';
import { AdFormat } from '../types';

interface ProductionItem {
    id: string;
    format: AdFormat;
    status: 'queued' | 'generating' | 'completed' | 'failed';
    timestamp: Date;
    imageUrl?: string;
    error?: string;
    estimatedCompletion?: Date;
}

interface ProductionListSidebarProps {
    items: ProductionItem[];
    onItemClick: (item: ProductionItem) => void;
    onRetry: (item: ProductionItem) => void;
    onRemove: (item: ProductionItem) => void;
    currentGeneratingId?: string;
    isVisible: boolean;
}

export const ProductionListSidebar: React.FC<ProductionListSidebarProps> = ({
    items,
    onItemClick,
    onRetry,
    onRemove,
    currentGeneratingId,
    isVisible
}) => {
    if (!isVisible) return null;

    const queuedItems = items.filter(item => item.status === 'queued');
    const generatingItems = items.filter(item => item.status === 'generating');
    const completedItems = items.filter(item => item.status === 'completed');
    const failedItems = items.filter(item => item.status === 'failed');

    const getStatusColor = (status: ProductionItem['status']) => {
        switch (status) {
            case 'completed': return 'text-green-600';
            case 'generating': return 'text-blue-600';
            case 'failed': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: ProductionItem['status']) => {
        switch (status) {
            case 'completed': return '✅';
            case 'generating': return '🎨';
            case 'failed': return '❌';
            default: return '⏳';
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getEstimatedWait = (position: number) => {
        const averageTime = 25; // seconds per item
        const totalWait = position * averageTime;
        
        if (totalWait < 60) {
            return `~${totalWait}s`;
        } else {
            return `~${Math.round(totalWait / 60)}m`;
        }
    };

    return (
        <div className="w-80 bg-gray-50 border-r border-gray-200 h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Production Queue
                    </h2>
                    <div className="text-sm text-gray-500">
                        {items.length} total
                    </div>
                </div>
                
                {/* Queue Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                            {generatingItems.length + queuedItems.length}
                        </div>
                        <div className="text-xs text-blue-600">In Queue</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                            {completedItems.length}
                        </div>
                        <div className="text-xs text-green-600">Completed</div>
                    </div>
                </div>
            </div>

            {/* Production List */}
            <div className="flex-1 overflow-y-auto">
                {/* Currently Generating */}
                {generatingItems.length > 0 && (
                    <div className="p-4 border-b border-gray-200 bg-blue-50">
                        <h3 className="text-sm font-semibold text-blue-800 mb-3">
                            🎨 Currently Generating
                        </h3>
                        {generatingItems.map((item) => (
                            <div 
                                key={item.id}
                                className="bg-white rounded-lg p-3 shadow-sm border border-blue-200"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{getStatusIcon(item.status)}</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.format.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => onRemove(item)}
                                        className="text-xs text-gray-400 hover:text-red-500"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex items-center space-x-1 mb-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    <span className="text-xs text-blue-600 ml-2">Generating...</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Started {formatTime(item.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Queue */}
                {queuedItems.length > 0 && (
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            ⏳ In Queue ({queuedItems.length})
                        </h3>
                        <div className="space-y-2">
                            {queuedItems.map((item, index) => (
                                <div 
                                    key={item.id}
                                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                    onClick={() => onItemClick(item)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{getStatusIcon(item.status)}</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.format.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(item);
                                            }}
                                            className="text-xs text-gray-400 hover:text-red-500"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Position #{index + 1}</span>
                                        <span>{getEstimatedWait(index + 1)} wait</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed */}
                {completedItems.length > 0 && (
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-green-700 mb-3">
                            ✅ Completed ({completedItems.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {completedItems.slice(0, 8).map((item) => (
                                <div 
                                    key={item.id}
                                    className="relative group cursor-pointer"
                                    onClick={() => onItemClick(item)}
                                >
                                    {item.imageUrl ? (
                                        <img 
                                            src={item.imageUrl}
                                            alt={item.format.name}
                                            className="w-full h-20 object-cover rounded-lg border border-gray-200 group-hover:border-gray-300"
                                        />
                                    ) : (
                                        <div className="w-full h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                            <span className="text-xs text-gray-500">No preview</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                                    <div className="absolute bottom-1 left-1 right-1">
                                        <div className="bg-white/90 backdrop-blur-sm rounded px-1 py-0.5">
                                            <div className="text-xs font-medium text-gray-900 truncate">
                                                {item.format.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {completedItems.length > 8 && (
                            <div className="text-center mt-3">
                                <button className="text-xs text-green-600 hover:text-green-700 font-medium">
                                    View all {completedItems.length} completed items
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Failed */}
                {failedItems.length > 0 && (
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-red-700 mb-3">
                            ❌ Failed ({failedItems.length})
                        </h3>
                        <div className="space-y-2">
                            {failedItems.map((item) => (
                                <div 
                                    key={item.id}
                                    className="bg-red-50 rounded-lg p-3 border border-red-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{getStatusIcon(item.status)}</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.format.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onRetry(item)}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Retry
                                            </button>
                                            <button
                                                onClick={() => onRemove(item)}
                                                className="text-xs text-gray-400 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                    {item.error && (
                                        <div className="text-xs text-red-600 bg-red-100 rounded p-2">
                                            {item.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {items.length === 0 && (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">🎨</div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Production Queue Empty
                        </h3>
                        <p className="text-xs text-gray-500">
                            Select formats from the AI popup to start generating ads
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="text-xs text-gray-500 text-center">
                    💡 Click on completed items to view or download
                </div>
            </div>
        </div>
    );
};