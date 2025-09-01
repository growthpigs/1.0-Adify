import React from 'react';
import { SmartProductInput as SmartProductInputType, Industry, TargetAudience } from '../types';
import { SparklesIcon } from './Icons';

interface SmartProductInputProps {
    input: SmartProductInputType;
    isLoading: boolean;
    isDescriptionLoading: boolean;
    onInputChange: (input: SmartProductInputType) => void;
    onGenerateDescription: () => void;
}

const INDUSTRY_OPTIONS: { value: Industry; label: string }[] = [
    { value: 'saas', label: 'Software & Technology' },
    { value: 'ecommerce', label: 'E-commerce & Retail' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'fitness_wellness', label: 'Fitness & Wellness' },
    { value: 'technology', label: 'Technology & Electronics' },
    { value: 'b2b_services', label: 'B2B Services' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'travel', label: 'Travel & Hospitality' },
    { value: 'home_garden', label: 'Home & Garden' }
];

const AUDIENCE_OPTIONS: { value: TargetAudience; label: string; description: string }[] = [
    { value: 'entrepreneurs', label: 'Entrepreneurs', description: 'Startup founders, business owners' },
    { value: 'gen_z', label: 'Gen Z (18-26)', description: 'Digital natives, social-first' },
    { value: 'millennials', label: 'Millennials (27-42)', description: 'Experience-focused, tech-savvy' },
    { value: 'busy_professionals', label: 'Busy Professionals', description: 'Time-constrained workers' },
    { value: 'parents', label: 'Parents & Families', description: 'Family-focused consumers' },
    { value: 'students', label: 'Students', description: 'Budget-conscious learners' },
    { value: 'corporate_buyers', label: 'Corporate Buyers', description: 'B2B decision makers' },
    { value: 'fitness_enthusiasts', label: 'Fitness Enthusiasts', description: 'Health and wellness focused' },
    { value: 'tech_savvy', label: 'Tech-Savvy Users', description: 'Early adopters, gadget lovers' },
    { value: 'luxury_consumers', label: 'Luxury Consumers', description: 'Premium quality seekers' },
    { value: 'budget_conscious', label: 'Budget-Conscious', description: 'Value and deals focused' },
    { value: 'early_adopters', label: 'Early Adopters', description: 'Innovation enthusiasts' },
    { value: 'creative_professionals', label: 'Creative Professionals', description: 'Design and creative industry professionals' },
    { value: 'artists_designers', label: 'Artists & Designers', description: 'Visual artists, graphic designers, creatives' },
    { value: 'content_creators', label: 'Content Creators', description: 'Influencers, bloggers, social media creators' },
    { value: 'homeowners', label: 'Homeowners', description: 'People who own homes and purchase household items' }
];

const MAX_DESC_LENGTH = 800;

export const SmartProductInput: React.FC<SmartProductInputProps> = ({
    input,
    isLoading,
    isDescriptionLoading,
    onInputChange,
    onGenerateDescription
}) => {
    const updateInput = (updates: Partial<SmartProductInputType>) => {
        onInputChange({ ...input, ...updates });
    };


    return (
        <div className="space-y-3">
            {/* Analysis Status */}
            {input.analysis && input.isAnalysisConfirmed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">AI Analysis Applied</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">{input.analysis.userStory}</p>
                </div>
            )}

            {/* Product Title */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Product Title
                    </label>
                    {input.analysis && !input.isAnalysisConfirmed && (
                        <span className="text-xs text-blue-600">AI Suggested</span>
                    )}
                </div>
                <input
                    type="text"
                    value={input.title}
                    onChange={(e) => updateInput({ title: e.target.value })}
                    className="form-input w-full"
                    placeholder="e.g., Premium Coffee Brewing System"
                    disabled={isLoading}
                />
            </div>

            {/* Industry Selection */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Industry
                    </label>
                    {input.analysis && !input.isAnalysisConfirmed && (
                        <span className="text-xs text-blue-600">AI Suggested</span>
                    )}
                </div>
                <select
                    value={input.industry || ''}
                    onChange={(e) => updateInput({ industry: e.target.value as Industry || null })}
                    className="form-select w-full"
                    disabled={isLoading}
                >
                    <option value="">Select Industry</option>
                    {INDUSTRY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Target Audience */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Target Audience
                    </label>
                    {input.analysis && !input.isAnalysisConfirmed && (
                        <span className="text-xs text-blue-600">AI Suggested</span>
                    )}
                </div>
                <select
                    value={input.targetAudience || ''}
                    onChange={(e) => updateInput({ targetAudience: e.target.value as TargetAudience || null })}
                    className="form-select w-full"
                    disabled={isLoading}
                >
                    <option value="">Select Target Audience</option>
                    {AUDIENCE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Product Description */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button
                        onClick={() => {
                            console.log('🔵 CRITICAL: Generate Description button clicked!');
                            console.log('📄 Component state:', {
                                isDescriptionLoading,
                                isLoading,
                                inputTitle: input.title,
                                inputDescription: input.description
                            });
                            onGenerateDescription();
                        }}
                        disabled={isDescriptionLoading || isLoading}
                        className="btn-secondary-action text-xs"
                    >
                        <SparklesIcon className="w-3 h-3" />
                        <span>AI</span>
                    </button>
                </div>
                {isDescriptionLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-16 bg-gray-200 rounded-md"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto"></div>
                    </div>
                ) : (
                    <>
                        <textarea
                            value={input.description}
                            onChange={(e) => updateInput({ description: e.target.value })}
                            rows={2}
                            maxLength={MAX_DESC_LENGTH}
                            className="form-textarea w-full resize-y min-h-[2.5rem]"
                            placeholder="Describe your product's features, benefits, and unique value..."
                            disabled={isLoading}
                        />
                        <p className="text-right footer-text mt-1">
                            {input.description.length} / {MAX_DESC_LENGTH}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};