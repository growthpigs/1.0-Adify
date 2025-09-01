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
                    title: 'Analyzing Image',
                    subtitle: 'Understanding your product...',
                    steps: [
                        { text: 'Reading image details', active: true },
                        { text: 'Generating description', active: false },
                        { text: 'Ready for design', active: false }
                    ]
                };
            case 'generating_text':
                return {
                    title: 'Creating Copy',
                    subtitle: 'Writing the perfect slogan...',
                    steps: [
                        { text: 'Analyzing context', active: true },
                        { text: 'Generating copy variations', active: true },
                        { text: 'Creating final image', active: false }
                    ]
                };
            case 'generating_image':
                return {
                    title: isNaturalEnvironment ? 'AI Auto Design' : `Creating ${selectedFormatName}`,
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
                    title: 'Editing Image',
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
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#FAC625' }}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center">
                    <img 
                        src="/banana-loading-trimmed.gif" 
                        alt="Loading..." 
                        className="w-full h-full object-contain"
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{progressInfo.title}</h4>
                    <p className="text-gray-600 text-base">{progressInfo.subtitle}</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-2">
                {progressInfo.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-base">
                        <div className={`w-2 h-2 rounded-full ${
                            step.active ? 'bg-gray-900 animate-pulse' : 'bg-gray-400'
                        }`} />
                        <span className={step.active ? 'text-gray-900 font-medium' : 'text-gray-700'}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* Estimated time */}
            <div className="mt-3 text-sm text-gray-800 text-center">
                {loadingState === 'generating_image' ? 'Usually takes 10-30 seconds' : 'Almost ready...'}
            </div>
        </div>
    );
};