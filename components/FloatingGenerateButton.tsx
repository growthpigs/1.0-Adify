import React from 'react';
import { Sparkles, Image, ChevronUp } from 'lucide-react';

interface FloatingGenerateButtonProps {
  hasImage: boolean;
  selectedFormat: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onScrollToTop: () => void;
}

export default function FloatingGenerateButton({
  hasImage,
  selectedFormat,
  isGenerating,
  onGenerate,
  onScrollToTop
}: FloatingGenerateButtonProps) {
  const canGenerate = hasImage && selectedFormat && !isGenerating;

  if (!hasImage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to Top Button - Always visible */}
      <button
        onClick={onScrollToTop}
        className="group bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all duration-200 hover:shadow-xl border border-gray-200"
        title="Back to format selection"
      >
        <ChevronUp className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
      </button>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`
          group relative flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl
          ${canGenerate 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
          }
        `}
        title={
          !selectedFormat 
            ? "Please select a format first" 
            : isGenerating 
            ? "Generation in progress..." 
            : "Generate new creation"
        }
      >
        {/* Animated pulse effect when ready */}
        {canGenerate && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20" />
        )}

        {/* Icon */}
        <div className="relative">
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className={`w-5 h-5 ${canGenerate ? 'animate-pulse' : ''}`} />
          )}
        </div>

        {/* Text */}
        <span className="relative">
          {isGenerating ? 'Generating...' : 'Generate'}
        </span>

        {/* Format indicator */}
        {selectedFormat && !isGenerating && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            Ready!
          </span>
        )}
      </button>

      {/* Helper text */}
      {!selectedFormat && hasImage && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg shadow-lg">
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
          Select a format above to generate
        </div>
      )}
    </div>
  );
}