import React, { useState, useEffect, useRef } from 'react';
import { SmartProductAnalysis, Industry, TargetAudience, AdFormat, SloganType } from '../types';
import { SparklesIcon, CheckCircleIcon, EditIcon } from './Icons';
import { AD_FORMATS, SOCIAL_MEDIA_FORMATS, FACEBOOK_AD_FORMATS } from '../constants';
import { FormatSelectionGrid } from './FormatSelectionGrid';

interface SmartAnalysisPopupProps {
    analysis: SmartProductAnalysis;
    isVisible: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onEdit: () => void;
    onClose: () => void;
    onUpdateAnalysis: (updates: Partial<SmartProductAnalysis>) => void;
    onGenerate: (selectedFormats: AdFormat[]) => void;
    selectedSloganType?: SloganType | null;
    onSelectSloganType?: (type: SloganType | null) => void;
}

type TabType = 'analysis' | 'mockups' | 'social' | 'facebook';

const INDUSTRY_LABELS: Record<Industry, string> = {
    saas: 'Software & Technology',
    ecommerce: 'E-commerce & Retail',
    fashion: 'Fashion & Apparel',
    food_beverage: 'Food & Beverage',
    fitness_wellness: 'Fitness & Wellness',
    technology: 'Technology & Electronics',
    b2b_services: 'B2B Services',
    automotive: 'Automotive',
    real_estate: 'Real Estate',
    education: 'Education & Learning',
    healthcare: 'Healthcare & Medical',
    finance: 'Finance & Banking',
    entertainment: 'Entertainment & Media',
    travel: 'Travel & Hospitality',
    home_garden: 'Home & Garden'
};

const AUDIENCE_LABELS: Record<TargetAudience, string> = {
    entrepreneurs: 'Entrepreneurs',
    gen_z: 'Gen Z (18-26)',
    millennials: 'Millennials (27-42)',
    busy_professionals: 'Busy Professionals',
    parents: 'Parents & Families',
    students: 'Students',
    corporate_buyers: 'Corporate Buyers',
    fitness_enthusiasts: 'Fitness Enthusiasts',
    tech_savvy: 'Tech-Savvy Users',
    luxury_consumers: 'Luxury Consumers',
    budget_conscious: 'Budget-Conscious',
    early_adopters: 'Early Adopters',
    creative_professionals: 'Creative Pros',
    artists_designers: 'Artists & Designers',
    content_creators: 'Content Creators',
    homeowners: 'Homeowners'
};

