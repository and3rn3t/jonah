# Planning Guide

A vibrant personal web page showcasing a 14-year-old's passions for anime and swimming with an energetic, youthful aesthetic.

**Experience Qualities**:
1. **Energetic** - The design should feel dynamic and youthful with bold colors and playful interactions that reflect teenage enthusiasm.
2. **Personal** - Content should feel authentic and genuine, like a digital space that truly belongs to the owner.
3. **Expressive** - Visual elements should celebrate both anime culture and athletic achievement without compromise.

**Complexity Level**: Content Showcase (information-focused)
  - This is primarily an informational personal page that presents content about interests, hobbies, and personality without complex interactive features.

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

## Edge Case Handling
- **Empty State**: If no content exists, display placeholder content that fits the theme
- **Long Text**: Descriptions are truncated with proper ellipsis handling to maintain layout
- **Image Loading**: Graceful fallbacks with background colors if images fail to load
- **Mobile Viewing**: Content reflows naturally for smaller screens without horizontal scroll

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

## Component Selection

- **Components**:
  - Card: For anime favorites and swimming achievements displays with hover effects
  - Badge: For tags (anime genres, swimming strokes, skills)
  - Separator: To divide major sections
  - Button: For potential contact/social links
  - Avatar: For profile image in hero section
  
- **Customizations**:
  - Custom gradient backgrounds using multiple layers and mesh patterns
  - Anime-style card hover effects with enhanced shadows and border glows
  - Custom wave pattern SVG background elements to reinforce swimming theme
  
- **States**:
  - Cards: Default has subtle shadow, hover lifts with enhanced glow and slight scale
  - Badges: Pill-shaped with vibrant colors, subtle pulse on hover
  - Buttons: Bold accent color, scale slightly on hover with brightness shift
  
- **Icon Selection**:
  - Swim: For swimming section header
  - Television: For anime section header  
  - User: For about section
  - Star: For favorites/ratings
  - Trophy: For achievements
  
- **Spacing**:
  - Section padding: py-16 md:py-24
  - Card gaps: gap-6 md:gap-8
  - Content max-width: max-w-6xl
  - Internal card padding: p-6
  
- **Mobile**:
  - Hero section stacks vertically with centered content
  - Card grids go from 3 columns → 2 columns → 1 column
  - Section padding reduces from py-24 to py-12
  - Typography scales down: H1 from 48px to 36px
