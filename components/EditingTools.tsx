
import React, { useState } from 'react';
import { DownloadIcon, ImageIcon, MoveIcon, SparklesIcon, TextIcon } from './Icons';
import { GeneratedContent } from '../types';
import { LastGenerationParams } from '../App';

interface EditingToolsProps {
  generatedContent: GeneratedContent | null;
  onEdit: (prompt: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onUploadNew: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
  isRepositionMode: boolean;
  onToggleRepositionMode: () => void;
  onRegenerateImage: () => void;
  onRegenerateText: () => void;
  onNewVariation: () => void;
  lastGenerationParams: LastGenerationParams | null;
}

const TABS = ['Adjust', 'Reposition'];

export const EditingTools: React.FC<EditingToolsProps> = ({
  generatedContent, onEdit, onUndo, onRedo, onReset, onUploadNew, canUndo, canRedo, isLoading, isRepositionMode, onToggleRepositionMode,
  onRegenerateImage, onRegenerateText, onNewVariation, lastGenerationParams
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [adjustmentInput, setAdjustmentInput] = useState('');
  
  const isFacebookAd = generatedContent && 'headline' in generatedContent;
  const generatedImage = generatedContent?.imageUrl || null;

  const adjustments = [
    { name: 'Enhance Quality', prompt: 'Rerender the user\'s product image within the scene at the highest possible fidelity. Enhance its details, sharpen its lines, and remove any pixelation or artifacts as if it were a vector graphic. The overall composition and style must remain the same.' },
    { name: 'Blur Background', prompt: 'Apply a professional bokeh effect to blur the background, making the main subject stand out.' },
    { name: 'Warmer Lighting', prompt: 'Adjust the color temperature to give the image a warmer, more inviting golden-hour feel.' },
    { name: 'Studio Light', prompt: 'Re-light the image as if it were in a professional photo studio with clean, bright, and even lighting.' },
  ];

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustmentInput.trim()) {
      onEdit(adjustmentInput);
      setAdjustmentInput('');
    }
  };
  
  const handleTabClick = (index: number) => {
      if (isFacebookAd) return;
      setActiveTab(index);
      if (TABS[index] === 'Reposition') {
          if(!isRepositionMode) onToggleRepositionMode();
      } else {
          if(isRepositionMode) onToggleRepositionMode();
      }
  }
  
  const regenerationButtonClasses = "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="section-header mb-4">Generation Controls</h3>
      {/* Regeneration Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button onClick={onRegenerateImage} disabled={isLoading || isFacebookAd} className="btn-secondary-action flex-1 flex items-center justify-center gap-2 whitespace-nowrap">
          <ImageIcon className="w-4 h-4" />
          <span>Regen Image</span>
        </button>
        <button 
            onClick={onRegenerateText} 
            disabled={isLoading || isFacebookAd || !lastGenerationParams} 
            className="btn-secondary-action flex-1 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <TextIcon className="w-4 h-4" />
          <span>Regen Text</span>
        </button>
        <button onClick={onNewVariation} disabled={isLoading || isFacebookAd} className="btn-secondary-neutral flex-1 flex items-center justify-center gap-2 whitespace-nowrap">
          <SparklesIcon className="w-4 h-4" />
          <span>New Variation</span>
        </button>
      </div>

      {/* Top Bar with Tabs and History */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-6">
        <div>
          <h4 className="content-title mb-2">Editing Mode</h4>
          <div className="hidden sm:block">
            <nav className="flex space-x-2" aria-label="Tabs">
              {TABS.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(index)}
                  disabled={isFacebookAd}
                  className={`format-tab ${
                    activeTab === index && !isFacebookAd ? 'format-tab-active' : 'format-tab-inactive'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onUndo} disabled={!canUndo || isLoading} className="btn-secondary-neutral">Undo</button>
            <button onClick={onRedo} disabled={!canRedo || isLoading} className="btn-secondary-neutral">Redo</button>
        </div>
      </div>
      
      <div className={`mt-4 ${isFacebookAd ? 'opacity-50' : ''}`}>
        {activeTab === 0 && (
          <div className="space-y-4">
            <h4 className="content-title">Apply Professional Adjustment</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {adjustments.map(adj => (
                    <button 
                        key={adj.name} 
                        onClick={() => onEdit(adj.prompt)}
                        disabled={isLoading || isFacebookAd}
                        className={`py-2 px-3 text-xs rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap ${
                          adj.name === 'Enhance Quality' ? 'btn-secondary-action' : 'btn-secondary-neutral'
                        }`}
                    >
                      {adj.name === 'Enhance Quality' && <SparklesIcon className="w-3 h-3" />}
                      {adj.name}
                    </button>
                ))}
            </div>
            <form onSubmit={handleAdjustmentSubmit} className="flex gap-2">
              <input
                type="text"
                value={adjustmentInput}
                onChange={(e) => setAdjustmentInput(e.target.value)}
                placeholder="Or describe an adjustment (e.g., 'change background to a forest')"
                className="form-input flex-grow text-sm"
                disabled={isLoading || isFacebookAd}
              />
              <button type="submit" disabled={isLoading || isFacebookAd || !adjustmentInput.trim()} className="btn-primary px-4 py-2">Apply</button>
            </form>
          </div>
        )}

        {activeTab === 1 && !isFacebookAd && (
          <div className="flex flex-col items-center justify-center text-center p-4 min-h-[120px]">
              <MoveIcon className="w-8 h-8 mb-4 text-pink-500" />
              <h4 className="content-title mb-2">Reposition Mode Active</h4>
              <p className="content-subtitle">Click a location on the image above to move the slogan.</p>
          </div>
        )}
      </div>


      {/* Bottom Action Buttons */}
      <div className="border-t border-gray-200 mt-6 pt-4 flex items-center justify-between">
         <div className="flex space-x-2">
            <button onClick={onReset} disabled={!canUndo || isLoading} className="btn-secondary-alert">Reset</button>
            <button onClick={onUploadNew} disabled={isLoading} className="btn-secondary-neutral">Upload New</button>
         </div>
      </div>
   </div>
 );
}