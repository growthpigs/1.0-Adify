import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedAdResult, SloganType, AdFormat } from '../types';

let aiInstance: GoogleGenerativeAI | null = null;

const getAi = (): GoogleGenerativeAI => {
    if (aiInstance) {
        return aiInstance;
    }
    const apiKey = process.env.API_KEY;
    console.log('API Key status:', apiKey ? `Set (${apiKey.substring(0, 10)}...)` : 'Not set');
    
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set. The app cannot connect to the AI service.");
    }
    aiInstance = new GoogleGenerativeAI(apiKey);
    return aiInstance;
};

const fileToGenerativePart = async (file: File): Promise<{
    inlineData: {
        data: string;
        mimeType: string;
    };
}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URL prefix (e.g., "data:image/png;base64,")
                const base64Data = reader.result.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                });
            } else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const dataUrlToGenerativePart = async (dataUrl: string): Promise<{
    inlineData: {
        data: string;
        mimeType: string;
    };
}> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image', { type: blob.type });
    return fileToGenerativePart(file);
};

export const describeImage = async (imageFile: File): Promise<string> => {
    console.log('describeImage called with file:', imageFile.name, 'type:', imageFile.type, 'size:', imageFile.size);
    
    try {
        // Use gemini-1.5-flash for image analysis (vision model)
        const model = getAi().getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('Model created: gemini-1.5-flash');
        
        const imagePart = await fileToGenerativePart(imageFile);
        console.log('Image converted to part, mime type:', imagePart.inlineData.mimeType);
        
        const prompt = "Concisely describe the product in this image in 1-2 sentences. Your description will be used as context for an AI image generator. Focus on what the object is, its main features, and its color. Only output the description text.";
        
        console.log('Calling generateContent...');
        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const description = response.text().trim();
        console.log('Description generated:', description);
        
        if (!description) {
            throw new Error('Image description failed - empty response.');
        }
        return description;
    } catch (error: any) {
        console.error('Error in describeImage:', error);
        
        // If the default image fails, provide a fallback description
        if (error.message?.includes('Unable to process input image')) {
            console.log('Default image processing failed, using fallback description');
            return 'A modern sleek product with clean design and professional appearance';
        }
        
        throw new Error('Failed to describe image: ' + (error.message || 'Unknown error'));
    }
}

export const generateAdMockup = async (imageFile: File, basePrompt: string, slogan: string, imageDescription: string): Promise<GeneratedAdResult> => {
    console.log('Starting ad mockup generation with nano banana...');
    console.log('Prompt:', basePrompt);
    console.log('Description:', imageDescription);
    console.log('Slogan:', slogan);
    
    try {
        // Use gemini-2.0-flash-exp with responseModalities for image generation
        const model = getAi().getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: 'text/plain'
            }
        });
        
        // For image generation, we need to use a text-only prompt
        // The model will generate both text and image in response
        const fullPrompt = `Generate an image of: ${basePrompt}

Product context: ${imageDescription}
${slogan ? `Include this text overlay in the image: "${slogan}"` : ''}

Requirements:
- Professional advertisement quality
- Square 1:1 aspect ratio  
- Modern, clean aesthetic
- High-quality commercial photography style

Create this advertisement image.`;

        console.log('Attempting nano banana image generation with gemini-2.0-flash-exp...');
        
        // Try with responseModalities if the SDK supports it
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                // This is where responseModalities would go if SDK supports it
                // responseModalities: ['TEXT', 'IMAGE']
            }
        } as any);
        
        const response = await result.response;
        
        // Check if response contains image data
        let imageUrl = '';
        let textContent = '';
        
        if (response.candidates && response.candidates[0]) {
            const candidate = response.candidates[0];
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.text) {
                        textContent = part.text;
                    }
                    if (part.inlineData) {
                        // Image data found!
                        const base64ImageBytes = part.inlineData.data;
                        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64ImageBytes}`;
                        console.log('✅ NANO BANANA IMAGE GENERATED!');
                    }
                }
            }
        }
        
        // If no image in response, try the text
        if (!imageUrl && response.text) {
            textContent = response.text();
        }
        
        return {
            imageUrl: imageUrl,
            text: textContent || `Generated prompt for: ${basePrompt}`
        };
        
    } catch (error: any) {
        console.error('Nano banana generation failed:', error.message);
        
        // Try alternative model
        try {
            console.log('Trying gemini-2.5-flash-image-preview model...');
            const model2 = getAi().getGenerativeModel({ 
                model: 'gemini-2.5-flash-image-preview'
            });
            
            const result = await model2.generateContent(fullPrompt);
            const response = await result.response;
            
            return {
                imageUrl: '',
                text: response.text() || `Generated prompt for: ${basePrompt}`
            };
        } catch (error2: any) {
            console.error('Alternative model also failed:', error2.message);
        }
        
        // Final fallback
        const fallbackPrompt = `Create a professional advertisement:
