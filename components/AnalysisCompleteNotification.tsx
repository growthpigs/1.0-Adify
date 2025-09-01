import React from 'react';
import { CheckCircleIcon, XIcon } from './Icons';

interface AnalysisCompleteNotificationProps {
    isVisible: boolean;
    onClose: () => void;
    onFeelingLucky?: () => void;
}

export const AnalysisCompleteNotification: React.FC<AnalysisCompleteNotificationProps> = ({
    isVisible,
    onClose,
    onFeelingLucky
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XIcon className="w-4 h-4" />
                </button>
                
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-medium text-gray-900">Analysis Complete</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Product identified and categorized</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Target audiences selected</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Natural environments ready</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    {/* Manual Setup Option */}
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-5 h-full">
                            <h4 className="font-medium text-gray-900 mb-3">Manual Setup</h4>
                            <p className="text-sm text-gray-600 mb-3">Customize every detail</p>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>• Choose your preferred environment</li>
                                <li>• Add optional text style</li>
                                <li>• Fine-tune your ad</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-4">Use the left panel to configure</p>
                        </div>
                    </div>
                    
                    {/* OR Divider */}
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-px bg-gray-300"></div>
                        <span className="text-sm font-medium text-gray-400 my-2">OR</span>
                        <div className="h-16 w-px bg-gray-300"></div>
                    </div>
                    
                    {/* Quick Start Option */}
                    <div className="flex-1">
                        <div className="bg-yellow-50 rounded-lg p-5 h-full border border-yellow-200">
                            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Go Bananas!</h4>
                            <p className="text-base text-gray-700 mb-6 leading-relaxed">
                                Skip the setup and get an instant image! We'll automatically pick the perfect natural habitat for your product.
                            </p>
                            <button
                                onClick={() => {
                                    if (onFeelingLucky) {
                                        onFeelingLucky();
                                    }
                                    onClose();
                                }}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors"
                            >
                                I'm Feeling Lucky
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};