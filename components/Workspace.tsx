import React from 'react';
import { ImageIcon, WarningIcon, UploadIcon, PlusIcon } from './Icons';
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
        'generating_text': 'Peeling back the creative layers...',
        'generating_image': 'Going bananas with your design...',
        'editing': 'Adding the perfect split...',
        'describing': 'Finding the ripest ideas...',
        'idle': 'Warming up the banana stand...',
    };
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center bg-white rounded-lg">
        <div className="relative w-32 h-32 mb-6">
          {/* Banana SVG with peeling animation */}
          <svg className="w-full h-full animate-bounce" viewBox="0 0 100 100">
            {/* Banana body */}
            <path 
              d="M30 50 Q20 30, 40 25 T70 30 Q80 40, 75 55 T60 70 Q45 75, 30 65 Z"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
            />
            {/* Peeling parts */}
            <path 
              d="M40 25 Q35 15, 45 20"
              fill="#FFF8DC"
              stroke="#FFA500"
              strokeWidth="1.5"
              className="animate-pulse origin-bottom"
              style={{ animation: 'peel 2s ease-in-out infinite' }}
            />
            <path 
              d="M55 28 Q50 18, 60 23"
              fill="#FFF8DC"
              stroke="#FFA500"
              strokeWidth="1.5"
              className="animate-pulse origin-bottom"
              style={{ animation: 'peel 2s ease-in-out infinite 0.3s' }}
            />
            <path 
              d="M65 32 Q60 22, 70 27"
              fill="#FFF8DC"
              stroke="#FFA500"
              strokeWidth="1.5"
              className="animate-pulse origin-bottom"
              style={{ animation: 'peel 2s ease-in-out infinite 0.6s' }}
            />
            {/* Banana spots */}
            <circle cx="45" cy="45" r="2" fill="#8B4513" opacity="0.3" />
            <circle cx="55" cy="50" r="1.5" fill="#8B4513" opacity="0.3" />
            <circle cx="50" cy="58" r="1.8" fill="#8B4513" opacity="0.3" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-yellow-600 mb-2">{messages[state]}</h3>
        <p className="text-lg text-gray-600">Just a split second more...</p>
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
    <div className="flex flex-col items-center justify-center text-center h-full">
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
          className="flex flex-col items-center justify-center aspect-square w-full max-w-[400px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-500 hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center p-8">
              <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
              <p className="mb-2 text-xl content-subtitle">
                <span className="font-semibold text-yellow-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm footer-text">PNG, JPG, or WEBP (Max 4MB)</p>
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


  return (
    <div className="flex flex-col w-full h-full">
        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center p-6" style={{ paddingTop: '200px' }}>
            <div className="w-full h-full max-w-2xl flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
        
        {isContentGenerated && (
             <EditingTools {...props} />
        )}
    </div>
  );
};