import React, { useState, useRef } from 'react';
import { Sparkles, Type, Image, Plus, RotateCcw, Redo, Upload, ChevronDown, Send } from 'lucide-react';
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
  isDisabled?: boolean;
}

export const EditingTools: React.FC<EditingToolsProps> = ({
  generatedContent, 
  onEdit, 
  onUndo, 
  onRedo, 
  onReset, 
  onUploadNew, 
  canUndo, 
  canRedo, 
  isLoading,
  onRegenerateImage, 
  onRegenerateText, 
  onNewVariation, 
  lastGenerationParams,
  isDisabled = false,
  containerWidth = 785
}) => {
  const [adjustmentInput, setAdjustmentInput] = useState('');
  const [showImageMenu, setShowImageMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isFacebookAd = generatedContent && 'headline' in generatedContent;
  const disabled = isDisabled || isLoading || isFacebookAd;

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustmentInput.trim() && !isLoading) {
      onEdit(adjustmentInput);
      setAdjustmentInput('');
    }
  };

  const handleImageAction = (action: string) => {
    setShowImageMenu(false);
    if (action === 'replace') {
      onUploadNew();
    } else if (action === 'upload') {
      fileInputRef.current?.click();
    } else {
      const prompts: Record<string, string> = {
        'merge': 'Merge the uploaded image with the current image, blending them naturally',
        'swap': 'Replace the main product with the new uploaded image while keeping the same style',
        'overlay': 'Overlay the new image on top of the current image as a layer'
      };
      if (prompts[action]) {
        onEdit(prompts[action]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onEdit(`Add this image to the current design: ${base64.substring(0, 100)}...`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white space-y-2" style={{ width: `${containerWidth}px` }}>
      {/* Tool Buttons Row */}
      <div className="flex items-center justify-center gap-2 px-4">
        <button
          onClick={onNewVariation}
          disabled={disabled}
          className="px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          title="New Variation"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Variation</span>
        </button>
        
        <button
          onClick={onRegenerateText}
          disabled={disabled || !lastGenerationParams}
          className="px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          title="New Text"
        >
          <Type className="w-4 h-4" />
          <span>New Text</span>
        </button>
        
        <button
          onClick={onRegenerateImage}
          disabled={disabled}
          className="px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          title="New Image"
        >
          <Image className="w-4 h-4" />
          <span>New Image</span>
        </button>

        {/* Add Image Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowImageMenu(!showImageMenu)}
            disabled={disabled}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showImageMenu && (
            <div className="absolute right-0 bottom-full mb-1 w-40 bg-white border border-gray-200/80 rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleImageAction('merge')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Merge Images
              </button>
              <button
                onClick={() => handleImageAction('swap')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Swap Product
              </button>
              <button
                onClick={() => handleImageAction('overlay')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Overlay Image
              </button>
              <div className="border-t border-gray-200/80" />
              <button
                onClick={() => handleImageAction('replace')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Replace All
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200/80 mx-2" />

        {/* History Controls */}
        <button
          onClick={onUndo}
          disabled={!canUndo || disabled}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo || disabled}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200/80 mx-2" />

        <button
          onClick={onUploadNew}
          disabled={disabled}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Upload New Image"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Input - Taller */}
      <form onSubmit={handleAdjustmentSubmit} className="relative px-4 pb-4">
        <textarea
          value={adjustmentInput}
          onChange={(e) => setAdjustmentInput(e.target.value)}
          placeholder="Describe changes (e.g., 'make it brighter', 'add sunset background', 'change to summer theme')"
          className="w-full px-4 pr-16 py-3 text-base border border-gray-300/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 resize-none"
          style={{ backgroundColor: '#fffef9' }}
          disabled={disabled}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAdjustmentSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !adjustmentInput.trim()}
          className="absolute right-6 p-2.5 text-gray-500 hover:text-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};