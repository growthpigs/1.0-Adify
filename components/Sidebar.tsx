import React, { useState } from 'react';
import { SloganType, UploadedImage, SmartProductInput, AdFormat, Industry, TargetAudience } from '../types';
import { PlusIcon, SparklesIcon, XIcon } from './Icons';
import { AD_FORMATS, SOCIAL_MEDIA_FORMATS, FACEBOOK_AD_FORMATS } from '../constants';
import { FormatSelectionGrid } from './FormatSelectionGrid';

interface SidebarProps {
  imageLibrary: UploadedImage[];
  generatedGallery: any[]; // Generated content gallery
  selectedImage: UploadedImage;
  onSelectFromLibrary: (image: UploadedImage) => void;
  onDeleteFromLibrary: (imageId: string) => void;
  onGenerate: (environmentOrFormats?: string | AdFormat[]) => void;
  isLoading: boolean;
  smartInput: SmartProductInput;
  onSmartInputChange: (input: SmartProductInput) => void;
  isDescriptionLoading: boolean;
  onImageUpload: (file: File, previewUrl: string) => void;
  onGenerateDescription: () => void;
  selectedSloganType: SloganType | null;
  onSelectSloganType: (type: SloganType | null) => void;
  onResetAnalysis: () => void;
  onReanalyze: () => void;
}

const MAX_DESC_LENGTH = 800;

const DescriptionLoader: React.FC = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-16 bg-gray-200 rounded-md"></div>
    <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto"></div>
  </div>
);

type TabType = 'analysis' | 'mockups' | 'social' | 'facebook';