export const SmartAnalysisPopup: React.FC<SmartAnalysisPopupProps> = ({
    analysis,
    isVisible,
    isLoading = false,
    onConfirm,
    onEdit,
    onClose,
    onUpdateAnalysis,
    onGenerate,
    selectedSloganType,
    onSelectSloganType
}) => {
    const [showContent, setShowContent] = useState(false);
    const [hoveringConfirm, setHoveringConfirm] = useState(false);
    const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([analysis.naturalEnvironments[0]]);
    const [editableTitle, setEditableTitle] = useState(analysis.suggestedTitle);
    const [editableIndustry, setEditableIndustry] = useState(analysis.detectedIndustry);
    const [editableAudiences, setEditableAudiences] = useState(analysis.recommendedAudiences);
    const [editableDescription, setEditableDescription] = useState(analysis.userStory);
    const [imageInstructions, setImageInstructions] = useState(
        `Place this product in ${analysis.naturalEnvironments[0] || 'a natural environment'}. ` +
        `The product should be prominently displayed and maintain its original appearance. ` +
        `Create a professional, photorealistic composition that showcases the product effectively.`
    );
    const [activeTab, setActiveTab] = useState<TabType>('analysis');
    const [selectedFormats, setSelectedFormats] = useState<AdFormat[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isVisible) {
            setTimeout(() => setShowContent(true), 200);
            setSelectedEnvironments([analysis.naturalEnvironments[0]]);
            setEditableTitle(analysis.suggestedTitle);
            setEditableIndustry(analysis.detectedIndustry);
            setEditableAudiences(analysis.recommendedAudiences);
            setEditableDescription(analysis.userStory);
            setImageInstructions(
                `Place this product in ${analysis.naturalEnvironments[0] || 'a natural environment'}. ` +
                `The product should be prominently displayed and maintain its original appearance. ` +
                `Create a professional, photorealistic composition that showcases the product effectively.`
            );
        } else {
            setShowContent(false);
        }
    }, [isVisible, analysis]);
    
    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);
    
    const toggleEnvironment = (environment: string) => {
        setSelectedEnvironments(prev => 
            prev.includes(environment) 
                ? prev.filter(env => env !== environment)
                : [...prev, environment]
        );
    };
    
    const toggleAudience = (audience: TargetAudience) => {
        setEditableAudiences(prev => 
            prev.includes(audience) 
                ? prev.filter(aud => aud !== audience)
                : [...prev, audience]
        );
    };
    
    const getAvailableAudiences = (): TargetAudience[] => {
        return Object.keys(AUDIENCE_LABELS) as TargetAudience[];
    };
    
    // Smart format recommendations based on product analysis
    const getRecommendedFormats = (formats: AdFormat[], category: 'mockups' | 'social' | 'facebook'): AdFormat[] => {
        const { productType, detectedIndustry, recommendedAudiences } = analysis;
        
        const recommendations: AdFormat[] = [];
        
        if (category === 'mockups') {
            // SaaS/Digital products
            if (detectedIndustry === 'saas' || productType === 'logo_brand') {
                recommendations.push(
                    ...formats.filter(f => ['Natural Environment', 'Social Media Ad', 'Magazine Spread'].includes(f.name))
                );
            }
            // Physical products
            else if (productType === 'physical_product') {
                recommendations.push(
                    ...formats.filter(f => ['Natural Environment', 'Urban Billboard', 'Magazine Spread'].includes(f.name))
                );
            }
            // Fashion/Lifestyle
            else if (detectedIndustry === 'fashion' || recommendedAudiences.includes('millennials')) {
                recommendations.push(
                    ...formats.filter(f => ['T-Shirt Mockup', 'Tote Bag', 'Influencer Story'].includes(f.name))
                );
            }
        }
        
        else if (category === 'social') {
            // Gen Z audience
            if (recommendedAudiences.includes('gen_z')) {
                recommendations.push(
                    ...formats.filter(f => ['Expanding Brain Meme', 'Top/Bottom Text Meme', 'YouTube Thumbnail'].includes(f.name))
                );
            }
            // B2B/Professional
            else if (recommendedAudiences.includes('entrepreneurs') || recommendedAudiences.includes('corporate_buyers')) {
                recommendations.push(
                    ...formats.filter(f => ['LinkedIn Post', 'Product Hunt Launch', 'X (Twitter) Post'].includes(f.name))
                );
            }
            // General/Popular
            else {
                recommendations.push(
                    ...formats.filter(f => ['Inspirational Quote', 'Problem vs. Solution', 'YouTube Thumbnail'].includes(f.name))
                );
            }
        }
        
        else if (category === 'facebook') {
            // SaaS/B2B
            if (detectedIndustry === 'saas' || recommendedAudiences.includes('entrepreneurs')) {
                recommendations.push(
                    ...formats.filter(f => ['Feature-Benefit', 'The "How-To" Guide', 'Problem-Agitate-Solve'].includes(f.name))
                );
            }
            // E-commerce/Consumer
            else {
                recommendations.push(
                    ...formats.filter(f => ['The Humblebrag', 'The Testimonial', 'Before-After-Bridge'].includes(f.name))
                );
            }
        }
        
        return recommendations.slice(0, 3); // Top 3 recommendations
    };
    
    const toggleFormat = (format: AdFormat) => {
        setSelectedFormats(prev => {
            const exists = prev.find(f => f.id === format.id);
            if (exists) {
                return prev.filter(f => f.id !== format.id);
            } else {
                return [...prev, format];
            }
        });
    };
    
    const isFormatSelected = (format: AdFormat) => {
        return selectedFormats.some(f => f.id === format.id);
    };
    
    const isFormatRecommended = (format: AdFormat, category: 'mockups' | 'social' | 'facebook') => {
        const recommended = getRecommendedFormats(
            category === 'mockups' ? AD_FORMATS :
            category === 'social' ? SOCIAL_MEDIA_FORMATS :
            FACEBOOK_AD_FORMATS,
            category
        );
        return recommended.some(f => f.id === format.id);
    };
    
    if (!isVisible) return null;

    const audienceLabels = editableAudiences.map(a => AUDIENCE_LABELS[a]).join(', ');
    const availableAudiences = getAvailableAudiences();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div ref={popupRef} className="bg-white rounded-xl shadow-xl w-[600px] h-[75vh] max-h-[85vh] flex flex-col overflow-hidden">
                {/* Compact Header */}
                <div className="p-3 border-b border-gray-200/80 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4 text-yellow-500" />
                            <h3 className="text-sm font-semibold text-gray-900">AI Analysis Complete</h3>
                        </div>
                        {/* AI Confidence Badge - Top Right */}
                        {showContent && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Confidence:</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${analysis.confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-green-700">{analysis.confidence}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-gray-200/80">
                    <div className="flex">
                        {[
                            { id: 'analysis', name: 'Analysis' },
                            { id: 'mockups', name: 'Mockups', count: AD_FORMATS.length },
                            { id: 'social', name: 'Social', count: SOCIAL_MEDIA_FORMATS.length },
                            { id: 'facebook', name: 'Facebook', count: FACEBOOK_AD_FORMATS.length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id 
                                        ? 'border-yellow-500/80 text-yellow-700 bg-yellow-50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.name}
                                {tab.count && (
                                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                    {activeTab === 'analysis' && (
                        <div className="space-y-4">
                            {/* Product Title & Industry Row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Product Title</label>
                                    <input
                                        value={editableTitle}
                                        onChange={(e) => setEditableTitle(e.target.value)}
                                        className="w-full p-1.5 border border-gray-200/80 rounded text-sm font-semibold"
                                        placeholder="Product name"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                                    <select
                                        value={editableIndustry}
                                        onChange={(e) => setEditableIndustry(e.target.value as Industry)}
                                        className="w-full p-1.5 border border-gray-200/80 rounded text-sm"
                                    >
                                        {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Target Audience - Compact 4 across */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Target Audience <span className="text-xs text-gray-500">(click to toggle)</span>
                                </label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {availableAudiences.map((audience) => {
                                        const isSelected = editableAudiences.includes(audience);
                                        
                                        return (
                                            <button
                                                key={audience}
                                                onClick={() => toggleAudience(audience)}
                                                className={`py-1 px-1.5 rounded text-[11px] text-center transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-yellow-100 border border-yellow-300/80 text-yellow-900'
                                                        : 'bg-gray-50 border border-gray-200/80 hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <span className="block truncate">{AUDIENCE_LABELS[audience]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Editable Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Image Description</label>
                                <textarea
                                    value={editableDescription}
                                    onChange={(e) => setEditableDescription(e.target.value)}
                                    className="w-full p-2 border border-gray-200/80 rounded-md text-sm resize-none"
                                    rows={2}
                                    placeholder="What does this product do?"
                                />
                            </div>

                            {/* Image Instructions (formerly User Story) */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Image Instructions 
                                    <span className="text-xs text-gray-500 ml-1">(AI prompt - edit to customize)</span>
                                </label>
                                <textarea
                                    value={imageInstructions}
                                    onChange={(e) => setImageInstructions(e.target.value)}
                                    className="w-full p-2 border border-blue-200 bg-blue-50 rounded-md text-xs resize-none font-mono"
                                    rows={3}
                                    placeholder="Instructions for AI image generation..."
                                />
                            </div>

                            {/* Multi-Select Environment Options */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Natural Environment Options
                                </label>
                                <p className="text-xs text-gray-500 mb-2">Choose where your product will be placed in the scene</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {analysis.naturalEnvironments.map((environment, index) => {
                                        const isSelected = selectedEnvironments.includes(environment);
                                        const isRecommended = index === 0;
                                        
                                        return (
                                            <button
                                                key={environment}
                                                onClick={() => toggleEnvironment(environment)}
                                                className={`py-1.5 px-2 rounded-md border text-left text-xs leading-tight transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-green-100 border-green-300 ring-2 ring-green-200 text-green-900'
                                                        : 'bg-gray-50 border-gray-200/80 hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-xs">{environment}</span>
                                                    <div className="flex items-center gap-1">
                                                        {isRecommended && <span className="text-yellow-500">⭐</span>}
                                                        {isSelected && <span className="text-green-600">✓</span>}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Selected: {selectedEnvironments.length} environment{selectedEnvironments.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            
                            {/* Text Generation - NEW */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Text (Optional)</label>
                                <p className="text-xs text-gray-500 mb-2">AI will create an appropriate phrase and add it to the image</p>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { id: 'hook', name: 'Hook' },
                                        { id: 'tagline', name: 'Tagline' },
                                        { id: 'meme', name: 'Meme' },
                                        { id: 'joke', name: 'Joke' },
                                        { id: 'quote', name: 'Quote' },
                                        { id: 'fun_fact', name: 'Fun Fact' },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => onSelectSloganType && onSelectSloganType(selectedSloganType === type.id as SloganType ? null : type.id as SloganType)}
                                            disabled={isLoading || !onSelectSloganType}
                                            className={`py-1 px-2 text-xs rounded-md transition-all font-medium ${
                                                selectedSloganType === type.id
                                                    ? 'bg-yellow-500 text-gray-900'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } ${isLoading || !onSelectSloganType ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Format Selection Tabs */}
                    {activeTab !== 'analysis' && (
                        <FormatSelectionGrid
                            formats={activeTab === 'mockups' ? AD_FORMATS : activeTab === 'social' ? SOCIAL_MEDIA_FORMATS : FACEBOOK_AD_FORMATS}
                            category={activeTab as 'mockups' | 'social' | 'facebook'}
                            selectedFormats={selectedFormats}
                            onToggleFormat={toggleFormat}
                            getRecommendedFormats={getRecommendedFormats}
                            isFormatRecommended={isFormatRecommended}
                        />
                    )}
                </div>

                {/* Compact Next Steps */}
                <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                    <div className="text-xs text-blue-800 grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mt-1 flex-shrink-0"></span>
                            <span>AI places product naturally</span>
                        </div>
                        <div className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mt-1 flex-shrink-0"></span>
                            <span>Context-aware placement</span>
                        </div>
                        <div className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mt-1 flex-shrink-0"></span>
                            <span>Professional mockup output</span>
                        </div>
                        <div className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mt-1 flex-shrink-0"></span>
                            <span>Edit after generation</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200/80">
                    {activeTab === 'analysis' ? (
                        <div className="flex gap-3">
                            <button
                                onClick={async () => {
                                    console.log('🎆 Generate Smart Ad clicked at', new Date().toISOString());
                                    console.log('🔍 Props check:', {
                                        onGenerate: typeof onGenerate,
                                        onUpdateAnalysis: typeof onUpdateAnalysis,
                                        onClose: typeof onClose
                                    });
                                    
                                    // Save all edits and generate with Natural Environment
                                    console.log('💾 Updating analysis...');
                                    onUpdateAnalysis({
                                        suggestedTitle: editableTitle,
                                        detectedIndustry: editableIndustry,
                                        recommendedAudiences: editableAudiences,
                                        userStory: editableDescription,
                                        naturalEnvironments: selectedEnvironments.length > 0 ? selectedEnvironments : analysis.naturalEnvironments
                                    });
                                    
                                    console.log('🌱 Calling onGenerate with empty array...');
                                    try {
                                        // Try awaiting if it's async
                                        await onGenerate([]);  // Empty array will trigger auto-selection
                                        console.log('✅ onGenerate completed');
                                    } catch (error) {
                                        console.error('❌ onGenerate threw error:', error);
                                    }
                                    
                                    console.log('🚪 Closing popup...');
                                    // Close popup after triggering generation
                                    onClose();
                                    console.log('🎁 All done from popup side');
                                }}
                                disabled={isLoading}
                                className={`btn-primary flex items-center justify-center gap-2 h-10 px-8 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <span>🎨 Generate Smart Ad</span>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="btn-secondary-neutral px-6 h-10"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    {selectedFormats.length === 0 
                                        ? 'Select formats to generate ads' 
                                        : `${selectedFormats.length} format${selectedFormats.length !== 1 ? 's' : ''} selected`
                                    }
                                </p>
                                <button
                                    onClick={() => setActiveTab('analysis')}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    ← Back to Analysis
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (selectedFormats.length > 0) {
                                            onGenerate(selectedFormats);
                                            onClose();
                                        }
                                    }}
                                    disabled={selectedFormats.length === 0 || isLoading}
                                    className={`btn-primary flex items-center justify-center gap-2 flex-1 max-w-xs ${
                                        selectedFormats.length === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <span>🎨 Generate {selectedFormats.length > 0 ? selectedFormats.length : ''} Ad{selectedFormats.length !== 1 ? 's' : ''}</span>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="btn-secondary-neutral px-6 h-10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close popup"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};