import React from 'react';
import { LoadingState } from '../App';

interface GenerationProgressProps {
    loadingState: LoadingState;
    isNaturalEnvironment: boolean;
    selectedFormatName?: string;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
    loadingState,
    isNaturalEnvironment,
    selectedFormatName
}) => {
    if (loadingState === 'idle') return null;

    const getProgressInfo = () => {
        switch (loadingState) {
            case 'describing':
                return {
                    title: '🔍 Analyzing Image',
                    subtitle: 'Understanding your product...',
                    steps: [
                        { text: 'Reading image details', active: true },
                        { text: 'Generating description', active: false },
                        { text: 'Ready for design', active: false }
                    ]
                };
            case 'generating_text':
                return {
                    title: '✍️ Creating Copy',
                    subtitle: 'Writing the perfect slogan...',
                    steps: [
                        { text: 'Analyzing context', active: true },
                        { text: 'Generating copy variations', active: true },
                        { text: 'Creating final image', active: false }
                    ]
                };
            case 'generating_image':
                return {
                    title: isNaturalEnvironment ? '🌿 AI Auto Design' : `🎨 Creating ${selectedFormatName}`,
                    subtitle: isNaturalEnvironment 
                        ? 'AI is choosing the perfect environment and placing your product...'
                        : `Generating your ${selectedFormatName} mockup...`,
                    steps: [
                        { text: 'Setting up environment', active: true },
                        { text: 'Placing your product', active: true },
                        { text: 'Final rendering', active: true }
                    ]
                };
            case 'editing':
                return {
                    title: '✨ Editing Image',
                    subtitle: 'Making your requested changes...',
                    steps: [
                        { text: 'Processing edit request', active: true },
                        { text: 'Applying changes', active: true },
                        { text: 'Finalizing result', active: false }
                    ]
                };
            default:
                return null;
        }
    };

    const progressInfo = getProgressInfo();
    if (!progressInfo) return null;

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{progressInfo.title}</h4>
                    <p className="text-sm text-gray-600">{progressInfo.subtitle}</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-2">
                {progressInfo.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                            step.active ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                        }`} />
                        <span className={step.active ? 'text-blue-700 font-medium' : 'text-gray-500'}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* Estimated time */}
            <div className="mt-3 text-xs text-gray-500 text-center">
                {loadingState === 'generating_image' ? 'Usually takes 10-30 seconds' : 'Almost ready...'}
            </div>
        </div>
    );
};