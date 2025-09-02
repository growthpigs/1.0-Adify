import { GoogleGenAI, Modality, Type } from '@google/genai';
import { GeneratedAdResult, SloganType, AdFormat, FacebookAdContent, SmartProductAnalysis, Industry, TargetAudience, ProductType } from '../types';
import { DESIGN_RULES } from '../constants';

let aiInstance: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (aiInstance) {
        return aiInstance;
    }
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API Key check:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');
    console.log('All env vars:', import.meta.env);
    
    if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY environment variable not set. The app cannot connect to the AI service.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
};

const dataUrlToGenerativePart = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: blob.type,
    },
  };
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

export const describeImage = async (imageFile: File): Promise<string> => {
    console.log('describeImage called with file:', imageFile.name, 'type:', imageFile.type, 'size:', imageFile.size);
    
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: "Concisely describe the product in this image in 1-2 sentences. Your description will be used as context for an AI image generator. Focus on what the object is, its main features, and its color. Only output the description text." };
        
        console.log('Calling generateContent with gemini-2.5-flash...');
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const description = response.text.trim();
        console.log('Description generated:', description);
        
        if (!description) {
            throw new Error('Image description failed.');
        }
        return description;
    } catch (error: any) {
        console.error('Error in describeImage:', error);
        
        // Check if this is the default image - if so, return a default description
        if (imageFile.size < 100) {
            console.log('Default image processing failed, using fallback description');
            return "A professional product ready for marketing";
        }
        
        throw error;
    }
}

