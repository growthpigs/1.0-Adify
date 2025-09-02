import React, { useState, useEffect } from 'react';
import { EditingTools } from './EditingTools';
import { LoadingState, LastGenerationParams } from '../App';
import { GeneratedContent, FacebookAdContent } from '../types';
import { FacebookAdPreview } from './FacebookAdPreview';

interface WorkspaceProps {
  loadingState: LoadingState;
  generatedContent: GeneratedContent | null;
  error: string | null;
  onEdit: (prompt: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onUploadNew: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isContentGenerated: boolean;
  isLoading: boolean;
  isRepositionMode: boolean;
  onToggleRepositionMode: () => void;
  onRepositionClick: (x: number, y: number) => void;
  onRegenerateImage: () => void;
  onRegenerateText: () => void;
  onNewVariation: () => void;
  sessionGallery: GeneratedContent[];
  onSelectFromGallery: (content: GeneratedContent) => void;
  onFacebookAdTextChange: (newContent: Partial<FacebookAdContent>) => void;
  onImageUpload: (file: File, previewUrl: string) => void;
  lastGenerationParams: LastGenerationParams | null;
}

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="flex items-center justify-center w-full h-full">
        <div className="text-center p-6 max-w-md">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600">{error}</p>
        </div>
    </div>
);

const InitialState: React.FC<{ onImageUpload: (file: File, previewUrl: string) => void }> = ({ onImageUpload }) => {
  // Add CSS for animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rock {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      .banana-rock {
        animation: rock 3s ease-in-out infinite;
        transform-origin: center;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
    const selectedFile = event.target.files?.[0];
    handleFile(selectedFile);
    event.target.value = '';
  };

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  return (
    <label 
      htmlFor="workspace-file-upload"
      className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300/80 rounded-lg cursor-pointer hover:border-gray-400/80 transition-colors"
      style={{ backgroundColor: '#fafafa' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        id="workspace-file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="w-[60px] h-[60px] mb-3 banana-rock">
        <img 
          src="/banana-icon.png"
          alt="Banana"
          className="w-full h-full opacity-30"
        />
      </div>
      <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
      <p className="text-gray-500 text-sm mt-1">PNG, JPG, or WEBP (Max 4MB)</p>
    </label>
  );
};

export const Workspace: React.FC<WorkspaceProps> = (props) => {
  const { 
    loadingState, 
    generatedContent, 
    error, 
    isRepositionMode, 
    onRepositionClick, 
    onImageUpload,
    isContentGenerated 
  } = props;

  // Responsive width calculation: min 500px, max 785px
  const [containerWidth, setContainerWidth] = useState(785);
  
  useEffect(() => {
    const calculateWidth = () => {
      const viewportWidth = window.innerWidth;
      const sidebarWidth = 400;
      const padding = 80; // Account for workspace padding
      const availableWidth = viewportWidth - sidebarWidth - padding;
      
      // Scale between 500px (minimum for small screens) and 785px (full)
      const width = Math.min(785, Math.max(500, availableWidth));
      setContainerWidth(width);
    };
    
    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isRepositionMode || !generatedContent || 'headline' in generatedContent) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onRepositionClick(x, y);
  };

  const renderContent = () => {
    if (error) return <ErrorState error={error} />;
    
    if (generatedContent) {
      if ('headline' in generatedContent) {
        return <FacebookAdPreview content={generatedContent} onTextChange={props.onFacebookAdTextChange} />
      } else {
        return (
          <img 
            src={generatedContent.imageUrl} 
            alt="Generated ad mockup" 
            className={`w-full h-full object-contain ${isRepositionMode ? 'cursor-crosshair' : ''}`}
            onClick={handleImageClick}
          />
        );
      }
    }
    
    return <InitialState onImageUpload={onImageUpload} />;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Main Content Area - Square container for image with tools directly below */}
      <div className="flex-1 flex items-start justify-start p-8">
        <div className="flex flex-col items-center">
          {/* Square Image Container */}
          <div className="aspect-square rounded-lg overflow-hidden" style={{ width: `${containerWidth}px` }}>
            {renderContent()}
          </div>
          
          {/* Persistent Editing Tools - Locked to image container */}
          <div className="border-t border-gray-200/80 mt-4" style={{ width: `${containerWidth}px` }}>
            <EditingTools 
              {...props} 
              isDisabled={!generatedContent}
              containerWidth={containerWidth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};