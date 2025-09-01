import { SmartProductAnalysis, Industry, TargetAudience, ProductType } from '../types';
import { AD_FORMATS } from '../constants';

// Mock intelligent responses for UX testing before Leap.new backend
export const generateMockAnalysis = async (
    imageFile: File, 
    currentDescription: string = ''
): Promise<SmartProductAnalysis> => {
    // Removed artificial delay - natural processing time is sufficient
    
    // Mock intelligent analysis based on filename and description clues
    const fileName = imageFile.name.toLowerCase();
    const description = currentDescription.toLowerCase();
    
    // Smart detection patterns
    let analysis: SmartProductAnalysis;
    
    if (fileName.includes('adify') || description.includes('adify') || fileName.includes('logo')) {
        analysis = {
            productType: 'logo_brand',
            suggestedTitle: 'Adify',
            detectedIndustry: 'saas',
            recommendedAudiences: ['entrepreneurs', 'busy_professionals', 'tech_savvy'],
            userStory: 'I need a powerful AI tool that creates professional ads instantly and saves me hours of design work.',
            confidence: 96,
            naturalEnvironments: ['Modern startup office with clean desk', 'Creative agency workspace', 'Laptop screen in coffee shop', 'Professional presentation setup'],
            avoidFormats: ['coffee_mug', 'tshirt', 'physical_products']
        };
    } else if (fileName.includes('coffee') || description.includes('coffee') || description.includes('mug')) {
        analysis = {
            productType: 'physical_product',
            suggestedTitle: 'Premium Coffee Brewing System',
            detectedIndustry: 'food_beverage',
            recommendedAudiences: ['busy_professionals', 'millennials'],
            userStory: 'I want café-quality coffee at home without the complexity of manual brewing.',
            confidence: 94,
            naturalEnvironments: ['Modern kitchen counter with morning lighting', 'Cozy café corner', 'Home office setup'],
            avoidFormats: ['tshirt', 'phone_case', 'billboard']
        };
    } else if (fileName.includes('logo') || description.includes('software') || description.includes('app')) {
        analysis = {
            productType: 'logo_brand',
            suggestedTitle: 'Productivity Software Platform',
            detectedIndustry: 'saas',
            recommendedAudiences: ['entrepreneurs', 'busy_professionals', 'tech_savvy'],
            userStory: 'I need a tool that streamlines my workflow and helps me stay organized.',
            confidence: 91,
            naturalEnvironments: ['Clean website header mockup', 'Modern office wall display', 'Laptop screen interface'],
            avoidFormats: ['coffee_mug', 'tshirt', 'physical_products']
        };
    } else if (fileName.includes('fish') || description.includes('fish') || description.includes('rod') || description.includes('outdoor')) {
        analysis = {
            productType: 'physical_product',
            suggestedTitle: 'Professional Fishing Equipment',
            detectedIndustry: 'fitness_wellness',
            recommendedAudiences: ['fitness_enthusiasts', 'early_adopters'],
            userStory: 'I want reliable gear that helps me catch more fish and enjoy my outdoor adventures.',
            confidence: 88,
            naturalEnvironments: ['Serene lake shore at golden hour', 'Boat deck with water backdrop', 'Outdoor gear spread'],
            avoidFormats: ['kitchen', 'office', 'urban_billboard']
        };
    } else if (fileName.includes('fashion') || description.includes('clothing') || description.includes('wear')) {
        analysis = {
            productType: 'fashion_item',
            suggestedTitle: 'Premium Fashion Collection',
            detectedIndustry: 'fashion',
            recommendedAudiences: ['millennials', 'gen_z', 'luxury_consumers'],
            userStory: 'I want to express my unique style with high-quality, trendy pieces.',
            confidence: 92,
            naturalEnvironments: ['Street style photography', 'Fashion boutique display', 'Lifestyle flat lay'],
            avoidFormats: ['kitchen', 'office', 'billboard']
        };
    } else if (fileName.includes('tech') || description.includes('gadget') || description.includes('device')) {
        analysis = {
            productType: 'tech_gadget',
            suggestedTitle: 'Innovative Tech Device',
            detectedIndustry: 'technology',
            recommendedAudiences: ['tech_savvy', 'early_adopters', 'busy_professionals'],
            userStory: 'I want cutting-edge technology that simplifies my daily tasks.',
            confidence: 89,
            naturalEnvironments: ['Minimalist desk setup', 'Modern tech workspace', 'Lifestyle tech flat lay'],
            avoidFormats: ['kitchen', 'outdoor', 'cafe']
        };
    } else {
        // Generic fallback
        analysis = {
            productType: 'physical_product',
            suggestedTitle: 'Premium Product',
            detectedIndustry: 'ecommerce',
            recommendedAudiences: ['millennials', 'busy_professionals'],
            userStory: 'I want a high-quality product that solves my everyday needs.',
            confidence: 75,
            naturalEnvironments: ['Clean lifestyle setting', 'Modern home environment', 'Professional display'],
            avoidFormats: []
        };
    }
    
    return analysis;
};

// Mock contextual prompt generation for Natural Environment
export const generateNaturalEnvironmentPrompt = (
    analysis: SmartProductAnalysis,
    productTitle: string,
    description: string
): string => {
    const environment = analysis.naturalEnvironments[0];
    const industry = analysis.detectedIndustry;
    const productType = analysis.productType;
    
    return `Create a photorealistic image showing "${productTitle}" in its most natural and contextually appropriate environment: ${environment}. 

Product Context: ${description}
Industry: ${industry}
Product Type: ${productType}

The setting should feel completely natural and authentic - as if this product genuinely belongs in this environment. Use beautiful, professional lighting that enhances both the product and the environment. The product should be the clear hero of the image while feeling perfectly at home in its surroundings.

Key Requirements:
- The environment should reflect how this product would naturally be used
- Lighting and composition should be magazine-quality
- The product should look like it was professionally photographed in this setting
- Avoid any forced or artificial placement
- The scene should tell a story about the product's value and use case

Environment Style: ${environment}`;
};

// Get Natural Environment format from constants
export const getNaturalEnvironmentFormat = () => {
    return AD_FORMATS.find(format => format.id === 101) || AD_FORMATS[0];
};