export const generateAdMockup = async (imageFile: File, basePrompt: string, slogan: string = '', imageDescription: string = ''): Promise<GeneratedAdResult> => {
  console.log('🚀 Starting ad mockup generation with gemini-2.5-flash-image-preview...');
  console.log('📝 Prompt:', basePrompt);
  console.log('📋 Description:', imageDescription);
  console.log('💬 Slogan:', slogan);
  
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    let sloganIntegrationPrompt = '';
    if (slogan) {
      sloganIntegrationPrompt = `Additionally, artfully and realistically integrate the following slogan into the scene: "${slogan}". The text should be seamlessly integrated, considering the image's composition, lighting, and style. Ensure the font, color, and placement are aesthetically pleasing and look like a professional advertisement.`;
    }

    // Force AI to use the exact uploaded image
    const imagePreservationPrompt = `
    IMAGE USAGE REQUIREMENTS:
    
    1. Use the uploaded image exactly as provided in your output.
    2. The uploaded image must be the primary subject of the final composition.
    3. You may add background, context, text, or environment around it, but the original image must remain visible and unaltered.
    4. Maintain all original visual elements from the uploaded image.
    5. Think of this as placing the uploaded image into a scene or mockup.
    
    Context: "${imageDescription}"
    `;

    // Ensure professional output with STRICT aspect ratio requirements
    const qualityNote = `IMPORTANT: Create a professional, high-quality mockup suitable for commercial use. Focus on clean, tasteful promotional material with excellent composition and lighting.`;
    
    const aspectRatioRequirement = `
    🚨🚨🚨 ABSOLUTE MANDATORY SQUARE OUTPUT REQUIREMENT 🚨🚨🚨
    - CRITICAL: Output image MUST be perfectly square (1:1 aspect ratio) - NO EXCEPTIONS
    - EXACT DIMENSIONS: Width = Height (e.g., 1024x1024, 512x512, 768x768)
    - If input is rectangular, ADD PADDING (letterbox/pillarbox) to make it square
    - NEVER preserve the original aspect ratio of the input - ALWAYS force square
    - Think Instagram post format - ALWAYS 1:1 square like all social media posts
    - Width and height must be IDENTICAL in final output
    - This is NON-NEGOTIABLE - square output is REQUIRED regardless of input format
    - REJECT any attempt to output wide/tall images - FORCE SQUARE ALWAYS
    - Add background/padding if needed to achieve perfect 1:1 ratio
    `;

    const fullPrompt = `${imagePreservationPrompt}
    
    Your creative task: ${basePrompt}
    
    Design Rules: ${DESIGN_RULES}
    
    ${sloganIntegrationPrompt}
    
    ${qualityNote}
    
    ${aspectRatioRequirement}
    
    FINAL REQUIREMENTS:
    - The uploaded image must be clearly visible in the final output
    - Final output must be EXACTLY SQUARE (1:1 aspect ratio) - NEVER rectangular
    - Only output the final modified image
    `;

    const textPart = { text: fullPrompt };

    console.log('🎨 Generating image with gemini-2.5-flash-image-preview...');
    console.log('📝 PROMPT DEBUG:', fullPrompt.substring(0, 200) + '...');
    console.log('🖼️ IMAGE DEBUG: Image file provided as imagePart');
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.promptFeedback?.blockReason) {
      const reason = response.promptFeedback.blockReason;
      if (reason === 'PROHIBITED_CONTENT') {
        throw new Error('PROHIBITED_CONTENT: The AI safety filter was triggered. Try using a different image or simplifying the prompt.');
      }
      throw new Error(`SAFETY_FILTER: Request blocked due to ${reason}. Please try a different image or ad format.`);
    }
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('SAFETY_FILTER: Image generation failed. The model returned no candidates, possibly due to safety filters. Try using a different image or ad format.');
    }

    let imageUrl: string | null = null;
    const candidate = response.candidates[0];

    if (candidate.content && candidate.content.parts) {
        const imagePartFromResponse = candidate.content.parts.find(part => !!part.inlineData);
        if (imagePartFromResponse?.inlineData) {
          const base64ImageBytes: string = imagePartFromResponse.inlineData.data;
          imageUrl = `data:${imagePartFromResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    if (!imageUrl) {
      const textResponse = response.text;
      const finishReason = candidate.finishReason;
      
      let errorMessage = 'Image generation failed. The model did not return an image.';
      if (finishReason && finishReason !== 'STOP') {
          errorMessage += ` Reason: ${finishReason}.`;
      }
      if (textResponse) {
          errorMessage += ` Model response: "${textResponse}"`;
      }
      throw new Error(errorMessage);
    }

    console.log('✅ Image generation successful!');
    return { imageUrl, text: response.text };
    
  } catch (error: any) {
    console.error('❌ Ad generation failed:', error);
    throw error;
  }
};

export const generateSlogan = async (imageFile: File, sloganType: SloganType): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const basePrompt = getSloganPrompt(sloganType);
        const textPart = { text: `${basePrompt} The output should be only the slogan text itself, without any quotation marks or extra explanations.` };

        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        
        const slogan = response.text.trim();
        if (!slogan) {
            throw new Error('Slogan generation failed. The model did not return any text.');
        }
        
        return slogan.replace(/^"|"$|^\*|\*$/g, '').trim();
    } catch (error: any) {
        console.error('Error in generateSlogan:', error);
        throw error;
    }
};

export const editImage = async (imageDataUrl: string, editPrompt: string): Promise<GeneratedAdResult> => {
    console.log('Starting image editing with gemini-2.5-flash-image-preview...');
    
    try {
        const imagePart = await dataUrlToGenerativePart(imageDataUrl);
        const textPart = { text: `${editPrompt}. 🚨🚨🚨 MANDATORY: The final output image must be perfectly square (1:1 aspect ratio). If the current image is not square, ADD PADDING or CROP to make it square. Width and height must be identical. This is NON-NEGOTIABLE - square output is required regardless of input format.` };

        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        if (response.promptFeedback?.blockReason) {
          throw new Error(`Request blocked due to ${response.promptFeedback.blockReason}.`);
        }
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('Image editing failed. The model returned no candidates, possibly due to safety filters.');
        }

        let imageUrl: string | null = null;
        const candidate = response.candidates[0];

        if (candidate.content && candidate.content.parts) {
          const imagePartFromResponse = candidate.content.parts.find(part => !!part.inlineData);
          if (imagePartFromResponse?.inlineData) {
              const base64ImageBytes: string = imagePartFromResponse.inlineData.data;
              imageUrl = `data:${imagePartFromResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
              console.log('✅ Image edited successfully!');
          }
        }
        
        if (!imageUrl) {
            const textResponse = response.text;
            const finishReason = candidate.finishReason;
            
            let errorMessage = 'Image editing failed. The model did not return an image.';
            if (finishReason && finishReason !== 'STOP') {
                errorMessage += ` Reason: ${finishReason}.`;
            }
            if (textResponse) {
                errorMessage += ` Model response: "${textResponse}"`;
            }
            throw new Error(errorMessage);
        }

        return { imageUrl, text: response.text };
    } catch (error: any) {
        console.error('Image editing failed:', error.message);
        throw error;
    }
};

export const generateFacebookAdContent = async (format: AdFormat, productDescription: string): Promise<FacebookAdContent> => {
    try {
        const prompt = `
            You are an expert direct response copywriter and AI art director. Your task is to create a complete Facebook ad based on a user's product and a selected ad format.

            **Product Description:** "${productDescription}"

            **Ad Format & Style:** "${format.name} - ${format.prompt}"

            Based on the above, generate the following components for a compelling Facebook ad:
            1.  **Headline:** A short, punchy headline (max 10 words) that grabs attention and summarizes the core message.
            2.  **Body Text:** A persuasive body copy (2-4 sentences) that follows the principles of the selected ad format. It should be engaging and lead to a call to action.
            3.  **Image Prompt:** A detailed, descriptive prompt for an AI image generator to create the ad creative. This prompt should describe a visually arresting, high-quality composition that complements the headline and body text. It must be a square 1:1 aspect ratio and look professional.

            Your output MUST be a valid JSON object.
        `;

        const response = await getAi().models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        bodyText: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                    },
                    required: ["headline", "bodyText", "imagePrompt"],
                },
            },
        });

        const json = JSON.parse(response.text);
        return json as FacebookAdContent;
    } catch (error: any) {
        console.error('Error in generateFacebookAdContent:', error);
        throw new Error("The AI failed to generate valid ad content. Please try again.");
    }
};

