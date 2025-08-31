
import React, { useState, useCallback, useEffect } from 'react';
import { AdFormat, SloganType, UploadedImage, FacebookAdContent, GeneratedContent, MockupContent, SmartProductInput } from './types';
import { generateAdMockup, generateSlogan, editImage, describeImage, generateFacebookAdContent } from './services/geminiService';
import { generateMockAnalysis, generateNaturalEnvironmentPrompt, getNaturalEnvironmentFormat } from './services/mockIntelligence';
import { defaultImageBase64, base64ToFile } from './utils/imageUtils';
import ImageUploader from './components/ImageUploader';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { SmartAnalysisPopup } from './components/SmartAnalysisPopup';
import { SmartProductInput as SmartProductInputComponent } from './components/SmartProductInput';
import { AnalysisLoader } from './components/AnalysisLoader';
import { GenerationProgress } from './components/GenerationProgress';

export type LoadingState = 'idle' | 'describing' | 'generating_text' | 'generating_image' | 'editing';

export interface LastGenerationParams {
    format: AdFormat;
    sloganType: SloganType | null;
    slogan: string;
    description: string;
    selectedImage: UploadedImage;
}


// FIX: Removed invalid text nodes and implemented the full App component.
export const App: React.FC = () => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
    const [imageDescription, setImageDescription] = useState('');
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRepositionMode, setIsRepositionMode] = useState(false);
    const [history, setHistory] = useState<(GeneratedContent | null)[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
    const [sessionGallery, setSessionGallery] = useState<GeneratedContent[]>([]);
    const [lastGenerationParams, setLastGenerationParams] = useState<LastGenerationParams | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
    const [selectedSloganType, setSelectedSloganType] = useState<SloganType | null>(null);
    
    // Smart Analysis State
    const [smartInput, setSmartInput] = useState<SmartProductInput>({
        title: '',
        description: '',
        industry: null,
        targetAudiences: [],
        isAnalysisConfirmed: false,
        analysis: null
    });
    const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
    const [isNaturalEnvironmentSelected, setIsNaturalEnvironmentSelected] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFormatsForGeneration, setSelectedFormatsForGeneration] = useState<AdFormat[]>([]);
    
    const generatedContent = history[currentHistoryIndex] ?? null;
    const isContentGenerated = generatedContent !== null;
    const isLoading = loadingState !== 'idle';
    const canUndo = currentHistoryIndex > 0;
    const canRedo = currentHistoryIndex < history.length - 1;

    // Default image setup
    useEffect(() => {
        const init = () => {
            try {
                const file = base64ToFile(defaultImageBase64, "default_product.png");
                const defaultImage: UploadedImage = {
                    id: 'default-0',
                    file: file,
                    previewUrl: defaultImageBase64
                };
                setUploadedImages([defaultImage]);
                setSelectedImage(defaultImage);
            } catch (error) {
                console.error('Failed to load default image:', error);
                setError('Failed to load default image');
            }
        };
        init();
    }, []);

    const updateHistory = (newContent: GeneratedContent | null) => {
        const newHistory = history.slice(0, currentHistoryIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
    };

    const handleImageUpload = useCallback(async (file: File, previewUrl: string) => {
        const newImage: UploadedImage = {
            id: `${file.name}-${new Date().getTime()}`,
            file,
            previewUrl,
        };
        setUploadedImages(prev => [newImage, ...prev]);
        setSelectedImage(newImage);
        setHistory([]);
        setCurrentHistoryIndex(-1);
        setError(null);
        setSessionGallery([]);
        setLastGenerationParams(null);
        
        // Trigger smart analysis with loading indicator
        setIsAnalyzing(true);
        try {
            // Add minimum 3-second delay for users to read the loader
            const [analysis] = await Promise.all([
                generateMockAnalysis(file, smartInput.description),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            
            setSmartInput(prev => ({
                ...prev,
                title: analysis.suggestedTitle,
                industry: analysis.detectedIndustry,
                targetAudiences: analysis.recommendedAudiences,
                description: prev.description || analysis.userStory,
                analysis,
                isAnalysisConfirmed: false
            }));
            setShowAnalysisPopup(true);
        } catch (error) {
            console.warn('Smart analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [smartInput.description]);

    const handleGenerateDescription = useCallback(async () => {
        if (!selectedImage) return;
        setIsDescriptionLoading(true);
        setError(null);
        try {
            const desc = await describeImage(selectedImage.file);
            setImageDescription(desc);
        } catch (e: any) {
            setError(e.message || 'Failed to generate description.');
        } finally {
            setIsDescriptionLoading(false);
        }
    }, [selectedImage]);

    useEffect(() => {
        if (selectedImage) {
            handleGenerateDescription();
        }
    }, [selectedImage, handleGenerateDescription]);

    const handleGenerate = useCallback(async () => {
        const format = selectedFormat;
        const sloganType = selectedSloganType;
        
        // Use smart input description if available, fallback to legacy field
        const description = smartInput.description || imageDescription;
        
        // Check if Natural Environment is selected
        if (isNaturalEnvironmentSelected) {
            // Use Natural Environment format - treat it like any other format
            const naturalFormat = getNaturalEnvironmentFormat();
            if (!naturalFormat) {
                setError("Natural Environment format not available.");
                return;
            }
            
            // Use the Natural Environment format with its built-in prompt
            setError(null);
            setLoadingState('generating_image');

            try {
                let slogan = '';
                if (sloganType) {
                    setLoadingState('generating_text');
                    slogan = await generateSlogan(selectedImage.file, sloganType);
                }
                
                setLastGenerationParams({ format: naturalFormat, sloganType, slogan, description, selectedImage });
                setLoadingState('generating_image');
                
                const result = await generateAdMockup(selectedImage.file, naturalFormat.prompt, slogan, description);
                if (!result.imageUrl) throw new Error("Natural environment generation failed.");

                const newContent: MockupContent = { imageUrl: result.imageUrl, slogan };
                updateHistory(newContent);
                setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
            } catch (e: any) {
                setError(e.message || 'Failed to generate natural environment mockup.');
                updateHistory(null);
            } finally {
                setLoadingState('idle');
            }
            return;
        }
        
        if (!format) {
            // Auto-select Natural Environment format if none selected
            const naturalEnvironmentFormat = AD_FORMATS.find(f => f.name === 'Natural Environment');
            if (naturalEnvironmentFormat) {
                setSelectedFormat(naturalEnvironmentFormat);
                format = naturalEnvironmentFormat;
            } else {
                setError("Please select an ad format first.");
                return;
            }
        }
        
        if (!selectedImage || !description) {
            setError("Please upload an image and provide a description first.");
            return;
        }

        setError(null);
        const isImageTask = format.type === 'mockup' || format.type === 'social' || format.type === 'facebook';
        setLoadingState(isImageTask ? 'generating_image' : 'generating_text');

        try {
            let slogan = '';
            if (sloganType) {
                setLoadingState('generating_text');
                slogan = await generateSlogan(selectedImage.file, sloganType);
            }
            
            setLastGenerationParams({ format, sloganType, slogan, description, selectedImage });

            if (format.type === 'mockup' || format.type === 'social') {
                setLoadingState('generating_image');
                const result = await generateAdMockup(selectedImage.file, format.prompt, slogan, description);
                if (!result.imageUrl) throw new Error("Image generation failed to return an image URL.");
                const newContent: MockupContent = { imageUrl: result.imageUrl, slogan };
                updateHistory(newContent);
                setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
            } else if (format.type === 'facebook') {
                setLoadingState('generating_text');
                const fbContent = await generateFacebookAdContent(format, description);
                setLoadingState('generating_image');
                
                // For Facebook, we generate a new image based on the prompt, but also featuring the product
                const result = await generateAdMockup(selectedImage.file, fbContent.imagePrompt, '', description);
                if (!result.imageUrl) throw new Error("Facebook Ad image generation failed to return an image URL.");

                const newContent: FacebookAdContent = {
                    imageUrl: result.imageUrl,
                    headline: fbContent.headline,
                    bodyText: fbContent.bodyText,
                };
                updateHistory(newContent);
                setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
            }

        } catch (e: any) {
            console.error("Generation failed:", e);
            setError(e.message || 'An unknown error occurred during generation.');
            updateHistory(null); // Add a null entry to history to represent the failed state
        } finally {
            setLoadingState('idle');
        }
    }, [selectedImage, imageDescription, history, currentHistoryIndex, selectedFormat, selectedSloganType]);

    const handleEdit = useCallback(async (editPrompt: string) => {
        const currentContent = history[currentHistoryIndex];
        if (!currentContent || !currentContent.imageUrl) return;
        
        setError(null);
        setLoadingState('editing');
        try {
            const result = await editImage(currentContent.imageUrl, editPrompt);
            if (!result.imageUrl) throw new Error("Image editing failed to return an image URL.");
            // Preserve other properties of the content object
            const newContent: GeneratedContent = { ...currentContent, imageUrl: result.imageUrl };
            updateHistory(newContent);
        } catch (e: any) {
            setError(e.message || 'Failed to edit image.');
        } finally {
            setLoadingState('idle');
        }
    }, [currentHistoryIndex, history]);
    
    const handleRegenerateImage = useCallback(async () => {
        if (!lastGenerationParams) return;
        const { format, slogan, description, selectedImage } = lastGenerationParams;
        
        setError(null);
        setLoadingState('generating_image');
        try {
            const result = await generateAdMockup(selectedImage.file, format.prompt, slogan, description);
            if (!result.imageUrl) throw new Error("Image regeneration failed.");
            
            const newContent: MockupContent = { imageUrl: result.imageUrl, slogan };
            updateHistory(newContent);
            setSessionGallery(prev => [newContent, ...prev].slice(0, 16));

        } catch (e: any) {
            setError(e.message || 'Failed to regenerate image.');
            updateHistory(null);
        } finally {
            setLoadingState('idle');
        }
    }, [lastGenerationParams]);
    
    const handleRegenerateText = useCallback(async () => {
        if (!lastGenerationParams || !lastGenerationParams.sloganType || !generatedContent) return;
        const { format, sloganType, description, selectedImage } = lastGenerationParams;

        setError(null);
        setLoadingState('generating_text');
        try {
            const newSlogan = await generateSlogan(selectedImage.file, sloganType);
            setLastGenerationParams(prev => prev ? { ...prev, slogan: newSlogan } : null);
            setLoadingState('generating_image');
            const result = await generateAdMockup(selectedImage.file, format.prompt, newSlogan, description);
            if (!result.imageUrl) throw new Error("Image regeneration after text regeneration failed.");

            const newContent: MockupContent = { imageUrl: result.imageUrl, slogan: newSlogan };
            updateHistory(newContent);
            setSessionGallery(prev => [newContent, ...prev].slice(0, 16));
        } catch (e: any) {
            setError(e.message || 'Failed to regenerate text and image.');
            updateHistory(null);
        } finally {
            setLoadingState('idle');
        }
    }, [lastGenerationParams, generatedContent]);

    const handleNewVariation = useCallback(async () => {
        if (!lastGenerationParams) return;
        // Regenerate with the same parameters
        await handleGenerate();
    }, [lastGenerationParams, handleGenerate]);

    const handleFacebookAdTextChange = (newContent: Partial<FacebookAdContent>) => {
        if (generatedContent && 'headline' in generatedContent) {
            const updatedContent = { ...generatedContent, ...newContent };
            const newHistory = [...history];
            newHistory[currentHistoryIndex] = updatedContent;
            setHistory(newHistory);
        }
    };
    
    const handleUndo = () => canUndo && setCurrentHistoryIndex(currentHistoryIndex - 1);
    const handleRedo = () => canRedo && setCurrentHistoryIndex(currentHistoryIndex + 1);
    const handleReset = () => {
        if (history.length > 0 && currentHistoryIndex > 0) {
            const firstState = history[0];
            setHistory([firstState]);
            setCurrentHistoryIndex(0);
        }
    };

    const handleUploadNew = () => {
        setSelectedImage(null);
        setImageDescription('');
        setHistory([]);
        setCurrentHistoryIndex(-1);
        setError(null);
        setSessionGallery([]);
        setLastGenerationParams(null);
    };

    const handleSelectFromLibrary = (image: UploadedImage) => {
        if (image.id !== selectedImage?.id) {
            setSelectedImage(image);
            setHistory([]);
            setCurrentHistoryIndex(-1);
            setError(null);
            setSessionGallery([]);
            setLastGenerationParams(null);
        }
    };
    
    const handleSelectFromGallery = (content: GeneratedContent) => {
        updateHistory(content);
    };

    // Smart Analysis Handlers
    const handleAnalysisConfirm = () => {
        setSmartInput(prev => ({ ...prev, isAnalysisConfirmed: true }));
        setShowAnalysisPopup(false);
        // Sync with legacy description field for compatibility
        setImageDescription(smartInput.description);
    };

    const handleAnalysisEdit = () => {
        setShowAnalysisPopup(false);
        // User will edit manually in the input fields
    };

    const handleAnalysisClose = () => {
        setShowAnalysisPopup(false);
        // Keep the suggestions but user can edit them
    };

    const handleNaturalEnvironment = () => {
        // Simple toggle - don't generate immediately
        setIsNaturalEnvironmentSelected(prev => !prev);
        setSelectedFormat(null); // Clear regular format selection when toggling on
        setError(null);
    };

    const handleSmartInputChange = (newInput: SmartProductInput) => {
        setSmartInput(newInput);
        // Sync description with legacy field for compatibility
        setImageDescription(newInput.description);
    };

    const handleToggleRepositionMode = () => setIsRepositionMode(prev => !prev);
    const handleRepositionClick = (x: number, y: number) => {
        const prompt = `Keeping everything else the same, move the main text or slogan to be centered around the click coordinates (${x.toFixed(2)}, ${y.toFixed(2)}), where (0,0) is the top-left corner and (1,1) is the bottom-right corner of the image. The product placement should not change.`;
        handleEdit(prompt);
        setIsRepositionMode(false);
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow flex">
                <Sidebar
                    imageLibrary={uploadedImages}
                    selectedImage={selectedImage}
                    onSelectFromLibrary={handleSelectFromLibrary}
                    onGenerate={handleGenerate}
                    isLoading={isLoading || isAnalyzing}
                    smartInput={smartInput}
                    onSmartInputChange={handleSmartInputChange}
                    isDescriptionLoading={isDescriptionLoading}
                    onImageUpload={handleImageUpload}
                    onGenerateDescription={handleGenerateDescription}
                    selectedSloganType={selectedSloganType}
                    onSelectSloganType={setSelectedSloganType}
                />
                <div className="flex-grow px-6 py-6">
                    <div className="flex-1 min-w-0">
                        {/* Generation Progress */}
                        <GenerationProgress 
                            loadingState={loadingState}
                            isNaturalEnvironment={isNaturalEnvironmentSelected}
                            selectedFormatName={selectedFormat?.name}
                        />
                        
                        <Workspace
                            loadingState={loadingState}
                            generatedContent={generatedContent}
                            error={error}
                            onEdit={handleEdit}
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            onReset={handleReset}
                            onUploadNew={handleUploadNew}
                            canUndo={canUndo}
                            canRedo={canRedo}
                            isContentGenerated={isContentGenerated}
                            isLoading={isLoading}
                            isRepositionMode={isRepositionMode}
                            onToggleRepositionMode={handleToggleRepositionMode}
                            onRepositionClick={handleRepositionClick}
                            onRegenerateImage={handleRegenerateImage}
                            onRegenerateText={handleRegenerateText}
                            onNewVariation={handleNewVariation}
                            sessionGallery={sessionGallery}
                            onSelectFromGallery={handleSelectFromGallery}
                            onFacebookAdTextChange={handleFacebookAdTextChange}
                            onImageUpload={handleImageUpload}
                            lastGenerationParams={lastGenerationParams}
                        />
                    </div>
                </div>
            </main>

            {/* Analysis Loading Indicator */}
            {isAnalyzing && <AnalysisLoader />}
            
            {/* Smart Analysis Popup */}
            {smartInput.analysis && (
                <SmartAnalysisPopup
                    analysis={smartInput.analysis}
                    isVisible={showAnalysisPopup}
                    onConfirm={handleAnalysisConfirm}
                    onEdit={handleAnalysisEdit}
                    onClose={handleAnalysisClose}
                    onUpdateAnalysis={(updates) => {
                        setSmartInput(prev => ({
                            ...prev,
                            analysis: prev.analysis ? { ...prev.analysis, ...updates } : null
                        }));
                    }}
                    onGenerate={async (selectedFormats) => {
                        // If no formats selected, use Natural Environment automatically
                        let formatsToUse = selectedFormats;
                        
                        if (formatsToUse.length === 0) {
                            // Auto-select Natural Environment for smart generation
                            const naturalEnvFormat = AD_FORMATS.find(f => f.name === 'Natural Environment');
                            if (naturalEnvFormat) {
                                formatsToUse = [naturalEnvFormat];
                                console.log('Auto-selected Natural Environment format');
                            }
                        }
                        
                        console.log('Generating ads for formats:', formatsToUse);
                        
                        if (formatsToUse.length > 0 && selectedImage) {
                            // Set the first format and generate
                            setSelectedFormat(formatsToUse[0]);
                            
                            // Close the popup first
                            setShowAnalysisPopup(false);
                            
                            // Start generation
                            await handleGenerate();
                        }
                    }}
                />
            )}
        </div>
    );
};
