import React, { useState, useEffect, useRef } from 'react';
import { SmartProductAnalysis, Industry, TargetAudience, AdFormat } from '../types';
import { SparklesIcon, CheckCircleIcon, EditIcon } from './Icons';
import { AD_FORMATS, SOCIAL_MEDIA_FORMATS, FACEBOOK_AD_FORMATS } from '../constants';
import { FormatSelectionGrid } from './FormatSelectionGrid';

interface SmartAnalysisPopupProps {
    analysis: SmartProductAnalysis;
    isVisible: boolean;
    onConfirm: () => void;
    onEdit: () => void;
    onClose: () => void;
    onUpdateAnalysis: (updates: Partial<SmartProductAnalysis>) => void;
    onGenerate: (selectedFormats: AdFormat[]) => void;
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
    early_adopters: 'Early Adopters'
};

export const SmartAnalysisPopup: React.FC<SmartAnalysisPopupProps> = ({
    analysis,
    isVisible,
    onConfirm,
    onEdit,
    onClose,
    onUpdateAnalysis,
    onGenerate
}) => {
    const [showContent, setShowContent] = useState(false);
    const [hoveringConfirm, setHoveringConfirm] = useState(false);
    const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([analysis.naturalEnvironments[0]]);
    const [editableTitle, setEditableTitle] = useState(analysis.suggestedTitle);
    const [editableIndustry, setEditableIndustry] = useState(analysis.detectedIndustry);
    const [editableAudiences, setEditableAudiences] = useState(analysis.recommendedAudiences);
    const [editableDescription, setEditableDescription] = useState(analysis.userStory);
    const [editableUserStory, setEditableUserStory] = useState(analysis.userStory);
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
            setEditableUserStory(analysis.userStory);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={popupRef} className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SparklesIcon className="w-6 h-6 text-pink-500" />
                            <div>
                                <h3 className="section-header mb-0">🤖 AI Analysis Complete!</h3>
                                <p className="content-subtitle">Analyze, customize, and choose formats to generate</p>
                            </div>
                        </div>
                        {selectedFormats.length > 0 && (
                            <div className="bg-pink-100 text-pink-800 px-3 py-2 rounded-full text-sm font-medium">
                                {selectedFormats.length} format{selectedFormats.length !== 1 ? 's' : ''} selected
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        {[
                            { id: 'analysis', name: 'Smart Analysis', icon: '🧠' },
                            { id: 'mockups', name: 'Mockups', icon: '🖼️', count: AD_FORMATS.length },
                            { id: 'social', name: 'Social Posts', icon: '📱', count: SOCIAL_MEDIA_FORMATS.length },
                            { id: 'facebook', name: 'Facebook Ads', icon: '🎯', count: FACEBOOK_AD_FORMATS.length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id 
                                        ? 'border-pink-500 text-pink-600 bg-pink-50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
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
                <div className="p-6 max-h-96 overflow-y-auto">
                    {activeTab === 'analysis' && (
                        <div className="space-y-6">
                            {/* Confidence & Basic Info Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">AI Confidence</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full bg-green-500 rounded-full transition-all duration-1000`}
                                                style={{ width: showContent ? `${analysis.confidence}%` : '0%' }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-green-700">{analysis.confidence}%</span>
                                        <span className="text-lg">{analysis.confidence > 90 ? "🔥" : "💪"}</span>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Product Title</label>
                                    <input
                                        value={editableTitle}
                                        onChange={(e) => setEditableTitle(e.target.value)}
                                        className="w-full p-1 border border-gray-200 rounded text-sm font-semibold"
                                        placeholder="Product name"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                                    <select
                                        value={editableIndustry}
                                        onChange={(e) => setEditableIndustry(e.target.value as Industry)}
                                        className="w-full p-1 border border-gray-200 rounded text-sm"
                                    >
                                        {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Target Audience - Multi-Select */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Target Audience 
                                    <span className="text-xs text-gray-500">(click to toggle)</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2 max-h-24 overflow-y-auto">
                                    {availableAudiences.map((audience) => {
                                        const isSelected = editableAudiences.includes(audience);
                                        
                                        return (
                                            <button
                                                key={audience}
                                                onClick={() => toggleAudience(audience)}
                                                className={`p-2 rounded text-xs text-left transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-pink-100 border border-pink-300 text-pink-900'
                                                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{AUDIENCE_LABELS[audience]}</span>
                                                    {isSelected && <span className="text-pink-600">✓</span>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Selected: {editableAudiences.length} audience{editableAudiences.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Editable Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                    value={editableDescription}
                                    onChange={(e) => setEditableDescription(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-md text-sm resize-none"
                                    rows={2}
                                    placeholder="What does this product do?"
                                />
                            </div>

                            {/* Editable User Story */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">User Story</label>
                                <textarea
                                    value={editableUserStory}
                                    onChange={(e) => setEditableUserStory(e.target.value)}
                                    className="w-full p-2 border border-blue-200 bg-blue-50 rounded-md text-sm resize-none"
                                    rows={2}
                                    placeholder="What problem does this solve for users?"
                                />
                            </div>

                            {/* Multi-Select Environment Options */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Natural Environment Options 
                                    <span className="text-xs text-gray-500">(click to toggle)</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {analysis.naturalEnvironments.map((environment, index) => {
                                        const isSelected = selectedEnvironments.includes(environment);
                                        const isRecommended = index === 0;
                                        
                                        return (
                                            <button
                                                key={environment}
                                                onClick={() => toggleEnvironment(environment)}
                                                className={`p-2 rounded-md border text-left text-sm transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-green-100 border-green-300 ring-2 ring-green-200 text-green-900'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{environment}</span>
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

                {/* Next Steps Guide */}
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">🎯 What happens next?</h4>
                    <div className="text-xs text-blue-800 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            <span>AI will automatically place your product in its natural environment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            <span>Smart context-aware placement based on your product type</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            <span>Click "Generate Smart Ad" to create your professional mockup</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200">
                    {activeTab === 'analysis' ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    // Save all edits and generate with Natural Environment
                                    onUpdateAnalysis({
                                        suggestedTitle: editableTitle,
                                        detectedIndustry: editableIndustry,
                                        recommendedAudiences: editableAudiences,
                                        userStory: editableUserStory,
                                        naturalEnvironments: selectedEnvironments.length > 0 ? selectedEnvironments : analysis.naturalEnvironments
                                    });
                                    // Automatically generate with Natural Environment
                                    onGenerate([]);  // Empty array will trigger auto-selection
                                    onClose();
                                }}
                                className="btn-primary flex items-center justify-center gap-2 flex-1"
                            >
                                <span>🎨 Generate Smart Ad</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="btn-secondary-neutral px-6"
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
                                    disabled={selectedFormats.length === 0}
                                    className={`btn-primary flex items-center justify-center gap-2 flex-1 ${
                                        selectedFormats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span>🎨 Generate {selectedFormats.length > 0 ? selectedFormats.length : ''} Ad{selectedFormats.length !== 1 ? 's' : ''}</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="btn-secondary-neutral px-6"
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