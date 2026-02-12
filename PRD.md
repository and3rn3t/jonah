# Planning Guide

A vibrant personal web page showcasing a 14-year-old's passions for anime and swimming with an energetic, youthful aesthetic.

**Experience Qualities**:
1. **Energetic** - The design should feel dynamic and youthful with bold colors and playful interactions that reflect teenage enthusiasm.
2. **Personal** - Content should feel authentic and genuine, like a digital space that truly belongs to the owner.
3. **Expressive** - Visual elements should celebrate both anime culture and athletic achievement without compromise.

**Complexity Level**: Light Application (multiple features with basic state)
  - This personal page includes comprehensive content management capabilities with persistent storage, allowing the owner to fully customize all site content through an admin interface - from profile information to anime favorites, swimming achievements, social links, and more.

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
- Functionality: Display social media profiles and provide message form with email notifications; owner can manage social links through admin panel and view all messages
- Purpose: Enable visitors to connect on multiple platforms or send direct messages; notify owner of new contact submissions
- Trigger: User scrolls to contact section; visitor submits contact form; owner clicks admin button to manage social links or view messages
- Progression: Scroll into view → User views social links or fills form → Submits message → Message stored in KV → Owner receives email notification with sender details → Success confirmation shown; Owner opens admin panel → Navigates to Messages tab → Views all messages with unread badge → Reads/deletes messages → Navigates to Social tab → Adds/edits/deletes social links → Saves changes
- Success criteria: Social links are clearly visible, form validates input, messages are stored persistently, owner receives email notification at their GitHub email, unread count badge appears on admin button and Messages tab, owner can view/manage all messages through admin interface

**Dark Mode Toggle**
- Functionality: Toggle between light and dark color themes with persistent preference
- Purpose: Provide comfortable viewing in different lighting conditions and user preference
- Trigger: User clicks theme toggle button in top-right corner
- Progression: Click toggle → Theme transitions smoothly → Dark mode activated → Preference saved to KV storage → Setting persists across page visits
- Success criteria: Theme switches smoothly without flash, all colors remain accessible and readable in both modes, preference persists between sessions

**Admin Content Management**
- Functionality: Comprehensive admin panel allowing site owner to edit all content including profile info, anime list, swimming achievements, social links, hobbies, fun facts, and view contact messages with email notifications
- Purpose: Give complete control over site content without code changes; centralized inbox for contact form submissions
- Trigger: Owner clicks floating admin button (gear icon) in bottom-right corner; new messages add unread badge to admin button
- Progression: Click admin button → Enter password → Panel opens with tabbed interface → Select category (Profile/Anime/Swimming/About/Social/Messages/Settings) → Edit existing items or add new ones → Delete unwanted items → View contact messages with unread indicators → Mark messages as read or delete → Click "Save All Changes" → Content persists and page updates
- Success criteria: All site content is editable through intuitive interface, changes save to KV storage, updates reflect immediately on page, only visible to site owner, contact messages display with unread count badge, messages persist between sessions

## Edge Case Handling
- **Empty Gallery State**: If no photos exist, display helpful empty state with prompt to add photos (for owners) or simple message (for visitors)
- **Photo Upload Validation**: Only image files are accepted for upload; shows error toast for invalid file types
- **Large Image Files**: Files are converted to base64 data URLs for storage in KV persistence
- **Long Text**: Descriptions are truncated with proper ellipsis handling to maintain layout
- **Image Display**: Real uploaded photos display as actual images; placeholder photos show emoji icons
- **Mobile Viewing**: Content reflows naturally for smaller screens without horizontal scroll
- **Gallery Filtering**: Smooth animations when switching between photo categories; filter state maintained when adding/removing photos
- **Keyboard Navigation**: Gallery lightbox supports arrow keys and escape key for accessibility
- **Owner Detection**: Edit/delete controls only visible to page owner; admin panel button only appears for owner
- **Persistence**: All content and photo data stored in KV storage and survives page refreshes
- **Empty Content States**: If owner deletes all items in a section (anime, achievements, etc.), section displays gracefully with empty arrays
- **Content Validation**: Admin panel prevents saving invalid data (e.g., empty titles, invalid ratings)
- **Multiple Social Platforms**: Supports Discord, Instagram, Twitch, YouTube, Twitter, and TikTok with platform-specific styling
- **Admin Dialog Overflow**: Large content lists scroll within dialog on smaller screens
- **Theme Persistence**: Theme preference stored in KV and applied on page load to prevent flash of wrong theme
- **Dark Mode Colors**: All color variables recalibrated for dark mode to maintain contrast ratios and accessibility
- **Empty Messages State**: If no contact messages exist, displays empty state with helpful icon and message
- **Email Notification Failure**: If email notification fails, form submission still succeeds and message is stored
- **Unread Message Counter**: Badge updates reactively when messages are marked as read or deleted
- **Message Persistence**: All contact form submissions stored in KV storage with read/unread status
- **Owner Email Detection**: Uses GitHub email from spark.user() API for notification recipient

## Design Direction

The design should feel like a fusion of anime-inspired vibrancy and aquatic freshness - energetic, youthful, and confident. Think bold accent colors reminiscent of anime aesthetics combined with cool water-inspired blues and gradients that suggest movement and fluidity.

## Color Selection

A dynamic palette that merges anime culture's vibrant energy with swimming's aquatic coolness, with carefully calibrated dark mode variants.

**Light Mode:**
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

**Dark Mode:**
- **Primary Color**: Brighter Ocean Blue `oklch(0.55 0.18 240)` - Enhanced for dark backgrounds
- **Secondary Colors**:
  - Vibrant Cyan `oklch(0.65 0.15 200)` - Adjusted for dark mode contrast
- **Accent Color**: Bright Magenta `oklch(0.7 0.25 330)` - Intensified for visibility on dark
- **Foreground/Background Pairings**:
  - Background (Deep Blue-Black `oklch(0.15 0.02 240)`): Light Blue-White Text `oklch(0.95 0.01 220)` - Ratio 12.8:1 ✓
  - Card (Dark Blue `oklch(0.2 0.02 240)`): Light Text `oklch(0.95 0.01 220)` - Ratio 11.2:1 ✓
  - Primary (Brighter Ocean Blue `oklch(0.55 0.18 240)`): White text `oklch(1 0 0)` - Ratio 6.2:1 ✓
  - Accent (Bright Magenta `oklch(0.7 0.25 330)`): Dark text `oklch(0.1 0.02 240)` - Ratio 8.9:1 ✓

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
  - X: For closing lightbox modal and removing items
  - Plus: For adding new items (photos, anime, achievements, etc.)
  - Trash: For deleting items (photos, content entries)
  - PencilSimple: For editing items
  - Upload: For upload action in dialog
  - Gear: For admin panel button
  - FloppyDisk: For save action
  - Clock: For time displays in achievements
  - Envelope: For messages/contact section and Messages tab icon
  - Bell: For notification indicators (unread messages)
  - Moon/Sun: For dark mode toggle button
  - Social icons: Discord, Instagram, Twitch, YouTube, Twitter (X), TikTok
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