export const analyzeProduct = async (imageFile: File, productTitle: string, productDescription: string): Promise<SmartProductAnalysis> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        
        const prompt = `Analyze this uploaded image carefully and provide smart marketing insights.

FIRST, describe EXACTLY what you see in the image:
- Visual style (is it digital art, photography, 3D render, illustration, logo, UI/UX design?)
- Artistic elements (colors, composition, style, technique)
- Subject matter (what is depicted or represented)
- Any text or branding visible

BASED ON YOUR VISUAL ANALYSIS, determine the most appropriate category:

IMPORTANT INDUSTRY DETECTION RULES:
- If the image shows digital art, illustrations, or creative designs → "entertainment" industry
- If it's a logo or brand identity → match to the brand's actual industry
- If it's UI/UX mockups or app screenshots → "saas" or "technology" 
- If it shows physical products → match to product category
- NEVER default to "technology" unless it's actual tech hardware or software UI

1. What industry/category this belongs to (be specific and accurate)
2. Who the target audiences should be (analyze the specific product type and suggest the most relevant audiences - for kitchen items: homeowners, parents, budget_conscious; for tech: tech_savvy, early_adopters, millennials; for fitness: fitness_enthusiasts, busy_professionals; be product-specific)
3. Natural environments where this product would realistically be placed or used (be specific about physical locations)
4. A brief, factual description of the actual visual content
5. Your confidence level (0-100)

CRITICAL: For naturalEnvironments, provide SPECIFIC PHYSICAL LOCATIONS where this product would actually be used or displayed:
- For apps/software: "modern office desk", "coffee shop workspace", "home office", "co-working space"
- For physical products: "kitchen counter", "living room table", "outdoor patio", "bedroom nightstand"
- For fashion items: "urban street corner", "rooftop terrace", "beach boardwalk", "city park"
- For art/creative: "art studio easel", "gallery wall", "designer's desk", "creative loft space"

Return a valid JSON object with this structure:
{
  "suggestedTitle": "accurate title - for art use: 'Digital Art Creation' or similar",
  "detectedIndustry": "one of: saas, ecommerce, fashion, food_beverage, fitness_wellness, technology, b2b_services, automotive, real_estate, education, healthcare, finance, entertainment, travel, home_garden",
  "recommendedAudiences": ["array of exactly 2 most relevant and different audiences based on the actual product - choose from: entrepreneurs, gen_z, millennials, busy_professionals, parents, students, corporate_buyers, fitness_enthusiasts, tech_savvy, luxury_consumers, budget_conscious, early_adopters, creative_professionals, artists_designers, content_creators, homeowners"],
  "naturalEnvironments": ["array of exactly 9 SPECIFIC PHYSICAL LOCATIONS like 'modern office desk', 'coffee shop table', 'kitchen counter', 'rooftop terrace', 'cozy reading nook', 'outdoor garden table', 'bedroom nightstand', 'city park bench', 'home studio workspace'"],
  "userStory": "A factual description of the visual elements, style, and artistic technique visible in the image",
  "confidence": 85
}`;

        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
            },
        });

        const analysis = JSON.parse(response.text);
        return analysis as SmartProductAnalysis;
    } catch (error: any) {
        console.error('Product analysis failed:', error);
        // Return a default analysis
        return {
            productType: 'software_app' as ProductType,
            suggestedTitle: productTitle,
            detectedIndustry: 'technology' as Industry,
            recommendedAudiences: ['entrepreneurs', 'tech_savvy'] as TargetAudience[],
            naturalEnvironments: ['modern office', 'coffee shop', 'home desk'],
            avoidFormats: [],
            userStory: 'This product helps busy professionals work more efficiently and achieve their goals faster.',
            confidence: 50
        };
    }
};

const getSloganPrompt = (sloganType: SloganType): string => {
    switch (sloganType) {
        case 'hook':
            return "Analyze this product image. Brainstorm a short, witty, and modern marketing hook for it. It should be a scroll-stopper, clever, and feel more like a funny observation than a traditional ad tagline. Aim for a casual, conversational tone.";
        case 'meme':
            return "Analyze this product image. Come up with a short, funny meme caption for it. It should be in the style of a popular internet meme. Keep it concise and relatable.";
        case 'joke':
            return "Analyze this product image. Tell a short, clever one-liner joke related to the product or what it does. The joke should be lighthearted and safe for a general audience.";
        case 'quote':
            return "Analyze this product image. Generate a short, inspiring or thought-provoking quote that relates to the feeling or purpose of this product. Make it sound profound but keep it brief.";
        case 'fun_fact':
             return "Analyze this product image. Come up with a surprising and fun fact that is tangentially related to the product, its category, or its use case. Keep it short and interesting.";
        case 'tagline':
            return "Generate a short, professional, and catchy tagline for this product. Suitable for a corporate or business context."
        default:
            return "Generate a short, catchy tagline for this product.";
    }
}