export const Sidebar: React.FC<SidebarProps> = ({
  imageLibrary,
  generatedGallery,
  selectedImage,
  onSelectFromLibrary,
  onDeleteFromLibrary,
  onGenerate,
  isLoading,
  smartInput,
  onSmartInputChange,
  isDescriptionLoading,
  onImageUpload,
  onGenerateDescription,
  selectedSloganType,
  onSelectSloganType,
  onResetAnalysis,
  onReanalyze,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');
  const [selectedFormats, setSelectedFormats] = useState<AdFormat[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [imageInstructions, setImageInstructions] = useState<string>('');
  
  // Auto-select first environment when analysis is available
  React.useEffect(() => {
    if (selectedImage?.analysis?.naturalEnvironments && selectedImage.analysis.naturalEnvironments.length > 0) {
      if (!selectedEnvironment || !selectedImage.analysis.naturalEnvironments.includes(selectedEnvironment)) {
        setSelectedEnvironment(selectedImage.analysis.naturalEnvironments[0]);
      }
    }
  }, [selectedImage?.analysis?.naturalEnvironments]);

  // Update image instructions when environment or image changes
  React.useEffect(() => {
    if (selectedImage?.analysis) {
      const defaultInstructions = `Place this product in ${selectedEnvironment || selectedImage.analysis.naturalEnvironments[0] || 'a natural environment'}. The product should be prominently displayed and maintain its original appearance. Create a professional, photorealistic composition that showcases the product effectively.`;
      setImageInstructions(defaultInstructions);
    } else {
      setImageInstructions('');
    }
  }, [selectedImage?.analysis, selectedEnvironment]);
  
  const sloganTypes: { id: SloganType; name: string }[] = [
    { id: 'hook', name: 'Hook' },
    { id: 'tagline', name: 'Tagline' },
    { id: 'meme', name: 'Meme' },
    { id: 'joke', name: 'Joke' },
    { id: 'quote', name: 'Quote' },
    { id: 'fun_fact', name: 'Fun Fact' },
  ];
  
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
  
  const getRecommendedFormats = (formats: AdFormat[], category: 'mockups' | 'social' | 'facebook'): AdFormat[] => {
    // Simple recommendation logic - can be enhanced
    return formats.slice(0, 3);
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

  const handleFile = (file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <aside className="w-[600px] xl:w-[600px] lg:w-[500px] md:w-[400px] sm:w-[350px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">


      {/* Full Analysis Section with Tabs - Always visible */}
      <div className={`border-b border-gray-200 transition-opacity duration-200 ${!selectedImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* Header - Always visible - Made thinner */}
        <div className={`px-2 py-1.5 border-b border-gray-200`} style={{ backgroundColor: '#fefcf0' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-3 h-3 text-yellow-500" />
              <h3 className="text-base font-medium text-yellow-600">
                {!selectedImage ? 'AI Analysis Ready' : selectedImage.analysis ? 'AI Analysis Complete' : 'Analyzing...'}
              </h3>
            </div>
            {/* AI Confidence Badge - Enhanced with cream container */}
            <div className="bg-white px-2 py-1 rounded-md">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">Confidence:</span>
                <div className="flex items-center gap-1">
                  <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: selectedImage?.analysis ? `${selectedImage.analysis.confidence}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {selectedImage?.analysis ? `${selectedImage.analysis.confidence}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs - Always visible */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'analysis' as TabType, name: 'Analysis' },
              { id: 'mockups' as TabType, name: 'Mockups', count: AD_FORMATS.length },
              { id: 'social' as TabType, name: 'Social', count: SOCIAL_MEDIA_FORMATS.length },
              { id: 'facebook' as TabType, name: 'Facebook', count: FACEBOOK_AD_FORMATS.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => selectedImage && setActiveTab(tab.id)}
                disabled={!selectedImage}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-yellow-500 text-yellow-700 bg-yellow-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:hover:bg-transparent disabled:hover:text-gray-500'
                }`}
              >
                {tab.name}
                {tab.count && (
                  <span className="ml-1 bg-gray-200 text-gray-600 px-1 py-0.5 rounded-full text-[10px] min-w-[14px] text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
          
        {/* Tab Content - Always visible - Increased height to eliminate scrolling */}
        <div className="p-4 max-h-[750px] overflow-y-auto">
          {activeTab === 'analysis' && (
              <div className="space-y-2">
                {/* Product Title & Industry Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Title</label>
                  <input
                    value={smartInput.title}
                    onChange={(e) => {
                      console.log('🔵 TITLE EDIT:', e.target.value);
                      onSmartInputChange({ ...smartInput, title: e.target.value });
                    }}
                    className="w-full p-1.5 border border-gray-200 rounded text-sm font-semibold"
                    placeholder="Product name"
                    disabled={!selectedImage}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                  <select
                    value={smartInput.industry || ''}
                    onChange={(e) => {
                      console.log('🔵 INDUSTRY EDIT:', e.target.value);
                      onSmartInputChange({ ...smartInput, industry: e.target.value as Industry || null });
                    }}
                    className="w-full p-1.5 border border-gray-200 rounded text-sm"
                    disabled={!selectedImage}
                  >
                    <option value="">Select industry</option>
                    <option value="saas">Software & Technology</option>
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="food_beverage">Food & Beverage</option>
                    <option value="fitness_wellness">Fitness & Wellness</option>
                    <option value="technology">Technology & Electronics</option>
                    <option value="b2b_services">B2B Services</option>
                    <option value="automotive">Automotive</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="education">Education & Learning</option>
                    <option value="healthcare">Healthcare & Medical</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="entertainment">Entertainment & Media</option>
                    <option value="travel">Travel & Hospitality</option>
                    <option value="home_garden">Home & Garden</option>
                  </select>
                </div>
              </div>
                
              {/* Target Audience Dropdown - Editable */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Target Audience</label>
                <select
                  value={smartInput.targetAudience || ''}
                  onChange={(e) => {
                    console.log('🔵 TARGET AUDIENCE EDIT:', e.target.value);
                    onSmartInputChange({ ...smartInput, targetAudience: (e.target.value as TargetAudience) || null });
                  }}
                  className="w-full p-1.5 border border-gray-200 rounded text-sm"
                  disabled={!selectedImage}
                >
                  <option value="">Select target audience</option>
                  <option value="entrepreneurs">Entrepreneurs</option>
                  <option value="gen_z">Gen Z (18-26)</option>
                  <option value="millennials">Millennials (27-42)</option>
                  <option value="busy_professionals">Busy Professionals</option>
                  <option value="parents">Parents & Families</option>
                  <option value="students">Students</option>
                  <option value="corporate_buyers">Corporate Buyers</option>
                  <option value="fitness_enthusiasts">Fitness Enthusiasts</option>
                  <option value="tech_savvy">Tech-Savvy Users</option>
                  <option value="luxury_consumers">Luxury Consumers</option>
                  <option value="budget_conscious">Budget-Conscious</option>
                  <option value="early_adopters">Early Adopters</option>
                  <option value="creative_professionals">Creative Professionals</option>
                  <option value="artists_designers">Artists & Designers</option>
                  <option value="content_creators">Content Creators</option>
                  <option value="homeowners">Homeowners</option>
                </select>
              </div>
                
              {/* Description - Editable */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={smartInput.description}
                  onChange={(e) => {
                    console.log('🔵 DESCRIPTION EDIT:', e.target.value);
                    onSmartInputChange({ ...smartInput, description: e.target.value });
                  }}
                  className="w-full p-2 border border-gray-200 rounded-md text-sm resize-y min-h-[2.5rem]"
                  rows={2}
                  maxLength={800}
                  placeholder="Describe your product's features, benefits, and unique value..."
                  disabled={!selectedImage}
                />
              </div>
                
              {/* Image Instructions */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Instructions
                  <span className="text-xs text-gray-500 ml-1">(AI prompt)</span>
                </label>
                <textarea
                  value={imageInstructions}
                  onChange={(e) => setImageInstructions(e.target.value)}
                  className="w-full p-2 border border-gray-300 bg-white rounded-md text-xs resize-y font-mono min-h-[2.5rem]"
                  rows={3}
                  placeholder="Describe how the AI should generate the image..."
                  disabled={!selectedImage}
                />
              </div>
                
                {/* Natural Environments */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Natural Environment Options
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Choose where your product will be placed in the scene</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedImage?.analysis?.naturalEnvironments ? (
                      selectedImage.analysis.naturalEnvironments.slice(0, 9).map((environment, index) => (
                      <button
                        key={environment}
                        onClick={() => setSelectedEnvironment(environment)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          selectedEnvironment === environment
                            ? 'bg-green-100 border-green-500 text-green-900 ring-1 ring-green-200'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium leading-relaxed">{environment}</span>
                          <div className="flex items-center gap-1 ml-1">
                            {index === 0 && selectedEnvironment === environment && <span className="text-yellow-500 text-sm">⭐</span>}
                            {selectedEnvironment === environment && <span className="text-green-600 text-sm">✓</span>}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    // Empty placeholders when no data
                    [1, 2, 3, 4, 5, 6].map(i => (
                      <button key={i} className="p-2.5 rounded-lg border text-left text-sm bg-gray-100 border-gray-200" disabled>
                        <span className="text-gray-400">-</span>
                      </button>
                    ))
                  )}
                  </div>
                </div>
                
                {/* Text Generation - NEW */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Text (Optional)</label>
                  <p className="text-xs text-gray-500 mb-2">AI will create an appropriate phrase and add it to the image</p>
                  <div className="grid grid-cols-3 gap-2">
                    {sloganTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => onSelectSloganType(selectedSloganType === type.id ? null : type.id)}
                        disabled={isLoading}
                        className={`
                          py-1.5 px-2 text-xs rounded-md transition-all font-medium
                          ${selectedSloganType === type.id 
                            ? 'bg-yellow-500 text-gray-900' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
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
        </div>
      
      {/* Generate Button Row - Side by side */}
      <div className="p-4">
        <div className="flex gap-2">
          {/* I Know Better Button - Only show when there's analysis */}
          {selectedImage?.analysis && (
            <button
              onClick={onResetAnalysis}
              disabled={isLoading}
              className={`
                flex-shrink-0 h-10 px-3 rounded-lg text-xs font-medium transition-all border border-gray-300 
                ${isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }
              `}
            >
              ⚡ I Know Better
            </button>
          )}
          
          {/* Reanalyze Button - Show when smartInput has been modified - Made 1/3rd proportional width */}
          {selectedImage && (
            <button
              onClick={() => {
                console.log('🔄 REANALYZE CLICKED - Current smartInput:', smartInput);
                onReanalyze();
              }}
              disabled={isLoading}
              className={`
                w-48 h-10 px-3 rounded-lg text-xs font-medium transition-all border border-blue-300 flex items-center justify-center gap-1
                ${isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                }
              `}
            >
              <SparklesIcon className="w-3 h-3" />
              Re-analyze
            </button>
          )}
          
          <button
            onClick={() => {
              // If on analysis tab or natural environment selected, use single format generation
              if (activeTab === 'analysis' || selectedEnvironment) {
                onGenerate(selectedEnvironment || undefined);
              } else {
                // Multi-format generation from format selection
                if (selectedFormats.length > 0) {
                  // Pass selected formats for multi-generation
                  onGenerate(selectedFormats);
                } else {
                  // No formats selected, use single Natural Environment generation
                  onGenerate(selectedEnvironment || undefined);
                }
              }
            }}
            disabled={isLoading || !selectedImage}
            className={`
              flex-1 h-10 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5
              ${isLoading || !selectedImage
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
              }
            `}
          >
            {!isLoading && <SparklesIcon className="w-4 h-4" />}
            {isLoading ? 'Generating...' : 
             selectedFormats.length > 0 ? `Generate ${selectedFormats.length} Ad${selectedFormats.length > 1 ? 's' : ''}` :
             'Generate'}
          </button>
        </div>
      </div>
    </aside>
  );
};