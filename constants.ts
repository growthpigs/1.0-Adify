import { AdFormat } from './types';
import { 
    BuildingIcon, NewspaperIcon, BusStopIcon, ShirtIcon, MugIcon, 
    FacebookIcon, SubwayIcon, MagazineIcon, StadiumIcon, ShoppingBagIcon,
    TikTokIcon, InfluencerIcon, PhoneCaseIcon, BookCoverIcon, BoxIcon,
    NewsIcon, QuoteIcon, TVIcon, TwitterIcon, BrainIcon, SplitIcon,
    TwoPeopleIcon, MessageSquareIcon, YouTubeIcon, LightbulbIcon,
    LinkedInIcon, PodcastIcon, RedditIcon, ProductHuntIcon,
    UserIcon, AlertTriangleIcon, ChevronsRightIcon, CheckCircleIcon, BookOpenIcon,
    HelpCircleIcon, StarIcon, SearchIcon, UsersIcon, TagIcon, ListIcon, TargetIcon, LeafIcon, ImageIcon
} from './components/Icons';
import {
    LaptopIcon, MobileAppIcon, WallpaperIcon, BusinessCardIcon, WebsiteIcon, SmartTVIcon,
    InstagramIcon, TikTokIcon2, PinterestIcon, DiscordIcon, ShoppingIcon, VideoIcon
} from './components/NewIcons';

export const DESIGN_RULES = `
IMPORTANT DESIGN RULES:
1.  **Image Containment**: The user's uploaded product image MUST be placed within a container, frame, or designated area. It must NEVER go edge-to-edge on the final generated image. There must always be padding or a background visible around it.
2.  **Text Placement**: ALL text (slogans, captions, headlines) MUST be placed OUTSIDE the user's product image area. Do NOT overlay any text directly on top of the product image itself. Text should be in its own designated space (e.g., a header, footer, or colored block).
3.  **Font Style**: Use modern, clean, sans-serif fonts for all text unless explicitly told otherwise. Text should be highly legible.
4.  **High-Fidelity Rendering**: The user's product image MUST be treated as the primary subject. Before placing it, internally upscale it using a high-quality algorithm to ensure it is sharp and clear at its final size in the composition. It must be rendered with photorealistic quality, completely free of any pixelation, blurriness, or digital artifacts. It should look like it was photographed in the scene, not digitally added.
5.  **Overall Design**: The final output must look clean, professional, and well-composed. Follow principles of good visual hierarchy.
`;

