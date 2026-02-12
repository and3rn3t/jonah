# Planning Guide

A vibrant personal web page showcasing a 14-year-old's passions for anime and swimming with an energetic, youthful aesthetic.

**Experience Qualities**:
1. **Energetic** - The design should feel dynamic and youthful with bold colors and playful interactions that reflect teenage enthusiasm.
2. **Personal** - Content should feel authentic and genuine, like a digital space that truly belongs to the owner.
3. **Expressive** - Visual elements should celebrate both anime culture and athletic achievement without compromise.

**Complexity Level**: Light Application (multiple features with basic state)
  - This personal page now includes photo management capabilities with persistent storage, allowing the owner to upload, edit, and delete their own photos through the interface.

## Essential Features

**Hero Introduction Section**
- Functionality: Display name, age, and a brief welcoming tagline with avatar/photo
- Purpose: Create immediate personal connection and set the tone for the page
- Trigger: Page load
- Progression: Page loads → Hero section animates in → User reads introduction
- Success criteria: Visitor immediately understands whose page this is and gets a sense of personality

**Anime Favorites Showcase**
- Functionality: Display favorite anime series with cover images and brief descriptions
- Purpose: Share passion for anime and provide conversation starters
- Trigger: User scrolls to anime section
- Progression: Scroll into view → Cards animate in → User can view favorite series
- Success criteria: Anime favorites are clearly displayed with appealing visual presentation

**Swimming Achievements Section**
- Functionality: Highlight swimming accomplishments, favorite strokes, and personal bests
- Purpose: Showcase athletic dedication and achievements
- Trigger: User scrolls to swimming section
- Progression: Scroll into view → Stats/achievements display → User learns about swimming passion
- Success criteria: Swimming accomplishments are presented in an engaging, proud way

**About Me Section**
- Functionality: Share additional personality details, interests, and fun facts
- Purpose: Provide deeper insight into personality beyond main interests
- Trigger: User scrolls to about section
- Progression: Scroll into view → Content reveals → User learns more personal details
- Success criteria: Visitor gets a well-rounded sense of personality and interests

**Photo Gallery Section**
- Functionality: Display filterable photo grid showcasing swimming meet photos and anime screenshots with lightbox modal; allows owner to upload, edit, and delete photos
- Purpose: Visual storytelling through favorite moments and screenshots, with full content management capabilities
- Trigger: User scrolls to gallery section, clicks filter buttons or photos; owner clicks "Add Photo" button to upload new photos
- Progression: Scroll into view → Gallery displays → User filters by category → Clicks photo → Lightbox opens with full view → Navigate with arrows or keyboard → Close to return; Owner opens upload dialog → Selects image file → Fills in title, category, description → Submits to add photo; Owner hovers photo → Clicks edit/delete icons → Updates details or removes photo
- Success criteria: Photos are displayed in organized grid, filters work smoothly, lightbox provides immersive viewing experience, owner can upload images from device, edit photo metadata, delete unwanted photos, all data persists between sessions

**Social Media Links & Contact Form**
- Functionality: Display social media profiles and provide message form
- Purpose: Enable visitors to connect on multiple platforms or send direct messages
- Trigger: User scrolls to contact section
- Progression: Scroll into view → User views social links or fills form → Clicks social button or submits message → Receives confirmation
- Success criteria: Social links are clearly visible, form validates input and shows success message

## Edge Case Handling
- **Empty Gallery State**: If no photos exist, display helpful empty state with prompt to add photos (for owners) or simple message (for visitors)
- **Photo Upload Validation**: Only image files are accepted for upload; shows error toast for invalid file types
- **Large Image Files**: Files are converted to base64 data URLs for storage in KV persistence
- **Long Text**: Descriptions are truncated with proper ellipsis handling to maintain layout
- **Image Display**: Real uploaded photos display as actual images; placeholder photos show emoji icons
- **Mobile Viewing**: Content reflows naturally for smaller screens without horizontal scroll
- **Gallery Filtering**: Smooth animations when switching between photo categories; filter state maintained when adding/removing photos
- **Keyboard Navigation**: Gallery lightbox supports arrow keys and escape key for accessibility
- **Owner Detection**: Edit/delete controls only visible to page owner; add photo button only appears for owner
- **Persistence**: All photo data stored in KV storage and survives page refreshes

## Design Direction

The design should feel like a fusion of anime-inspired vibrancy and aquatic freshness - energetic, youthful, and confident. Think bold accent colors reminiscent of anime aesthetics combined with cool water-inspired blues and gradients that suggest movement and fluidity.

