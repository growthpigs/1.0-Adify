export type FormatType = 'mockup' | 'social' | 'facebook';

export interface AdFormat {
  id: number;
  name: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  type: FormatType;
}

export interface GeneratedAdResult {
    imageUrl: string | null;
    text: string | null;
}

export interface MockupContent {
    imageUrl: string;
    slogan: string;
    format?: string;
}

export interface FacebookAdContent {
    imageUrl: string;
    headline: string;
    bodyText: string;
    imagePrompt?: string;
}

export type GeneratedContent = MockupContent | FacebookAdContent;

export type SloganType = 'hook' | 'meme' | 'joke' | 'quote' | 'fun_fact' | 'tagline';

export interface UploadedImage {
    id: string;
    file: File;
    previewUrl: string;
    name: string;
    description?: string;
    analysis?: SmartProductAnalysis;
    smartInput?: SmartProductInput;
}

// Smart Analysis Types
export type Industry = 
    | 'saas' 
    | 'ecommerce' 
    | 'fashion' 
    | 'food_beverage' 
    | 'fitness_wellness' 
    | 'technology' 
    | 'b2b_services' 
    | 'automotive' 
    | 'real_estate' 
    | 'education' 
    | 'healthcare' 
    | 'finance' 
    | 'entertainment' 
    | 'travel' 
    | 'home_garden';

export type TargetAudience = 
    | 'entrepreneurs' 
    | 'gen_z' 
    | 'millennials' 
    | 'busy_professionals' 
    | 'parents' 
    | 'students' 
    | 'corporate_buyers' 
    | 'fitness_enthusiasts' 
    | 'tech_savvy' 
    | 'luxury_consumers' 
    | 'budget_conscious' 
    | 'early_adopters'
    | 'creative_professionals'
    | 'artists_designers'
    | 'content_creators'
    | 'homeowners';

export type ProductType = 
    | 'physical_product' 
    | 'software_app' 
    | 'logo_brand' 
    | 'service_business' 
    | 'digital_product' 
    | 'food_beverage' 
    | 'fashion_item' 
    | 'tech_gadget' 
    | 'home_goods' 
    | 'beauty_product';

export interface SmartProductAnalysis {
    productType: ProductType;
    suggestedTitle: string;
    detectedIndustry: Industry;
    recommendedAudiences: TargetAudience[];
    userStory: string;
    confidence: number; // 0-100
    naturalEnvironments: string[];
    avoidFormats: string[];
}

export interface SmartProductInput {
    title: string;
    description: string;
    industry: Industry | null;
    targetAudience: TargetAudience | null;
    isAnalysisConfirmed: boolean;
    analysis: SmartProductAnalysis | null;
}