export const AD_FORMATS: AdFormat[] = [
  {
    id: 1,
    name: 'Urban Billboard',
    prompt: 'Place this product on a massive, photorealistic billboard in a bustling, rainy, neon-lit city square like Times Square or Tokyo. The lighting should be dramatic.',
    icon: BuildingIcon,
    type: 'mockup',
  },
  {
    id: 2,
    name: 'Newspaper Ad',
    prompt: 'Integrate this product into a classic black and white newspaper advertisement. It should look like a vintage ad, surrounded by articles and text.',
    icon: NewspaperIcon,
    type: 'mockup',
  },
  {
    id: 3,
    name: 'Bus Stop Ad',
    prompt: 'Display this product in an ad inside a modern glass bus stop shelter on a sunny city street. Include reflections on the glass for realism.',
    icon: BusStopIcon,
    type: 'mockup',
  },
  {
    id: 4,
    name: 'T-Shirt Mockup',
    prompt: 'Print this product on the front of a plain white cotton t-shirt being worn by a person (no face visible) in a casual outdoor setting.',
    icon: ShirtIcon,
    type: 'mockup',
  },
  {
    id: 5,
    name: 'Coffee Mug',
    prompt: 'Wrap this product\'s image around a ceramic coffee mug. The mug should be sitting on a wooden desk next to a laptop and a notebook.',
    icon: MugIcon,
    type: 'mockup',
  },
  {
    id: 6,
    name: 'Social Media Ad',
    prompt: 'Create a realistic sponsored ad for a social media feed like Instagram featuring this product. Include a caption, likes, and comments for authenticity.',
    icon: FacebookIcon,
    type: 'mockup',
  },
  {
    id: 7,
    name: 'Subway Ad',
    prompt: 'Put this product on an advertisement poster inside a moving subway car. The image should have slight motion blur and reflections from the interior lights.',
    icon: SubwayIcon,
    type: 'mockup',
  },
  {
    id: 8,
    name: 'Magazine Spread',
    prompt: 'Feature this product in a glossy, full-page ad in a high-fashion magazine. The layout should be elegant and minimalist.',
    icon: MagazineIcon,
    type: 'mockup',
  },
  {
    id: 9,
    name: 'Stadium Jumbotron',
    prompt: 'Show this product on a massive Jumbotron screen in a packed sports stadium during an evening game. The screen should be glowing brightly.',
    icon: StadiumIcon,
    type: 'mockup',
  },
  {
    id: 10,
    name: 'Tote Bag',
    prompt: 'Print this product on a canvas tote bag. The bag should be carried by a person walking through a vibrant farmers market.',
    icon: ShoppingBagIcon,
    type: 'mockup',
  },
  {
    id: 11,
    name: 'Viral Video Grab',
    prompt: 'Create a photorealistic screen grab of a viral video on a platform like TikTok or Reels. The product should be the star of the video, captured mid-action. Include UI elements like a user\'s handle, and engagement icons.',
    icon: TikTokIcon,
    type: 'mockup',
  },
  {
    id: 12,
    name: 'Influencer Story',
    prompt: 'Generate an image that looks like a casual, authentic social media story from an influencer. The product is featured in a \'just got this!\' unboxing style. Include story UI elements like a poll or a question sticker.',
    icon: InfluencerIcon,
    type: 'mockup',
  },
  {
    id: 13,
    name: 'Phone Case',
    prompt: 'Create a mockup of this product printed on a phone case. The phone should be held in a hand against a stylish, blurred background to emphasize the case design.',
    icon: PhoneCaseIcon,
    type: 'mockup',
  },
  {
    id: 14,
    name: 'Book Cover',
    prompt: 'Design a compelling book cover using this product as the central theme. The book should be displayed in a photorealistic setting, perhaps on a bookshelf or a table.',
    icon: BookCoverIcon,
    type: 'mockup',
  },
  {
    id: 15,
    name: 'Product Box',
    prompt: 'Design a sleek, modern product box packaging for this item. The box should be rendered photorealistically, possibly with other items on a clean studio background.',
    icon: BoxIcon,
    type: 'mockup',
  },
  {
    id: 101,
    name: 'Natural Environment',
    prompt: 'Analyze the product based on its description. Place this product in its most natural, contextually appropriate, and photorealistic environment. For example, a kitchen gadget would be in a modern kitchen, sports equipment on a field or in a gym. The scene must be beautifully composed, with realistic lighting and textures that make the product look completely at home. The product must be the clear hero of the image.',
    icon: LeafIcon,
    type: 'mockup',
  },
  // New Strategic Mockup Formats
  {
    id: 102,
    name: 'Laptop Screen Display',
    prompt: 'Display this product on a modern laptop screen in a clean workspace setting. The laptop should be open on a minimalist desk with soft, professional lighting. Perfect for SaaS, digital products, and software showcases.',
    icon: LaptopIcon,
    type: 'mockup',
  },
  {
    id: 103,
    name: 'Mobile App Interface',
    prompt: 'Present this product as a mobile app interface on a modern smartphone. The phone should be held in a hand or placed on a clean surface with a blurred background to emphasize the app design.',
    icon: MobileAppIcon,
    type: 'mockup',
  },
  {
    id: 104,
    name: 'Desktop Wallpaper',
    prompt: 'Create a desktop wallpaper featuring this product as the main visual element. The design should be suitable for computer backgrounds with appropriate resolution and aesthetic appeal.',
    icon: WallpaperIcon,
    type: 'mockup',
  },
  {
    id: 105,
    name: 'Business Card Design',
    prompt: 'Design a professional business card featuring this product. The card should be displayed in a realistic business setting, perhaps on a desk or being handed between professionals.',
    icon: BusinessCardIcon,
    type: 'mockup',
  },
  {
    id: 106,
    name: 'Website Header Hero',
    prompt: 'Create a website hero section mockup featuring this product. The design should include navigation elements and be displayed on a laptop or desktop screen to show realistic web usage.',
    icon: WebsiteIcon,
    type: 'mockup',
  },
  {
    id: 107,
    name: 'Smart TV Display',
    prompt: 'Show this product on a large smart TV screen in a modern living room setting. The TV should be wall-mounted or on a sleek stand with ambient lighting for premium presentation.',
    icon: SmartTVIcon,
    type: 'mockup',
  },
];