Format: ${basePrompt}
Product: ${imageDescription}
${slogan ? `Text: "${slogan}"` : ''}
Style: High-quality, modern, square aspect ratio`;
        
        return {
            imageUrl: '',
            text: fallbackPrompt
        };
    }
};

export const generateSlogan = async (imageFile: File, sloganType: SloganType): Promise<string> => {
    try {
        const model = getAi().getGenerativeModel({ model: 'gemini-1.5-flash' });
        const imagePart = await fileToGenerativePart(imageFile);
        
        let stylePrompt = '';
        switch (sloganType) {
            case 'hook':
                stylePrompt = "Create a compelling hook that grabs attention and creates desire for this product. Make it punchy and memorable, between 5-10 words.";
                break;
            case 'meme':
                stylePrompt = "Create a funny, meme-style caption for this product that would go viral on social media. Make it relatable and shareable, using internet humor.";
                break;
            case 'joke':
                stylePrompt = "Create a clever, witty joke or pun about this product. Make it lighthearted and fun.";
                break;
            case 'quote':
                stylePrompt = "Create an inspirational or thought-provoking quote that relates to this product and its benefits. Make it feel profound and shareable.";
                break;
            case 'tagline':
                stylePrompt = "Create a professional brand tagline for this product. Make it concise, memorable, and communicate the core value proposition.";
                break;
            default:
                stylePrompt = "Create a catchy tagline for this product.";
        }
        
        const prompt = `${stylePrompt} Only output the slogan text itself, nothing else.`;
        
        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const slogan = response.text().trim();
        
        if (!slogan) {
            throw new Error('Slogan generation failed.');
        }
        
        // Clean up any quotes or asterisks
        return slogan.replace(/^["'*]+|["'*]+$/g, '').trim();
    } catch (error: any) {
        console.error('Error in generateSlogan:', error);
        throw new Error('Failed to generate slogan: ' + (error.message || 'Unknown error'));
    }
}

export const editImage = async (imageUrl: string, editPrompt: string): Promise<GeneratedAdResult> => {
    console.log('Starting image editing with nano banana...');
    
    try {
        // Use gemini-2.0-flash-exp for image editing
        const model = getAi().getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192
            }
        });
        
        const imagePart = await dataUrlToGenerativePart(imageUrl);
        
        const prompt = `Edit this image: ${editPrompt}
Maintain square 1:1 aspect ratio and professional quality.`;
        
        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        
        // Check for image in response
        let newImageUrl = imageUrl;
        let textContent = '';
        
        if (response.candidates && response.candidates[0]) {
            const candidate = response.candidates[0];
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.text) {
                        textContent = part.text;
                    }
                    if (part.inlineData) {
                        const base64ImageBytes = part.inlineData.data;
                        newImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64ImageBytes}`;
                        console.log('✅ Image edited with nano banana!');
                    }
                }
            }
        }
        
        return {
            imageUrl: newImageUrl,
            text: textContent || editPrompt
        };
        
    } catch (error: any) {
        console.error('Image editing failed:', error.message);
        
        // Fallback
        return {
            imageUrl: imageUrl,
            text: `Edit instruction: ${editPrompt}`
        };
    }
}

export const generateFacebookAdContent = async (format: AdFormat, productDescription: string): Promise<{
    headline: string;
    bodyText: string;
    imagePrompt: string;
}> => {
    try {
        const model = getAi().getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });
        
        const prompt = `Create Facebook ad content for: "${productDescription}"
        
Ad format: ${format.name}

Generate exactly this JSON structure (no markdown, just JSON):
{
  "headline": "Compelling headline max 40 chars",
  "bodyText": "Engaging body text max 125 chars",
  "imagePrompt": "Detailed image generation prompt"
}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up response
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Find JSON in response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                headline: parsed.headline || 'Discover Something Amazing',
                bodyText: parsed.bodyText || 'Transform your experience today.',
                imagePrompt: parsed.imagePrompt || format.prompt
            };
        }
        
        throw new Error('Invalid JSON response');
    } catch (error) {
        console.error('Error in generateFacebookAdContent:', error);
        
        // Fallback content
        return {
            headline: 'Discover Something Amazing',
            bodyText: 'Transform your experience today with our innovative solution.',
            imagePrompt: `Create a Facebook ad image for ${productDescription} in ${format.name} style`
        };
    }
};