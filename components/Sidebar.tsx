import React, { useState } from 'react';
import { SloganType, UploadedImage, SmartProductInput, AdFormat } from '../types';
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
type LibraryTabType = 'uploaded' | 'generated';

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
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');
  const [libraryTab, setLibraryTab] = useState<LibraryTabType>('uploaded');
  const [selectedFormats, setSelectedFormats] = useState<AdFormat[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  
  // Auto-select first environment when analysis is available
  React.useEffect(() => {
    if (selectedImage?.analysis?.naturalEnvironments && selectedImage.analysis.naturalEnvironments.length > 0) {
      if (!selectedEnvironment || !selectedImage.analysis.naturalEnvironments.includes(selectedEnvironment)) {
        setSelectedEnvironment(selectedImage.analysis.naturalEnvironments[0]);
      }
    }
  }, [selectedImage?.analysis?.naturalEnvironments]);
  
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
      {/* Image Library */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-header">Image Library</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLibraryTab('uploaded')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                libraryTab === 'uploaded'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setLibraryTab('generated')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                libraryTab === 'generated'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generated ({generatedGallery.length})
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {libraryTab === 'uploaded' && (
            <>
              <label 
                htmlFor="sidebar-file-upload"
                className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Upload new image"
              >
                <PlusIcon className="w-5 h-5 text-gray-400" />
                <input
                  id="sidebar-file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  disabled={isLoading}
                />
              </label>
              {imageLibrary.map(image => (
            <div key={image.id} className="relative group flex-shrink-0">
              <button 
                onClick={() => onSelectFromLibrary(image)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage?.id === image.id 
                    ? 'border-pink-500 ring-2 ring-pink-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label="Select product image"
              >
                <img src={image.previewUrl} alt="Product" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFromLibrary(image.id);
                }}
                className="absolute top-1 right-1 bg-gray-600 bg-opacity-80 text-white rounded w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
                aria-label="Delete image"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
              ))}
            </>
          )}
          
          {libraryTab === 'generated' && (
            <>
              {generatedGallery.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-8 text-center">
                  <div className="text-gray-400">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                      🎨
                    </div>
                    <p className="text-sm">No ads generated yet</p>
                    <p className="text-xs text-gray-500 mt-1">Generated ads will appear here</p>
                  </div>
                </div>
              ) : (
                generatedGallery.map((content, index) => (
                  <div key={`generated-${index}`} className="relative group flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 bg-white">
                      <img 
                        src={content.imageUrl} 
                        alt="Generated ad" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {content.format && (
                      <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs px-1 py-0.5 rounded text-center min-w-0">
                        <div className="truncate max-w-8" title={content.format}>
                          {content.format.split(' ')[0]}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>


      {/* Full Analysis Section with Tabs - Always visible */}
      <div className={`border-b border-gray-200 transition-opacity duration-200 ${!selectedImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* Header - Always visible - Made thinner */}
        <div className={`px-3 py-2 ${selectedImage?.analysis ? 'bg-blue-50 border-b border-blue-200' : 'bg-gray-50 border-b border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-3 h-3 text-pink-500" />
              <h3 className="text-xs font-semibold text-gray-900">
                {!selectedImage ? 'AI Analysis Ready' : selectedImage.analysis ? 'AI Analysis Complete' : 'Analyzing...'}
              </h3>
            </div>
            {/* AI Confidence Badge - Smaller */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-600">Confidence:</span>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: selectedImage?.analysis ? `${selectedImage.analysis.confidence}%` : '0%' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-green-700">
                  {selectedImage?.analysis ? `${selectedImage.analysis.confidence}%` : '0%'}
                </span>
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
                    ? 'border-pink-500 text-pink-600 bg-pink-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:hover:bg-transparent disabled:hover:text-gray-500'
                }`}
              >
                {tab.name}
                {tab.count && (
                  <span className="ml-1 bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
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
              <div className="space-y-4">
                {/* Product Title & Industry Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Title</label>
                  <input
                    value={selectedImage?.analysis?.suggestedTitle || ''}
                    className="w-full p-1.5 border border-gray-200 rounded text-sm font-semibold"
                    placeholder="Product name"
                    readOnly
                    disabled={!selectedImage}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                  <select
                    value={selectedImage?.analysis?.detectedIndustry || ''}
                    className="w-full p-1.5 border border-gray-200 rounded text-sm"
                    disabled
                  >
                    <option>{selectedImage?.analysis?.detectedIndustry?.replace('_', ' ') || 'Select industry'}</option>
                  </select>
                </div>
              </div>
                
              {/* Target Audiences - Compact 4 across */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Target Audience 
                  <span className="text-xs text-gray-500 ml-1">(pre-selected)</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {selectedImage?.analysis?.recommendedAudiences ? (
                    selectedImage.analysis.recommendedAudiences.map((audience) => (
                      <div
                        key={audience}
                        className="py-1 px-1.5 rounded text-[11px] text-center bg-pink-100 border border-pink-300 text-pink-900"
                      >
                        <span className="block truncate">{audience.replace('_', ' ')}</span>
                      </div>
                    ))
                  ) : (
                    // Empty placeholders when no data
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="py-1 px-1.5 rounded text-[11px] text-center bg-gray-100 border border-gray-200">
                        <span className="block text-gray-400">-</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
                
              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image Description</label>
                <textarea
                  value={selectedImage?.description || selectedImage?.analysis?.userStory || ''}
                  className="w-full p-2 border border-gray-200 rounded-md text-sm resize-none"
                  rows={1}
                  placeholder="Image description will appear here"
                  readOnly
                  disabled={!selectedImage}
                />
              </div>
                
              {/* Image Instructions */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Image Instructions
                  <span className="text-xs text-gray-500 ml-1">(AI prompt preview)</span>
                </label>
                <textarea
                  value={selectedImage?.analysis ? 
                    `Place this product in ${selectedEnvironment || selectedImage.analysis.naturalEnvironments[0] || 'a natural environment'}. The product should be prominently displayed and maintain its original appearance. Create a professional, photorealistic composition that showcases the product effectively.` : 
                    ''
                  }
                  className="w-full p-2 border border-blue-200 bg-blue-50 rounded-md text-sm resize-none font-mono"
                  rows={2}
                  placeholder="AI generation instructions will appear here"
                  readOnly
                  disabled={!selectedImage}
                />
              </div>
                
                {/* Natural Environments */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Natural Environment Options
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Choose where your product will be placed in the scene</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {selectedImage?.analysis?.naturalEnvironments ? (
                      selectedImage.analysis.naturalEnvironments.slice(0, 9).map((environment, index) => (
                      <button
                        key={environment}
                        onClick={() => setSelectedEnvironment(environment)}
                        className={`p-1.5 rounded-md border text-left text-xs transition-all ${
                          selectedEnvironment === environment
                            ? 'bg-green-100 border-green-500 text-green-900 ring-1 ring-green-200'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{environment}</span>
                          <div className="flex items-center gap-1">
                            {index === 0 && selectedEnvironment === environment && <span className="text-yellow-500">⭐</span>}
                            {selectedEnvironment === environment && <span className="text-green-600">✓</span>}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    // Empty placeholders when no data
                    [1, 2, 3, 4, 5, 6].map(i => (
                      <button key={i} className="p-2 rounded-md border text-left text-sm bg-gray-100 border-gray-200" disabled>
                        <span className="text-gray-400">-</span>
                      </button>
                    ))
                  )}
                  </div>
                </div>
                
                {/* Text Generation - NEW */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Text (Optional)</label>
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
                            ? 'bg-pink-500 text-white' 
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
                : 'bg-pink-500 text-white hover:bg-pink-600'
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