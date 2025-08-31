import React from 'react';
import { SloganType, UploadedImage, SmartProductInput } from '../types';
import { PlusIcon, SparklesIcon } from './Icons';
import { SmartProductInput as SmartProductInputComponent } from './SmartProductInput';

interface SidebarProps {
  imageLibrary: UploadedImage[];
  selectedImage: UploadedImage;
  onSelectFromLibrary: (image: UploadedImage) => void;
  onGenerate: () => void;
  isLoading: boolean;
  smartInput: SmartProductInput;
  onSmartInputChange: (input: SmartProductInput) => void;
  isDescriptionLoading: boolean;
  onImageUpload: (file: File, previewUrl: string) => void;
  onGenerateDescription: () => void;
  selectedSloganType: SloganType | null;
  onSelectSloganType: (type: SloganType | null) => void;
}

const MAX_DESC_LENGTH = 800;

const DescriptionLoader: React.FC = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-16 bg-gray-200 rounded-md"></div>
    <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto"></div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  imageLibrary,
  selectedImage,
  onSelectFromLibrary,
  onGenerate,
  isLoading,
  smartInput,
  onSmartInputChange,
  isDescriptionLoading,
  onImageUpload,
  onGenerateDescription,
  selectedSloganType,
  onSelectSloganType,
}) => {
  const sloganTypes: { id: SloganType; name: string }[] = [
    { id: 'hook', name: 'Hook' },
    { id: 'tagline', name: 'Tagline' },
    { id: 'meme', name: 'Meme' },
    { id: 'joke', name: 'Joke' },
    { id: 'quote', name: 'Quote' },
    { id: 'fun_fact', name: 'Fun Fact' },
  ];

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
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Image Library */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="section-header">Image Library</h3>
        <div className="image-grid">
          <label 
            htmlFor="sidebar-file-upload"
            className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors"
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
            <button 
              key={image.id}
              onClick={() => onSelectFromLibrary(image)}
              className={`image-item ${selectedImage.id === image.id ? 'image-item-selected' : ''}`}
              aria-label="Select product image"
            >
              <img src={image.previewUrl} alt="Product" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Smart Product Input */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="section-header mb-4">Product Details</h3>
        <SmartProductInputComponent
          input={smartInput}
          isLoading={isLoading}
          isDescriptionLoading={isDescriptionLoading}
          onInputChange={onSmartInputChange}
          onGenerateDescription={onGenerateDescription}
        />
      </div>

      {/* Slogan Style */}
      <div className="p-4 flex-grow">
        <h3 className="section-header">Slogan Style (Optional)</h3>
        <div className="grid grid-cols-2 gap-2">
          {sloganTypes.map(type => (
            <button
              key={type.id}
              onClick={() => onSelectSloganType(selectedSloganType === type.id ? null : type.id)}
              disabled={isLoading}
              className={`
                py-2 px-3 text-xs rounded-md transition-all font-medium
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

      {/* Generate Button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="btn-primary w-full py-2.5"
        >
          {isLoading ? 'Generating...' : 'Generate Ad'}
        </button>
      </div>
    </aside>
  );
};