## Color Selection

A dynamic palette that merges anime culture's vibrant energy with swimming's aquatic coolness.

- **Primary Color**: Deep Ocean Blue `oklch(0.45 0.15 240)` - Represents swimming and water, provides grounding
- **Secondary Colors**: 
  - Bright Cyan `oklch(0.75 0.15 200)` - Energetic water splash accent
  - Soft Teal `oklch(0.65 0.12 210)` - Supporting aquatic tone
- **Accent Color**: Electric Magenta `oklch(0.65 0.25 330)` - Bold anime-inspired pop for CTAs and highlights
- **Foreground/Background Pairings**:
  - Background (Soft Blue-White `oklch(0.97 0.01 220)`): Deep Navy Text `oklch(0.2 0.05 240)` - Ratio 13.2:1 ✓
  - Primary (Deep Ocean Blue `oklch(0.45 0.15 240)`): White text `oklch(1 0 0)` - Ratio 7.8:1 ✓
  - Accent (Electric Magenta `oklch(0.65 0.25 330)`): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Card backgrounds (White `oklch(1 0 0)`): Deep Navy Text `oklch(0.2 0.05 240)` - Ratio 15.1:1 ✓

## Font Selection

Typography should balance playful energy with clear readability, evoking both manga/anime style and modern athletic aesthetics.

- **Typographic Hierarchy**:
  - H1 (Name/Hero): Space Grotesk Bold/48px/tight tracking (-0.02em)
  - H2 (Section Headers): Space Grotesk Bold/32px/normal tracking
  - H3 (Subsections): Space Grotesk Medium/24px/normal tracking
  - Body Text: Inter Regular/16px/relaxed leading (1.6)
  - Captions: Inter Medium/14px/normal leading

## Animations

Animations should feel lively and expressive without being overwhelming - think anime opening credits energy but refined for web.

- Section reveal animations with slight upward movement and fade-in (stagger for multiple items)
- Hover states on cards with subtle lift and glow effects
- Smooth scroll behavior between sections
- Playful micro-interactions on buttons with scale and color transitions
- Photo gallery grid uses layout animations when filtering categories
- Lightbox modal entrance with spring physics for natural feel
- Navigation arrows pulse subtly to indicate interactivity

## Component Selection

- **Components**:
  - Card: For anime favorites, swimming achievements, and photo gallery items with hover effects
  - Badge: For tags (anime genres, swimming strokes, skills, photo categories)
  - Separator: To divide major sections
  - Button: For social links, contact form, and gallery filters/navigation
  - Avatar: For profile image in hero section
  - Dialog/Modal: For photo gallery lightbox viewing experience
  - Input/Textarea: For contact form fields
  
- **Customizations**:
  - Custom gradient backgrounds using multiple layers and mesh patterns
  - Anime-style card hover effects with enhanced shadows and border glows
  - Custom wave pattern SVG background elements to reinforce swimming theme
  
- **States**:
  - Cards: Default has subtle shadow, hover lifts with enhanced glow and slight scale
  - Badges: Pill-shaped with vibrant colors, subtle pulse on hover
  - Buttons: Bold accent color, scale slightly on hover with brightness shift
  
- **Icon Selection**:
  - Waves: For swimming section header
  - Television: For anime section header  
  - User: For about section
  - Star: For favorites/ratings
  - Trophy: For achievements
  - Images: For photo gallery section header
  - CaretLeft/CaretRight: For photo navigation in lightbox
  - X: For closing lightbox modal
  - Plus: For adding new photos (owner only)
  - Trash: For deleting photos (owner only)
  - PencilSimple: For editing photos (owner only)
  - Upload: For upload action in dialog
  - Social icons: Discord, Instagram, Twitch, YouTube
  - PaperPlaneTilt: For contact/messaging
  
- **Spacing**:
  - Section padding: py-16 md:py-24
  - Card gaps: gap-6 md:gap-8
  - Content max-width: max-w-6xl
  - Internal card padding: p-6
  
- **Mobile**:
  - Hero section stacks vertically with centered content
  - Card grids go from 3 columns → 2 columns → 1 column
  - Photo gallery grid: 4 columns → 3 columns → 2 columns on mobile
  - Section padding reduces from py-24 to py-12
  - Typography scales down: H1 from 48px to 36px
  - Lightbox navigation arrows hidden on mobile, replaced with button controls
  - Social media cards stack vertically on smaller screens
