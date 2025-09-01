import React from 'react';
import { CheckCircleIcon, XIcon } from './Icons';

interface AnalysisCompleteNotificationProps {
    isVisible: boolean;
    onClose: () => void;
}

export const AnalysisCompleteNotification: React.FC<AnalysisCompleteNotificationProps> = ({
    isVisible,
    onClose
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XIcon className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Analysis Complete!</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                    <p>✅ <strong>Product identified and categorized</strong></p>
                    <p>✅ <strong>Target audiences selected</strong></p>
                    <p>✅ <strong>Natural environments ready</strong></p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <p className="font-medium text-blue-900 mb-1">Next Steps:</p>
                        <p className="text-blue-800">Go to the <strong>left panel</strong> to:</p>
                        <ul className="list-disc list-inside text-blue-800 mt-1 space-y-1">
                            <li>Choose your preferred environment</li>
                            <li>Add optional text style</li>
                            <li>Generate your ad</li>
                        </ul>
                    </div>
                </div>
                
                <button
                    onClick={onClose}
                    className="w-full mt-4 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};