export const SOCIAL_MEDIA_FORMATS: AdFormat[] = [
  {
    id: 16,
    name: 'Breaking News',
    prompt: `Create an authentic-looking breaking news screen. The layout should have a designated area for the main image and a separate, bold "BREAKING NEWS" lower-third graphic at the bottom containing the slogan. ${DESIGN_RULES}`,
    icon: NewsIcon,
    type: 'social',
  },
  {
    id: 17,
    name: 'Inspirational Quote',
    prompt: `Generate a beautifully designed image with a clean, spacious layout. Place the product image subtly to one side. In a separate area, display the slogan as a powerful quote. The quote's font MUST be an elegant, legible **serif font** and use **normal sentence case** (not all uppercase). The overall mood should be uplifting and minimalist. ${DESIGN_RULES}`,
    icon: QuoteIcon,
    type: 'social',
  },
  {
    id: 18,
    name: 'Modern News Desk',
    prompt: `Generate an image of a modern news anchor desk. The product image must appear on a screen in the background or on a tablet on the desk. All text/graphics must be part of a clean, bold news overlay, separate from the product image screen. ${DESIGN_RULES}`,
    icon: TVIcon,
    type: 'social',
  },
  {
    id: 19,
    name: 'X (Twitter) Post',
    prompt: `Create a realistic mockup of a viral X (formerly Twitter) post within the platform's UI. The product image must be in the designated media area, and the witty slogan/caption must be in the text area above it. Include high engagement numbers for realism. ${DESIGN_RULES}`,
    icon: TwitterIcon,
    type: 'social',
  },
  {
    id: 20,
    name: 'Expanding Brain Meme',
    prompt: `Create a 4-panel "expanding brain" comic layout. The user's product image should appear ONLY in the final panel, fully contained within the panel's boundaries. The slogan/text should serve as the caption for the final panel, placed outside the image area. ${DESIGN_RULES}`,
    icon: BrainIcon,
    type: 'social',
  },
  {
    id: 21,
    name: 'Problem vs. Solution',
    prompt: `Create a clean, two-panel comic with clear labels "Problem" and "Solution" above each panel. The product image should appear in the "Solution" panel. The slogan should be a concise caption for the "Solution" panel, placed underneath it. ${DESIGN_RULES}`,
    icon: SplitIcon,
    type: 'social',
  },
  {
    id: 22,
    name: 'The Better Choice',
    prompt: `Create an image inspired by choice comparison memes. The product should be clearly presented as the superior option. Any text or slogan should be used as labels or captions, not overlaid on the images. ${DESIGN_RULES}`,
    icon: TwoPeopleIcon,
    type: 'social',
  },
  {
    id: 23,
    name: 'Debate Table',
    prompt: `Create an image of a person at a table with a sign that reads "[Slogan]". The product image should be placed neatly on the table next to the sign, not obscured by it. ${DESIGN_RULES}`,
    icon: MessageSquareIcon,
    type: 'social',
  },
  {
    id: 24,
    name: 'YouTube Thumbnail',
    prompt: `Design a modern, clickbait-style YouTube thumbnail. The product image must be a key element but contained within the frame. The slogan/headline must be in a separate, bold, high-contrast text block with a solid color background for maximum legibility. ${DESIGN_RULES}`,
    icon: YouTubeIcon,
    type: 'social',
  },
  {
    id: 25,
    name: 'Top/Bottom Text Meme',
    prompt: `Create a classic meme format. The product image is the central picture. The slogan should be split into top and bottom captions. The text MUST be in a white Impact font with a black outline and placed within solid-colored bars (e.g., black bars) above and below the product image area, ensuring no text touches the product image itself. ${DESIGN_RULES}`,
    icon: LightbulbIcon,
    type: 'social',
  },
  {
    id: 26,
    name: 'LinkedIn Post',
    prompt: `Create a realistic mockup of a professional LinkedIn post. The product image must be within the post's media container. The slogan/caption should be part of the text body of the post, discussing business or innovation. ${DESIGN_RULES}`,
    icon: LinkedInIcon,
    type: 'social',
  },
  {
    id: 27,
    name: 'Podcast Cover',
    prompt: `Design a compelling, square podcast cover art. The product image should be a central visual element but well-composed within the square. The podcast title (the slogan) must be in its own space with clean, bold typography, not obscuring the product. ${DESIGN_RULES}`,
    icon: PodcastIcon,
    type: 'social',
  },
  {
    id: 28,
    name: 'Reddit Post',
    prompt: `Create an authentic mockup of a Reddit post viewed on the official app or website. The mockup must include the subreddit (e.g., r/productporn), title (the slogan), user, and upvote count. The product image must be perfectly contained within Reddit's media preview area. ${DESIGN_RULES}`,
    icon: RedditIcon,
    type: 'social',
  },
  {
    id: 29,
    name: 'Product Hunt Launch',
    prompt: `Design a "Product of the Day" card for Product Hunt. The UI must be recreated faithfully. The product image goes in the thumbnail area, and the slogan serves as the catchy tagline in its designated text field. ${DESIGN_RULES}`,
    icon: ProductHuntIcon,
    type: 'social',
  },
  {
    id: 30,
    name: 'Influencer Unboxing',
    prompt: `Generate an image of a social media story. The product is being unboxed. The slogan can be used as text in a sticker or as a caption using a typical social media font, placed in a clear area of the screen. ${DESIGN_RULES}`,
    icon: InfluencerIcon,
    type: 'social',
  },
  // New Strategic Social Media Formats
  {
    id: 43,
    name: 'Instagram Feed Post',
    prompt: `Create a realistic Instagram feed post mockup featuring this product. Include the Instagram UI elements like profile picture, username, caption area, and engagement buttons. The image should look like an authentic lifestyle or product post. ${DESIGN_RULES}`,
    icon: InstagramIcon,
    type: 'social',
  },
  {
    id: 44,
    name: 'TikTok Video Cover',
    prompt: `Design a TikTok video cover image featuring this product. The layout should match TikTok's vertical video format with overlay UI elements. Include trending hashtags and engagement metrics for authenticity. ${DESIGN_RULES}`,
    icon: TikTokIcon2,
    type: 'social',
  },
  {
    id: 45,
    name: 'Pinterest Pin',
    prompt: `Create a Pinterest-style pin featuring this product. The image should be vertical (2:3 ratio) with eye-catching graphics and text overlay designed to drive clicks. Include Pinterest UI elements for realism. ${DESIGN_RULES}`,
    icon: PinterestIcon,
    type: 'social',
  },
  {
    id: 46,
    name: 'Discord Embed',
    prompt: `Design a Discord message embed featuring this product. The embed should include a title, description, and the product image in Discord's distinctive card format with the platform's dark theme. ${DESIGN_RULES}`,
    icon: DiscordIcon,
    type: 'social',
  },
];

