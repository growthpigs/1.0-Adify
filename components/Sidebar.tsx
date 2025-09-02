import React, { useState } from 'react';
import { SloganType, UploadedImage, SmartProductInput, AdFormat } from '../types';
import { PlusIcon, SparklesIcon, XIcon, CheckCircle } from 'lucide-react';
import { AD_FORMATS, SOCIAL_MEDIA_FORMATS, FACEBOOK_AD_FORMATS } from '../constants';
import { FormatSelectionGrid } from './FormatSelectionGrid';

interface SidebarProps {
  imageLibrary: UploadedImage[];
  generatedGallery: any[];
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

type TabType = 'custom' | 'mockups' | 'social' | 'facebook';

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
  const [activeTab, setActiveTab] = useState<TabType>('custom');
  const [selectedFormats, setSelectedFormats] = useState<AdFormat[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const buttonsRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (selectedImage?.analysis?.naturalEnvironments && selectedImage.analysis.naturalEnvironments.length > 0) {
      if (!selectedEnvironment || !selectedImage.analysis.naturalEnvironments.includes(selectedEnvironment)) {
        setSelectedEnvironment(selectedImage.analysis.naturalEnvironments[0]);
      }
    }
  }, [selectedImage?.analysis?.naturalEnvironments]);

  // Diagnostic logging for button positioning issue
  React.useEffect(() => {
    console.log(`🔍 TAB CHANGE: Active tab is now '${activeTab}'`);
    
    // Measure content height after tab change
    setTimeout(() => {
      if (contentRef.current && buttonsRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const contentBottom = contentRef.current.getBoundingClientRect().bottom;
        const buttonsTop = buttonsRef.current.getBoundingClientRect().top;
        const actualGap = buttonsTop - contentBottom;
        
        console.log(`📏 MEASUREMENTS for '${activeTab}' tab:`);
        console.log(`   - Content height: ${contentHeight}px`);
        console.log(`   - Gap between content and buttons: ${actualGap}px`);
        console.log(`   - Target gap should be: 30px`);
        console.log(`   - Gap difference: ${actualGap - 30}px`);
      }
    }, 100); // Small delay to let DOM update
  }, [activeTab]);

  const hasImage = !!selectedImage;
  const hasAnalysis = !!selectedImage?.analysis;
  
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

  const mockupCount = AD_FORMATS.length;
  const socialCount = SOCIAL_MEDIA_FORMATS.length;
  const facebookCount = FACEBOOK_AD_FORMATS.length;

  return (
    <div className="flex flex-col h-full bg-yellow-50 border-r border-gray-300/30">
      {/* Tabs */}
      <div className="flex bg-gray-100 border-b border-gray-200/10">
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors font-mono border-r border-gray-200/10
            ${activeTab === 'custom' 
              ? 'bg-yellow-50 text-gray-900 border-b-2 border-b-yellow-400' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-50'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          CUSTOM
        </button>
        <button
          onClick={() => setActiveTab('mockups')}
          className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors font-mono border-r border-gray-200/10
            ${activeTab === 'mockups' 
              ? 'bg-yellow-50 text-gray-900 border-b-2 border-b-yellow-400' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-50'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          MOCKUPS
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors font-mono border-r border-gray-200/10
            ${activeTab === 'social' 
              ? 'bg-yellow-50 text-gray-900 border-b-2 border-b-yellow-400' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-50'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          SOCIAL
        </button>
        <button
          onClick={() => setActiveTab('facebook')}
          className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors font-mono
            ${activeTab === 'facebook' 
              ? 'bg-yellow-50 text-gray-900 border-b-2 border-b-yellow-400' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-50'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          FACEBOOK
        </button>
      </div>

      {/* Tab Content */}
      <div ref={contentRef} className="overflow-y-auto p-3" style={{ minHeight: '500px', maxHeight: 'calc(100vh - 260px)' }}>
        {activeTab === 'custom' && (
          <div className="space-y-3">
            {/* AI Analysis Status */}
            <div className={`rounded-lg border ${hasAnalysis ? 'bg-green-500 border-green-600' : 'bg-yellow-50 border-yellow-200/80'} transition-all duration-300`} style={{ minHeight: '50px' }}>
              {hasAnalysis ? (
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReanalyze()}
                      disabled={isLoading}
                      className="px-2 py-1 text-xs font-medium text-green-600 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <SparklesIcon className="w-3 h-3" />
                      Re-analyze
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">🤖 Analysis Complete</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {selectedImage?.analysis?.confidence || 95}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReanalyze()}
                      disabled={!hasImage || isLoading}
                      className="px-2 py-1 text-xs font-medium text-gray-600 bg-yellow-50 border border-gray-300/80 rounded hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <SparklesIcon className="w-3 h-3" />
                      Re-analyze
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="font-medium opacity-70">AI Analysis Pending</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>Product Title</label>
              <input
                type="text"
                value={smartInput.title}
                onChange={(e) => onSmartInputChange({ ...smartInput, title: e.target.value })}
                className={`w-full px-3 py-1.5 text-sm border border-gray-300/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none ${!hasImage ? 'bg-yellow-50' : 'bg-white'}`}
                placeholder="Enter product title"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>Industry</label>
              <div className="relative">
                <select
                  value={smartInput.industry || ''}
                  onChange={(e) => onSmartInputChange({ ...smartInput, industry: e.target.value as any })}
                  className={`w-full px-3 pr-10 py-1.5 text-sm border border-gray-300/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none ${!hasImage ? 'bg-yellow-50' : 'bg-white'}`}
                >
                  <option value="" className="text-gray-400">Select Industry</option>
                  <option value="Entertainment & Media">Entertainment & Media</option>
                  <option value="Technology">Technology</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>Target Audience</label>
              <div className="relative">
                <select
                  value={smartInput.targetAudience || ''}
                  onChange={(e) => onSmartInputChange({ ...smartInput, targetAudience: e.target.value as any })}
                  className={`w-full px-3 pr-10 py-1.5 text-sm border border-gray-300/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none ${!hasImage ? 'bg-yellow-50' : 'bg-white'}`}
                >
                  <option value="" className="text-gray-400">Select Audience</option>
                  <option value="Gen Z (18-26)">Gen Z (18-26)</option>
                  <option value="Millennials (27-42)">Millennials (27-42)</option>
                  <option value="Gen X (43-58)">Gen X (43-58)</option>
                  <option value="Boomers (59+)">Boomers (59+)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>Description</label>
              <textarea
                value={smartInput.description}
                onChange={(e) => onSmartInputChange({ ...smartInput, description: e.target.value })}
                className={`w-full px-3 py-2 text-sm border border-gray-300/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${!hasImage ? 'bg-yellow-50' : 'bg-white'}`}
                placeholder="Describe your product..."
                rows={4}
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>Instructions (Optional)</label>
              <textarea
                value={smartInput.instructions || ''}
                onChange={(e) => onSmartInputChange({ ...smartInput, instructions: e.target.value })}
                className={`w-full px-3 py-2 text-sm border border-gray-300/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${!hasImage ? 'bg-yellow-50' : 'bg-white'}`}
                placeholder="Any specific instructions for the AI..."
                rows={3}
              />
            </div>

            {/* Natural Environment Options */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>
                Natural Environment Options
              </label>
              <p className="text-xs text-gray-400 ml-1" style={{ marginBottom: '6px', marginTop: '-4px' }}>AI-selected environments for your product</p>
              <div className="grid grid-cols-3 gap-2">
                {(selectedImage?.analysis?.naturalEnvironments || ['Studio', 'Outdoor', 'Urban', 'Home', 'Office', 'Nature']).slice(0, 6).map((env) => (
                  <button
                    key={env}
                    onClick={() => setSelectedEnvironment(env)}
                    disabled={!selectedImage?.analysis?.naturalEnvironments}
                    className={`p-2 text-xs font-medium uppercase rounded-lg border transition-all ${
                      selectedEnvironment === env
                        ? 'border-yellow-500/80 bg-yellow-50 text-gray-900'
                        : `border-gray-300/80 ${!selectedImage?.analysis?.naturalEnvironments ? 'bg-yellow-50' : 'bg-white'} text-gray-700 hover:border-gray-400/80`
                    } ${!selectedImage?.analysis?.naturalEnvironments ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Options */}
            <div>
              <label className="block text-xs font-medium text-gray-600/40 ml-1 uppercase" style={{ fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>Text (Optional)</label>
              <p className="text-xs text-gray-400 ml-1" style={{ marginBottom: '6px', marginTop: '-4px' }}>AI will create an appropriate phrase and add it to the image</p>
              <div className="grid grid-cols-3 gap-2">
                {sloganTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onSelectSloganType(selectedSloganType === type.id ? null : type.id)}
                    disabled={!hasImage}
                    className={`p-2 text-xs font-medium uppercase rounded-lg border transition-all ${
                      selectedSloganType === type.id
                        ? 'border-yellow-500/80 bg-yellow-50 text-gray-900'
                        : `border-gray-300/80 ${!hasImage ? 'bg-yellow-50' : 'bg-white'} text-gray-700 hover:border-gray-400/80`
                    } ${!hasImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mockups' && (
          <FormatSelectionGrid
            formats={AD_FORMATS}
            selectedFormats={selectedFormats}
            onToggleFormat={toggleFormat}
            category="mockups"
            getRecommendedFormats={() => []}
            isFormatRecommended={() => false}
          />
        )}

        {activeTab === 'social' && (
          <FormatSelectionGrid
            formats={SOCIAL_MEDIA_FORMATS}
            selectedFormats={selectedFormats}
            onToggleFormat={toggleFormat}
            category="social"
            getRecommendedFormats={() => []}
            isFormatRecommended={() => false}
          />
        )}

        {activeTab === 'facebook' && (
          <FormatSelectionGrid
            formats={FACEBOOK_AD_FORMATS}
            selectedFormats={selectedFormats}
            onToggleFormat={toggleFormat}
            category="facebook"
            getRecommendedFormats={() => []}
            isFormatRecommended={() => false}
          />
        )}
      </div>

      {/* Bottom Action Buttons - Now in normal flow with 25px margin */}
      <div ref={buttonsRef} className="p-3 flex gap-2 bg-yellow-50" style={{ marginTop: '25px', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => {
            if (activeTab === 'custom' && selectedEnvironment) {
              onGenerate(selectedEnvironment);
            } else if (selectedFormats.length > 0) {
              onGenerate(selectedFormats);
            }
          }}
          disabled={!hasImage || isLoading || (activeTab !== 'custom' && selectedFormats.length === 0)}
          style={{ opacity: !hasImage ? 0.5 : 1 }}
          className="w-full px-6 py-3 text-base font-semibold text-white bg-green-500 border-2 border-yellow-400/80 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            GENERATE
          </span>
        </button>
      </div>
    </div>
  );
};