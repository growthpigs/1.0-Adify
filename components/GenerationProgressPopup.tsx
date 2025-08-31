import React from 'react';
import { AdFormat } from '../types';

interface GenerationProgressItem {
    format: AdFormat;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    currentStep?: string;
    estimatedTime?: string;
    error?: string;
}

interface GenerationProgressPopupProps {
    items: GenerationProgressItem[];
    currentItemIndex: number;
    onCancel: () => void;
    isVisible: boolean;
}

export const GenerationProgressPopup: React.FC<GenerationProgressPopupProps> = ({
    items,
    currentItemIndex,
    onCancel,
    isVisible
}) => {
    if (!isVisible) return null;

    const currentItem = items[currentItemIndex];
    const completedCount = items.filter(item => item.status === 'completed').length;
    const totalCount = items.length;
    const progressPercentage = (completedCount / totalCount) * 100;

    const getStatusIcon = (status: GenerationProgressItem['status']) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'in_progress':
                return '🎨';
            case 'failed':
                return '❌';
            default:
                return '⏳';
        }
    };

    const getProgressSteps = (step?: string) => {
        const steps = [
            'Setting up environment',
            'Analyzing product',
            'Placing elements',
            'Final rendering'
        ];
        
        const currentStepIndex = step ? steps.indexOf(step) : 0;
        
        return (
            <div className="flex items-center space-x-2 text-sm">
                {steps.map((stepName, index) => (
                    <React.Fragment key={stepName}>
                        <span className={`${
                            index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
                        }`}>
                            {stepName}
                        </span>
                        {index < steps.length - 1 && (
                            <span className={`${
                                index < currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                            }`}>
                                →
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Generating Your Ads
                    </h2>
                    <p className="text-gray-600">
                        Creating {totalCount} professional ad formats for your product
                    </p>
                </div>

                {/* Overall Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Overall Progress
                        </span>
                        <span className="text-sm text-gray-600">
                            {completedCount} of {totalCount} completed
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Current Item */}
                {currentItem && (
                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🎨</span>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Creating {currentItem.format.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Usually takes {currentItem.estimatedTime || '10-30 seconds'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Progress Steps */}
                        <div className="mb-4">
                            {getProgressSteps(currentItem.currentStep)}
                        </div>

                        {/* Loading Animation */}
                        <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                                {currentItem.currentStep || 'Setting up environment'}...
                            </span>
                        </div>
                    </div>
                )}

                {/* Items List */}
                <div className="space-y-2 mb-8 max-h-60 overflow-y-auto">
                    {items.map((item, index) => (
                        <div 
                            key={item.format.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                                index === currentItemIndex 
                                    ? 'bg-blue-100 border border-blue-200' 
                                    : 'bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">
                                    {getStatusIcon(item.status)}
                                </span>
                                <div>
                                    <span className={`text-sm font-medium ${
                                        item.status === 'failed' ? 'text-red-600' : 'text-gray-900'
                                    }`}>
                                        {item.format.name}
                                    </span>
                                    {item.error && (
                                        <p className="text-xs text-red-600 mt-1">{item.error}</p>
                                    )}
                                </div>
                            </div>
                            
                            {item.status === 'in_progress' && (
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        💡 You can continue working while we generate your ads
                    </div>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel Generation
                    </button>
                </div>
            </div>
        </div>
    );
};