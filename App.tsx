
import React, { useState, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AdFormat, SloganType, UploadedImage, FacebookAdContent, GeneratedContent, MockupContent, SmartProductInput } from './types';
import { generateAdMockup, generateSlogan, editImage, describeImage, generateFacebookAdContent, analyzeProduct } from './services/geminiService';
import { generateMockAnalysis, generateNaturalEnvironmentPrompt, getNaturalEnvironmentFormat } from './services/mockIntelligence';
import { AD_FORMATS } from './constants';
import ImageUploader from './components/ImageUploader';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { AnalysisCompleteNotification } from './components/AnalysisCompleteNotification';
import { PlusIcon } from './components/Icons';
import { AnalysisLoader } from './components/AnalysisLoader';
import { GenerationLoader } from './components/GenerationLoader';
import { EditingLoader } from './components/EditingLoader';
import { GenerationProgress } from './components/GenerationProgress';
import { AppSkeleton } from './components/SkeletonLoader';
import { ProductionStatusPanel } from './components/ProductionStatusPanel';

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
    console.log('🚀 APP: App component initializing...');
    
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
    const [bannerTab, setBannerTab] = useState<'uploads' | 'generations'>('uploads');
    const [lastGenerationParams, setLastGenerationParams] = useState<LastGenerationParams | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
    const [selectedSloganType, setSelectedSloganType] = useState<SloganType | null>(null);
    
    // Smart Analysis State
    const [smartInput, setSmartInput] = useState<SmartProductInput>({
        title: '',
        description: '',
        industry: null,
        targetAudience: null,
        isAnalysisConfirmed: false,
        analysis: null
    });
    const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
    const [isNaturalEnvironmentSelected, setIsNaturalEnvironmentSelected] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFormatsForGeneration, setSelectedFormatsForGeneration] = useState<AdFormat[]>([]);
    const [currentGenerationQueue, setCurrentGenerationQueue] = useState<{
        formats: AdFormat[];
        currentIndex: number;
        results: GeneratedContent[];
    } | null>(null);
    
    const generatedContent = history[currentHistoryIndex] ?? null;
    const isContentGenerated = generatedContent !== null;
    const isLoading = loadingState !== 'idle';
    const canUndo = currentHistoryIndex > 0;
    const canRedo = currentHistoryIndex < history.length - 1;

    // State to control initial loading/skeleton display
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    // Clean startup - show skeleton briefly then reveal app
    useEffect(() => {
        console.log('🏁 App initialized with clean state');
        // Show skeleton for a moment to prevent flash of empty content
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 500); // Brief delay for smooth transition
        
        return () => clearTimeout(timer);
    }, []);
    
    // Auto-select first image when images exist but none selected
    useEffect(() => {
        if (uploadedImages.length > 0 && !selectedImage) {
            console.log('🎯 Auto-selecting first image');
            setSelectedImage(uploadedImages[0]);
        }
    }, [uploadedImages.length]); // Only depend on length to avoid infinite loops

    const updateHistory = (newContent: GeneratedContent | null) => {
        const newHistory = history.slice(0, currentHistoryIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
    };

    const handleImageUpload = useCallback(async (file: File, previewUrl: string) => {
        console.log('📤 UPLOAD TRIGGERED: Image upload handler called!');
        console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });
        console.log('🖼️ Preview URL length:', previewUrl.length);
        
        const newImage: UploadedImage = {
            id: `${file.name}-${new Date().getTime()}`,
            file,
            previewUrl,
            name: file.name,
        };
        
        console.log('💾 Setting image state...');
        setUploadedImages(prev => [newImage, ...prev]);
        setSelectedImage(newImage);
        setHistory([]);
        setCurrentHistoryIndex(-1);
        setError(null);
        // DON'T clear session gallery - keep all generations!
        // setSessionGallery([]);
        setLastGenerationParams(null);
        console.log('✅ Image state set successfully');
        
        // Image uploaded successfully - provide feedback and start analysis
        console.log('✅ Image uploaded successfully, starting smart analysis...');
        toast.success(`🍌 Sweet! Your image is ready to go bananas!`);
        
        // Start smart analysis automatically and store with image
        try {
            console.log('🧠 Starting automatic smart analysis...');
            setIsAnalyzing(true);
            
            // Single API call for analysis (includes description generation)
            const analysisResult = await analyzeProduct(
                newImage.file, 
                'Product', // Default title
                '' // Empty description - analyzeProduct will generate its own
            );
            console.log('📊 Analysis result:', analysisResult);
            
            // Use the description from the analysis result
            const productDescription = analysisResult.userStory || 'Professional product for your marketing needs';
            console.log('✅ Description from analysis:', productDescription);
            setImageDescription(productDescription); // Update the state with description
            
            // Update the image with analysis results and smart input
            const analysisSmartInput: SmartProductInput = {
                title: analysisResult.suggestedTitle,
                description: productDescription, // Use the description from analysis
                industry: analysisResult.detectedIndustry,
                targetAudience: analysisResult.recommendedAudiences?.[0] || null,
                analysis: analysisResult,
                isAnalysisConfirmed: true
            };
            
            // Update the uploaded image with analysis data
            const updatedImage = {
                ...newImage,
                analysis: analysisResult,
                smartInput: analysisSmartInput
            };
            
            // Update state with the analyzed image
            setUploadedImages(prev => [updatedImage, ...prev.slice(1)]);
            setSelectedImage(updatedImage);
            setSmartInput(analysisSmartInput);
            setIsAnalyzing(false);
            
            // Show the analysis popup for user confirmation
            console.log('🎯 Showing smart analysis popup...');
            setShowAnalysisPopup(true);
            
            toast.success('🍌 Ripe and ready! Your product analysis is complete.');
            
        } catch (error) {
            console.error('❌ Smart analysis failed:', error);
            setIsAnalyzing(false);
            toast.error('🍌 Oops! Analysis slipped up, but you can still create magic manually!');
            // Continue without analysis - user can still generate manually
        }
    }, [smartInput]);

    const handleGenerateDescription = useCallback(async () => {
        console.log('🔍 CRITICAL: handleGenerateDescription called');
        console.log('📸 selectedImage check:', selectedImage ? 
            `Present: ${selectedImage.file.name} (${selectedImage.file.size} bytes)` : 'NULL - PROBLEM!');
        
        if (!selectedImage) {
            console.error('❌ CRITICAL: No selectedImage in handleGenerateDescription!');
            return;
        }
        
        setIsDescriptionLoading(true);
        setError(null);
        try {
            console.log('📝 Calling describeImage with file:', {
                name: selectedImage.file.name,
                size: selectedImage.file.size,
                type: selectedImage.file.type
            });
            const desc = await describeImage(selectedImage.file);
            console.log('✅ Description SUCCESS:', desc);
            setImageDescription(desc);
        } catch (e: any) {
            console.error('❌ Description FAILED:', e);
            setError(e.message || 'Failed to generate description.');
        } finally {
            setIsDescriptionLoading(false);
        }
    }, [selectedImage]);

    useEffect(() => {
        console.log('👀 CRITICAL: selectedImage effect triggered');
        console.log('📸 Current selectedImage:', selectedImage ? {
            id: selectedImage.id,
            name: selectedImage.file.name,
            size: selectedImage.file.size,
            type: selectedImage.file.type
        } : 'NULL');
        
        if (selectedImage) {
            console.log('🚀 Auto-triggering description generation...');
            handleGenerateDescription();
        } else {
            console.log('⚠️ ALERT: selectedImage is null, skipping description');
        }
    }, [selectedImage, handleGenerateDescription]);

    const handleGenerate = useCallback(async (overrideFormatOrEnvironment?: AdFormat | string | AdFormat[]) => {
        console.log('🔥 HANDLEGENERATE ENTRY: Function called!');
        console.log('🔍 Entry params:', { overrideFormatOrEnvironment, selectedImage: !!selectedImage, loadingState });
        
        // Check if we received multiple formats for batch generation
        if (Array.isArray(overrideFormatOrEnvironment)) {
            console.log('🎯 Multi-format generation requested for', overrideFormatOrEnvironment.length, 'formats');
            return handleMultiFormatGeneration(overrideFormatOrEnvironment);
        }
        
        // Determine if we got a format or an environment string
        let overrideFormat: AdFormat | undefined;
        let selectedEnvironment: string | undefined;
        
        if (typeof overrideFormatOrEnvironment === 'string') {
            selectedEnvironment = overrideFormatOrEnvironment;
        } else {
            overrideFormat = overrideFormatOrEnvironment;
        }
        console.log('🎯 handleGenerate called at', new Date().toISOString());
        console.log('📸 selectedImage:', selectedImage ? `${selectedImage.file.name} (${selectedImage.file.size} bytes)` : 'NULL');
        console.log('🎨 selectedFormat:', selectedFormat?.name || 'NULL');
        console.log('🌿 isNaturalEnvironmentSelected:', isNaturalEnvironmentSelected);
        console.log('📝 smartInput:', smartInput);
        console.log('📄 imageDescription:', imageDescription);
        
        // Add a visual indicator that generation started
        const startTime = Date.now();
        
        let format = overrideFormat || selectedFormat;
        const sloganType = selectedSloganType;
        
        // Use smart input description if available, fallback to legacy field
        const description = smartInput.description || imageDescription;
        console.log('📋 Final description used:', description || 'NONE');
        
        // Check prerequisites first
        if (!selectedImage) {
            console.error('❌ CRITICAL: No image selected in handleGenerate! State might have been cleared.');
            console.error('📦 State dump at generation time:', {
                selectedImage: selectedImage ? 'Present' : 'NULL',
                uploadedImages: uploadedImages.length,
                smartInput,
                imageDescription: imageDescription ? 'Present' : 'NULL',
                selectedFormat: selectedFormat?.name,
                isNaturalEnvironmentSelected
            });
            toast.error('🍌 Hold up! Feed me an image first!');
            setError("Please upload an image first.");
            return;
        }
        
        if (!description && !imageDescription) {
            console.error('❌ CRITICAL: No description available!');
            console.error('📝 Description state:', {
                smartInputDescription: smartInput.description,
                imageDescription: imageDescription,
                combinedDescription: description
            });
            toast.error('🍌 Easy there! Let me finish analyzing first!');
            setError("Please wait for image analysis to complete.");
            return;
        }
        
        console.log('✅ Prerequisites passed, continuing...');
        
        // If no format provided, auto-select Natural Environment
        if (!format) {
            console.log('🔍 No format selected, auto-selecting Natural Environment...');
            const naturalEnvironmentFormat = AD_FORMATS.find(f => f.name === 'Natural Environment');
            if (naturalEnvironmentFormat) {
                console.log('✅ Found Natural Environment format, using it');
                format = naturalEnvironmentFormat;
                // Don't set state here, just use the format directly
            } else {
                setError("Natural Environment format not available.");
                return;
            }
        }
        
        // Check if we're using Natural Environment
        const isNaturalEnv = format?.name === 'Natural Environment';
        if (isNaturalEnv) {
            console.log('🌿 Using Natural Environment format');
            // We already have the Natural Environment format in 'format' variable
            const naturalFormat = format;
            
            // If an environment was selected, update the prompt
            let environmentPrompt = naturalFormat.prompt;
            if (selectedEnvironment) {
                console.log('🌍 Using selected environment:', selectedEnvironment);
                environmentPrompt = `Place this product in ${selectedEnvironment}. The product should be prominently displayed and maintain its original appearance. Create a professional, photorealistic composition that showcases the product effectively.`;
            } else if (selectedImage?.analysis?.naturalEnvironments?.[0]) {
                // Auto-use the first recommended environment if no selection was made
                console.log('🌆 Auto-using first recommended environment:', selectedImage.analysis.naturalEnvironments[0]);
                environmentPrompt = `Place this product in ${selectedImage.analysis.naturalEnvironments[0]}. The product should be prominently displayed and maintain its original appearance. Create a professional, photorealistic composition that showcases the product effectively.`;
            }
            
            // Use the Natural Environment format with its built-in prompt
            setError(null);
            setLoadingState('generating_image');

            try {
                console.log('🚀 Starting Natural Environment generation...');
                let slogan = '';
                if (sloganType) {
                    console.log('📝 Generating slogan first...');
                    setLoadingState('generating_text');
                    slogan = await generateSlogan(selectedImage.file, sloganType);
                    console.log('✅ Slogan generated:', slogan);
                }
                
                setLastGenerationParams({ format: naturalFormat, sloganType, slogan, description, selectedImage });
                console.log('🎨 Calling generateAdMockup with:', {
                    prompt: environmentPrompt.substring(0, 100) + '...',
                    slogan,
                    description
                });
                setLoadingState('generating_image');
                
                const result = await generateAdMockup(selectedImage.file, environmentPrompt, slogan, description);
                console.log('🎉 generateAdMockup returned:', result);
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
            console.error("🚨 Generation failed:", e);
            console.error("🔍 Error details:", {
                message: e.message,
                stack: e.stack,
                name: e.name
            });
            
            // Show detailed error to user
            const errorMessage = e.message || 'An unknown error occurred during generation.';
            setError(`Generation failed: ${errorMessage}`);
            updateHistory(null); // Add a null entry to history to represent the failed state
        } finally {
            console.log("🏁 Setting loading state to idle");
            setLoadingState('idle');
        }
    }, [selectedImage, imageDescription, history, currentHistoryIndex, selectedFormat, selectedSloganType, smartInput]);

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
        if (!lastGenerationParams || !generatedContent) return;
        const { format, description, selectedImage } = lastGenerationParams;
        // Use existing sloganType or default to 'hook' for Natural Environment generations
        const sloganType = lastGenerationParams.sloganType || 'hook';

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

    // Multi-format generation handler
    const handleMultiFormatGeneration = useCallback(async (formats: AdFormat[]) => {
        console.log('🎯 Starting multi-format generation for', formats.length, 'formats');
        
        if (!selectedImage) {
            toast.error('🍌 Hold up! Feed me an image first!');
            return;
        }
        
        if (formats.length === 0) {
            toast.error('🍌 Pick a format to make things a-peel-ing!');
            return;
        }
        
        // Set up generation queue
        setCurrentGenerationQueue({
            formats,
            currentIndex: 0,
            results: []
        });
        
        setSelectedFormatsForGeneration(formats);
        
        // Generate first format
        if (formats.length === 1) {
            // Single format - use existing logic
            await handleGenerate(formats[0]);
            return;
        }
        
        // Multiple formats - show progress and generate sequentially
        toast.success(`🍌 Going bananas! Creating ${formats.length} amazing designs...`);
        
        try {
            const results: GeneratedContent[] = [];
            
            for (let i = 0; i < formats.length; i++) {
                const format = formats[i];
                console.log(`🎨 Generating format ${i + 1}/${formats.length}: ${format.name}`);
                
                // Update progress
                setCurrentGenerationQueue(prev => prev ? {
                    ...prev,
                    currentIndex: i
                } : null);
                
                setLoadingState('generating_image');
                
                try {
                    // Use smart input description if available
                    const description = smartInput.description || imageDescription;
                    
                    let slogan = '';
                    if (selectedSloganType) {
                        setLoadingState('generating_text');
                        slogan = await generateSlogan(selectedImage.file, selectedSloganType);
                    }
                    
                    setLoadingState('generating_image');
                    const result = await generateAdMockup(selectedImage.file, format.prompt, slogan, description);
                    
                    if (result.imageUrl) {
                        const content: MockupContent = {
                            imageUrl: result.imageUrl,
                            slogan,
                            format: format.name
                        };
                        results.push(content);
                        
                        // Add to session gallery
                        setSessionGallery(prev => [content, ...prev].slice(0, 16));
                        
                        console.log(`✅ Generated ${format.name} successfully`);
                    }
                } catch (error: any) {
                    console.error(`❌ Failed to generate ${format.name}:`, error);
                    toast.error(`🍌 Slipped up on ${format.name}: ${error.message}`);
                }
            }
            
            // Show the last generated result
            if (results.length > 0) {
                updateHistory(results[results.length - 1]);
                toast.success(`🍌 Split-second success! Created ${results.length} of ${formats.length} designs!`);
            } else {
                toast.error('🍌 Banana split! Couldn\'t create any designs.');
            }
            
        } catch (error: any) {
            console.error('❌ Multi-format generation failed:', error);
            toast.error('🍌 The bunch got tangled! Generation failed.');
        } finally {
            setLoadingState('idle');
            setCurrentGenerationQueue(null);
        }
    }, [selectedImage, imageDescription, smartInput, selectedSloganType, handleGenerate]);

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
        // Keep session gallery - don't clear generations
        // setSessionGallery([]);
        setLastGenerationParams(null);
    };

    const handleSelectFromLibrary = (image: UploadedImage) => {
        if (image.id !== selectedImage?.id) {
            setSelectedImage(image);
            
            // Load the image's stored smart input data if available
            if (image.smartInput) {
                setSmartInput(image.smartInput);
                setImageDescription(image.smartInput.description);
            } else {
                // Reset to default if no analysis available
                setSmartInput({
                    title: '',
                    description: '',
                    industry: null,
                    targetAudience: null,
                    isAnalysisConfirmed: false,
                    analysis: null
                });
                setImageDescription('');
            }
            
            setHistory([]);
            setCurrentHistoryIndex(-1);
            setError(null);
            // Keep session gallery when switching images
            // setSessionGallery([]);
            setLastGenerationParams(null);
        }
    };
    
    const handleDeleteFromLibrary = (imageId: string) => {
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
        // If we're deleting the currently selected image, select the first remaining one
        if (selectedImage?.id === imageId) {
            const remainingImages = uploadedImages.filter(img => img.id !== imageId);
            if (remainingImages.length > 0) {
                setSelectedImage(remainingImages[0]);
            } else {
                setSelectedImage(null);
                setImageDescription('');
                setHistory([]);
                setCurrentHistoryIndex(-1);
                // Only clear gallery if no images left
                // setSessionGallery([]);
                setLastGenerationParams(null);
            }
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

    const handleResetAnalysis = () => {
        if (selectedImage) {
            // Clear analysis from the selected image
            const updatedImage = {
                ...selectedImage,
                analysis: undefined,
                smartInput: undefined
            };
            
            // Update the image library
            setUploadedImages(prev => 
                prev.map(img => img.id === selectedImage.id ? updatedImage : img)
            );
            
            // Update selected image
            setSelectedImage(updatedImage);
            
            // Reset smart input to clean state
            setSmartInput({
                title: '',
                description: '',
                industry: null,
                targetAudience: null,
                isAnalysisConfirmed: false,
                analysis: null
            });
            
            // Clear description
            setImageDescription('');
            
            toast.success('🍌 Fresh start! Ready for your creative input.');
        }
    };

    const handleReanalyze = async () => {
        if (!selectedImage || loadingState !== 'idle') return;
        
        console.log('🔄 REANALYZE: Starting reanalysis with current smartInput:', smartInput);
        toast('🍌 Peeling back the layers with your updates...');
        
        try {
            setLoadingState('describing');
            setError(null);
            
            // Use current smartInput values to generate new analysis
            const analysis = await analyzeProduct(
                selectedImage.file, 
                smartInput.title || '', 
                smartInput.description || ''
            );
            
            if (analysis) {
                // Update the selected image with new analysis
                const updatedImage = {
                    ...selectedImage,
                    analysis: analysis,
                    smartInput: {
                        ...smartInput,
                        analysis: analysis,
                        isAnalysisConfirmed: false // Allow user to review the new analysis
                    }
                };
                
                // Update image library
                setUploadedImages(prev => 
                    prev.map(img => img.id === selectedImage.id ? updatedImage : img)
                );
                
                // Update selected image
                setSelectedImage(updatedImage);
                
                // Update smart input with new analysis but keep user's edits
                setSmartInput(prev => ({
                    ...prev,
                    analysis: analysis,
                    isAnalysisConfirmed: false
                }));
                
                toast.success('🍌 Perfectly ripe! Check out the fresh suggestions.');
            }
        } catch (error) {
            console.error('Reanalysis failed:', error);
            setError('Failed to reanalyze the image. Please try again.');
            toast.error('🍌 Slipped on the peel! Try again.');
        } finally {
            setLoadingState('idle');
        }
    };

    const handleToggleRepositionMode = () => setIsRepositionMode(prev => !prev);
    const handleRepositionClick = (x: number, y: number) => {
        const prompt = `Keeping everything else the same, move the main text or slogan to be centered around the click coordinates (${x.toFixed(2)}, ${y.toFixed(2)}), where (0,0) is the top-left corner and (1,1) is the bottom-right corner of the image. The product placement should not change.`;
        handleEdit(prompt);
        setIsRepositionMode(false);
    };


    // Show skeleton during initial load
    if (isInitialLoad) {
        return <AppSkeleton />;
    }
    
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#fefcf0' }}>
            <Header />
            
            <main className="flex flex-1 bg-white">
                <div className="w-[400px] flex flex-col">
                    <Sidebar
                    imageLibrary={uploadedImages}
                    generatedGallery={sessionGallery}
                    selectedImage={selectedImage}
                    onSelectFromLibrary={handleSelectFromLibrary}
                    onDeleteFromLibrary={handleDeleteFromLibrary}
                    onGenerate={handleGenerate}
                    isLoading={isLoading || isAnalyzing}
                    smartInput={smartInput}
                    onSmartInputChange={handleSmartInputChange}
                    isDescriptionLoading={isDescriptionLoading}
                    onImageUpload={handleImageUpload}
                    onGenerateDescription={handleGenerateDescription}
                    selectedSloganType={selectedSloganType}
                    onSelectSloganType={setSelectedSloganType}
                    onResetAnalysis={handleResetAnalysis}
                        onReanalyze={handleReanalyze}
                    />
                </div>
                <div className="flex-1 flex flex-col bg-white">
                        {/* Generation Progress - only show when not using full-screen loader */}
                        {loadingState !== 'generating_image' && loadingState !== 'generating_text' && loadingState !== 'editing' && (
                            <GenerationProgress 
                                loadingState={loadingState}
                                isNaturalEnvironment={isNaturalEnvironmentSelected}
                                selectedFormatName={selectedFormat?.name}
                            />
                        )}
                        
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
            </main>
            
            <Footer />

            {/* Loading Indicators */}
            {isAnalyzing && <AnalysisLoader />}
            {(loadingState === 'generating_image' || loadingState === 'generating_text') && <GenerationLoader />}
            {loadingState === 'editing' && <EditingLoader />}
            
            {/* Production Status Panel for Multi-Format Generation */}
            <ProductionStatusPanel 
                currentGenerationQueue={currentGenerationQueue}
                loadingState={loadingState}
                isVisible={!!currentGenerationQueue}
            />
            
            {/* Smart Analysis Popup */}
            <AnalysisCompleteNotification
                isVisible={showAnalysisPopup && !!smartInput.analysis}
                onClose={() => setShowAnalysisPopup(false)}
                onFeelingLucky={() => {
                    console.log('🍌 GO BANANAS CLICKED!');
                    console.log('🔍 smartInput.analysis:', smartInput.analysis);
                    console.log('🌿 naturalEnvironments:', smartInput.analysis?.naturalEnvironments);
                    console.log('📸 selectedImage:', selectedImage ? selectedImage.file.name : 'NULL');
                    
                    // Select the first Natural Environment option and generate
                    if (smartInput.analysis?.naturalEnvironments && smartInput.analysis.naturalEnvironments.length > 0) {
                        const firstEnvironment = smartInput.analysis.naturalEnvironments[0];
                        console.log('🎨 Selected environment:', firstEnvironment);
                        
                        // Set the format to natural environment (auto-generation)
                        const naturalFormat = getNaturalEnvironmentFormat();
                        setSelectedFormat(naturalFormat);
                        setIsNaturalEnvironmentSelected(true);
                        
                        console.log('🚀 About to call handleGenerate with natural environment...');
                        console.log('📊 Current state before handleGenerate:', {
                            selectedFormat: naturalFormat,
                            isNaturalEnvironmentSelected: true,
                            loadingState,
                            selectedImage: selectedImage?.file.name,
                            smartAnalysis: !!smartInput.analysis
                        });
                        
                        // Add a small delay to ensure state updates are applied
                        setTimeout(() => {
                            console.log('🎬 Executing handleGenerate NOW...');
                            handleGenerate();
                        }, 100);
                    } else {
                        console.log('❌ No natural environments found!');
                    }
                }}
            />
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#FEF3C7',
                        color: '#713f12',
                        border: '1px solid #FDE68A',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    success: {
                        iconTheme: {
                            primary: '#FBBF24',
                            secondary: '#FEF3C7',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#F59E0B',
                            secondary: '#FEF3C7',
                        },
                    },
                }}
            />
        </div>
    );
};
