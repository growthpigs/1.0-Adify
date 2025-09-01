import React from 'react';
import { ImageIcon, WarningIcon, UploadIcon } from './Icons';
import { EditingTools } from './EditingTools';
// FIX: Import LastGenerationParams to use in props.
import { LoadingState, LastGenerationParams } from '../App';
import { GeneratedContent, FacebookAdContent, MockupContent } from '../types';
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
  // FIX: Add missing lastGenerationParams prop.
  lastGenerationParams: LastGenerationParams | null;
}

const LoadingIndicator: React.FC<{ state: LoadingState }> = ({ state }) => {
    const messages = {
        'generating_text': 'Writing compelling ad copy...',
        'generating_image': 'Making your ad...',
        'editing': 'Applying your edits...',
        'describing': 'Analyzing your product...',
        'idle': 'Getting ready...',
    };
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center bg-white rounded-lg">
        <div className="relative w-24 h-24 mb-6">
          <div className="loading-spinner"></div>
          <div className="loading-spinner-active"></div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{messages[state]}</h3>
        <p className="text-lg text-gray-600">This can take a moment.</p>
      </div>
    );
};

const InitialState: React.FC<{ onImageUpload: (file: File, previewUrl: string) => void }> = ({ onImageUpload }) => {
  const handleFile = (file: File | undefined) => {
    console.log('🔥 WORKSPACE: handleFile called with:', file ? file.name : 'null');
    
    if (file && file.type.startsWith('image/')) {
      console.log('✅ WORKSPACE: Valid image file, creating FileReader...');
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('📖 WORKSPACE: FileReader finished, calling onImageUpload...');
        if (typeof reader.result === 'string') {
          onImageUpload(file, reader.result);
          console.log('✅ WORKSPACE: onImageUpload called successfully');
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ WORKSPACE: Invalid file or not an image');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📂 WORKSPACE: File input change event fired!');
    const selectedFile = event.target.files?.[0];
    console.log('📁 WORKSPACE: Selected file:', selectedFile);
    handleFile(selectedFile);
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    console.log('🎯 WORKSPACE: Drop event fired!');
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    console.log('📁 WORKSPACE: Dropped file:', droppedFile);
    handleFile(droppedFile);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto">
        <h3 className="section-header text-3xl mb-2">Automatic Ad Generation</h3>
        <p className="content-subtitle mb-8">Upload your product image and we'll instantly create professional mockups using AI analysis.</p>
        
        <input
          type="file"
          id="workspace-file-upload"
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <label 
          htmlFor="workspace-file-upload"
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-12 h-12 mb-4 text-gray-400" />
              <p className="mb-2 text-base content-subtitle">
                <span className="font-semibold text-pink-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs footer-text">PNG, JPG, or WEBP (Max 4MB)</p>
          </div>
        </label>
    </div>
  );
};

const ErrorState: React.FC<{ error: string }> = ({ error }) => {
    const isSafetyError = error.includes('PROHIBITED_CONTENT') || error.includes('SAFETY');
    const isPersonPhoto = error.includes('photos of people') || error.includes('privacy and consent');
    return (
      <div className="flex flex-col items-center justify-center text-center p-6">
          <WarningIcon className="w-16 h-16 text-red-600 mb-6" />
          <h3 className="section-header text-xl mb-4 text-red-600">Generation Failed</h3>
          <div className="status-error max-w-md">{error}</div>
          {isSafetyError && (
              <div className="status-warning max-w-md mt-4 text-left">
                  <h4 className="content-title mb-2">Safety Filter Detected</h4>
                  <p className="content-subtitle mb-3">To get the best results, please try:</p>
                  <ul className="list-disc list-inside space-y-1 content-subtitle">
                      {isPersonPhoto && (
                          <li><strong>For photos with people:</strong> Try the "Professional Portrait Frame" format which is designed to work better with personal photos.</li>
                      )}
                      <li>Select a simpler ad format (like "Urban Billboard" or "Magazine Ad").</li>
                      <li>Use a product image without people if possible.</li>
                      <li>Try a different slogan style (avoid provocative language).</li>
                  </ul>
                   <p className="content-subtitle mt-3">The AI has strict safety filters for photos containing people to protect privacy and prevent misuse.</p>
              </div>
          )}
      </div>
    );
};


export const Workspace: React.FC<WorkspaceProps> = (props) => {
  const { loadingState, generatedContent, error, isContentGenerated, isRepositionMode, onRepositionClick, sessionGallery, onSelectFromGallery, onImageUpload } = props;

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isRepositionMode || !generatedContent || 'headline' in generatedContent) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    onRepositionClick(x, y);
  };

  const renderContent = () => {
    if (loadingState !== 'idle') return <LoadingIndicator state={loadingState} />;
    if (error) return <ErrorState error={error} />;
    if (generatedContent) {
        if ('headline' in generatedContent) { // It's a FacebookAdContent
            return <FacebookAdPreview content={generatedContent} onTextChange={props.onFacebookAdTextChange} />
        } else { // It's a MockupContent
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

  const renderGalleryItem = (content: GeneratedContent, index: number) => {
      return (
        <button 
            key={index} 
            onClick={() => onSelectFromGallery(content)} 
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-pink-500 focus:border-pink-500 focus:outline-none transition-all hover:scale-105"
            aria-label={`Select variation ${index + 1}`}
        >
            <img src={content.imageUrl} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
        </button>
      )
  }

  return (
    <div className="flex flex-col w-full h-full gap-4">
        {sessionGallery.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="section-header mb-3">Session Variations</h3>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                    {sessionGallery.map(renderGalleryItem)}
                </div>
            </div>
        )}
        
        <div className="flex-grow bg-white border border-gray-200 rounded-lg w-full min-h-[50vh] max-h-[60vh] flex items-center justify-center p-6">
            {renderContent()}
        </div>
        
        {isContentGenerated && (
             <EditingTools {...props} />
        )}
    </div>
  );
};