export const FACEBOOK_AD_FORMATS: AdFormat[] = [
    {
      id: 31,
      name: 'The Humblebrag',
      prompt: 'Create a Facebook ad that looks like a native, personal discovery post. Start with a conversational hook like "I saw this the other day..." or "Okay, so I have to share this...". The tone should be authentic and enthusiastic, not salesy. The image should look like a genuine user photo.',
      icon: UserIcon,
      type: 'facebook',
    },
    {
      id: 32,
      name: 'Problem-Agitate-Solve',
      prompt: 'Write an ad using the PAS formula. Headline: State a common problem. Body: Agitate the problem, describing the frustration it causes. Then, introduce the product as the ultimate solution. The image should visually represent the "solved" state or the product in a positive light.',
      icon: AlertTriangleIcon,
      type: 'facebook',
    },
    {
      id: 33,
      name: 'Before-After-Bridge',
      prompt: 'Structure the ad with the BAB formula. Body: Describe the "Before" state (the world without your product). Then describe the "After" state (the ideal world with your product). Position the product as the "Bridge" to get there. The image could be a split-screen or show the happy "After" state.',
      icon: ChevronsRightIcon,
      type: 'facebook',
    },
    {
      id: 34,
      name: 'Feature-Benefit',
      prompt: 'Write a clear, benefit-driven ad. Headline: State the single biggest benefit. Body: List 2-3 key features, but immediately follow each with the direct benefit it provides to the user (e.g., "Feature: 10-hour battery. Benefit: Never worry about charging during a busy day.").',
      icon: CheckCircleIcon,
      type: 'facebook',
    },
    {
      id: 35,
      name: 'The Storyteller',
      prompt: 'Create an ad that tells a compelling personal story. It could be the founder\'s story or a relatable customer journey. The story should connect emotionally with the target audience and naturally lead to the product as a key part of the narrative.',
      icon: BookOpenIcon,
      type: 'facebook',
    },
    {
      id: 36,
      name: 'The "How-To" Guide',
      prompt: 'Create an advertorial-style ad that provides genuine value. Headline: "How to [Achieve Desired Outcome]". Body: Give 3-5 useful tips, with the final and most effective tip involving your product. This builds trust by teaching before selling.',
      icon: HelpCircleIcon,
      type: 'facebook',
    },
    {
      id: 37,
      name: 'The Testimonial',
      prompt: 'Frame the ad as a powerful customer testimonial. Headline: A powerful, benefit-driven quote from a customer. Body: The rest of the glowing review. The image should ideally look like user-generated content featuring the product.',
      icon: StarIcon,
      type: 'facebook',
    },
    {
      id: 38,
      name: 'The Question Ad',
      prompt: 'Start the ad with a direct, engaging question that the target audience would answer "yes" to. Headline: "Struggling with [Problem]?". Body: Acknowledge their struggle and introduce the product as the answer they\'ve been searching for.',
      icon: SearchIcon,
      type: 'facebook',
    },
    {
      id: 39,
      name: 'The "Us vs. Them"',
      prompt: 'Position the product against the "old way" or a common competitor. Headline: "Stop [Doing the Old Thing]". Body: Explain why the old way is inefficient/frustrating and how your product is the new, superior solution. Image should highlight the product\'s key advantage.',
      icon: UsersIcon,
      type: 'facebook',
    },
    {
      id: 40,
      name: 'The Direct Offer',
      prompt: 'Create a clear, straightforward ad for a promotion or discount. Headline: State the offer clearly (e.g., "50% Off Ends Tonight!"). Body: Briefly reiterate the offer, add urgency, and provide a strong call to action. The image should be clean and product-focused.',
      icon: TagIcon,
      type: 'facebook',
    },
    {
      id: 41,
      name: 'The Listicle',
      prompt: 'Write an ad in the style of a listicle. Headline: "5 Reasons You Need [Product Category]". Body: Create a numbered or bulleted list where each point highlights a key benefit or use case of the product. It\'s easily scannable and provides value.',
      icon: ListIcon,
      type: 'facebook',
    },
    {
        id: 42,
        name: 'The Authority',
        prompt: 'Position the product as the choice of experts. Headline: "Why Experts Are Recommending [Product]". Body: Reference data, awards, or expert opinions. The tone should be credible and authoritative. The image should look professional and trustworthy.',
        icon: TargetIcon,
        type: 'facebook'
    },
    // New Strategic Facebook Ad Formats
    {
        id: 47,
        name: 'Instagram Shopping Ad',
        prompt: 'Create an Instagram Shopping ad format. Headline: "Shop [Product] Now". Body: Highlight the key features and benefits with a clear call-to-action to "Shop Now" or "Learn More". Include product tags and pricing if applicable. The image should showcase the product in an appealing lifestyle context.',
        icon: ShoppingIcon,
        type: 'facebook'
    },
    {
        id: 48,
        name: 'Video Ad Script',
        prompt: 'Write a compelling video ad script. Opening Hook: Grab attention in the first 3 seconds with a relatable problem or surprising statement. Middle: Demonstrate the product solving the problem with clear benefits. Closing: Strong call-to-action with urgency. Keep it under 30 seconds for optimal engagement.',
        icon: VideoIcon,
        type: 'facebook'
    },
    {
        id: 49,
        name: 'Carousel Ad Copy',
        prompt: 'Create carousel ad copy showcasing multiple product features or use cases. Each card should highlight a different benefit or feature. Card 1: Main value proposition. Cards 2-4: Supporting features/benefits. Final card: Strong call-to-action with special offer or incentive.',
        icon: ChevronsRightIcon,
        type: 'facebook'
    },
    {
        id: 50,
        name: 'Professional Portrait Frame',
        prompt: `Create a clean, professional frame or border layout where the uploaded image appears as a contained photo within a stylish frame or card design. Add subtle professional graphics or patterns around the frame, and include any slogan text in a dedicated text area below or beside the framed image. This format treats the image respectfully as a professional portrait or reference photo. ${DESIGN_RULES}`,
        icon: ImageIcon,
        type: 'mockup'
    }
];