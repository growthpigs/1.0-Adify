import React, { useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File, previewUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {

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
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  }, [handleFile]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
      <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Start Your Creation</h2>
      <p className="text-gray-500 mb-6">Upload your product image to enter the creative studio.</p>
      
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <label 
        htmlFor="file-upload"
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center w-full min-h-[250px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
            <p className="mb-2 text-base text-gray-500"><span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, or WEBP (Max 4MB)</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;