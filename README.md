# 💡 Interactive Avatar Challenge (Maria)

An accessible, multilingual, emotion-aware AI avatar built with Next.js, Groq API, and Framer Motion. Features hybrid accessibility, glassmorphism UI, and smooth UX transitions for the challenge.

## 🎯 Project Overview

This project was created as part of the **FrontendChallenge**, featuring Maria - an interactive avatar with voice and text interaction capabilities. The avatar responds to user input, changes emotions based on conversation context, and supports multiple languages with advanced accessibility features.

### ✅ Challenge Expectations Met

**Accessibility (WCAG 2.1 AA Compliant)**
- ✅ Full ARIA attributes (`role`, `aria-label`, `aria-live`, `aria-atomic`)
- ✅ Screen reader support with live region announcements
- ✅ High contrast mode with yellow/black theme
- ✅ Adjustable font sizes (regular and large)
- ✅ Keyboard navigation support
- ✅ Focus management with visible indicators

**Micro-interactions**
- ✅ Framer Motion animations for smooth transitions
- ✅ Scale effects on button hover/tap (1.1x on hover, 0.95x on tap)
- ✅ Animated volume slider with real-time updates
- ✅ Smooth chat message animations with AnimatePresence
- ✅ Rotating circular ring effect around avatar
- ✅ Glassmorphism UI with backdrop filters

**Code Quality**
- ✅ TypeScript with strict typing throughout
- ✅ Modular component architecture (InteractiveAvatar, AvatarControls, AvatarImage)
- ✅ React Hooks (useState, useEffect, useCallback, useRef)
- ✅ Clean separation of concerns (voice.ts, config.ts)
- ✅ Optimized CSS architecture (inline for dynamic, classes for static)
- ✅ No dead code or console.logs in production
- ✅ Proper error handling and fallbacks
- ✅ iOS compatibility with user-agent detection

## 🌟 Features

### Core Functionality
- **Interactive Avatar**: Maria - A responsive avatar with dynamic emotions (happy, sad, surprised, closed eyes)
- **Voice Interaction**: Real-time speech-to-text recognition with text-to-speech responses
- **Text Chat**: Integrated chat interface powered by Groq API
- **Multi-language Support**: Portuguese, English, and French
- **Emotion Detection**: AI-powered emotion detection based on conversation context
- **Dynamic Language Selection**: Switch between languages with visual flag indicators

### User Interface
- **Glassmorphism Design**: Modern translucent UI with blur effects
- **Orbital Buttons**: Circular button layout around avatar for intuitive controls
- **Volume Control**: Expandable vertical volume slider with visual feedback
- **Emotion Controls**: Quick emotion selection with emoji buttons
- **Language Menu**: Horizontal flag selection menu
- **Conversation History**: Scrollable chat history with smooth animations

### Accessibility Features (WCAG 2.1 AA Compliant)
- **High Contrast Mode**: Enhanced visual clarity for users with low vision
- **Screen Reader Support**: Full ARIA attributes and live region announcements
- **Adjustable Font Sizes**: Dynamic font scaling for readability
- **Hybrid Accessibility Approach**: 
  - Traditional ARIA live regions for screen readers
  - Browser speech synthesis for audio feedback
  - Visual indicators for accessibility state
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Logical tab order and visible focus indicators

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16** - Server-side rendering and React framework
- **TypeScript** - Type-safe development
- **React 19** - Component-based UI library

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **Glassmorphism** - Translucent design with backdrop filters
- **Framer Motion** - Advanced animations and transitions
- **Lucide React** - Beautiful icon library for UI elements
- **Custom CSS Animations** - Keyframe animations for smooth effects

### 3D & Avatar
**Note**: I attempted to implement 3D rendering with Three.js, but due to time constraints and the complexity of integrating large 3D models (GLB files exceeded 100MB), I opted for a **2D static image approach** with dynamic PNG switching based on emotions.

**What I Tried**:
- Three.js for 3D rendering
- GLTFLoader for 3D model loading
- Multiple GLB files for different emotions (happy, sad, surprised, closed eyes)

**Current Implementation**:
- Static PNG images with emotion switching
- AvatarImage.tsx component for avatar rendering
- Animated circular ring effect around avatar
- Smooth transitions between emotional states

### Voice & Speech
- **Web Speech API** - Speech-to-text recognition
- **Speech Synthesis API** - Text-to-speech functionality
- **Dynamic Voice Selection** - Automatically selects female voices with fallbacks
- **iOS Compatibility**: Voice features (microphone, volume control, stop button) are automatically hidden on iOS devices due to browser limitations with the Web Speech API

### AI & Backend
- **Groq API** - Fast AI-powered responses
- **OpenAI SDK** - Groq API integration
- **Emotion Detection** - Custom algorithm analyzing response sentiment
- **Next.js API Routes** - Server-side API endpoints

### State Management
- **React Hooks** (useState, useEffect, useRef, useMemo)
- **LocalStorage** - Persist user preferences
- **Context API** - Global state management

## 🏗️ Architecture & Strategy

### Accessibility Strategy (Hybrid Approach)

I implemented a **hybrid accessibility strategy** that combines multiple methods to ensure maximum compatibility with assistive technologies:

1. **ARIA Live Regions**: Traditional screen reader support with `role="status"`, `aria-live`, and `aria-atomic`
2. **Speech Synthesis**: Browser TTS for users who prefer audio feedback
3. **Visual Indicators**: Clear visual state indicators for accessibility features
4. **Focus Management**: Programmatic focus control for sequential announcements
5. **Sequential Reading**: Prevents overlapping announcements by queuing messages

### Emotion Detection Algorithm

Custom emotion detection using weighted word analysis:
- **Emotion Categories**: Happy, Sad, Surprised, Sleepy
- **Language-specific Keywords**: Separate dictionaries for PT, EN, FR
- **Sentiment Analysis**: Word weight scoring for accurate emotion detection
- **Context-aware**: Considers conversation flow and user intent

### Glassmorphism Implementation

Modern design aesthetic with:
- **Semi-transparent backgrounds**: `rgba(255, 255, 255, 0.15)`
- **Backdrop blur**: `backdrop-filter: blur(10px)`
- **Subtle borders**: `1px solid rgba(255, 255, 255, 0.3)`
- **Soft shadows**: `0 8px 32px 0 rgba(31, 38, 135, 0.37)`
- **Border radius**: Consistent rounded corners (24px for buttons, 12px for containers)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Groq API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/marifpereira/interactiveAvatarChallenge.git
cd interactiveAvatarChallenge
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file:
```env
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎮 Usage Guide

### Voice Mode
1. Click the microphone button below the avatar
2. Speak your message (browser will request microphone permission)
3. Maria responds with voice and emotional expression
4. Click microphone again to stop

**Note**: Voice mode is not available on iOS devices due to browser limitations. The microphone, volume, and stop buttons are automatically hidden on iOS.

### Text Mode
1. Click the text button (speech bubble icon)
2. Type your message in the input field
3. Press Enter or click "Enviar"
4. View conversation history with smooth animations
5. Click "Nova Conversa" to reset

### Language Selection
1. Click the options button (horizontal dots icon)
2. Select a flag: 🇧🇷 (Portuguese), 🇺🇸 (English), 🇫🇷 (French)
3. All UI text and AI responses change to selected language

### Accessibility Controls
1. Click the accessibility button (person icon) in bottom-left corner
2. **Alto Contraste**: High contrast mode for low vision
3. **Leitor de Ecrã**: Screen reader announcements (visual + audio)
4. **Fonte Maior**: Increase font size for readability

### Other Controls
- **Volume**: Adjust audio playback volume
- **Stop**: Cancel current audio playback
- **Emoções**: Manually set avatar emotion with emoji buttons

## 🚀 Deployment

This project is deployed on **Vercel** for optimal Next.js performance and seamless developer experience.

### Why Vercel?

**1. Native Next.js Integration**
- Vercel is the official hosting platform created by Next.js creators
- Zero-configuration deployment with automatic optimization
- Built-in support for Next.js API routes and Edge Functions

**2. Superior Performance**
- Edge network for global CDN distribution
- Automatic static optimization for faster loads
- Image optimization out of the box
- Perfect Lighthouse scores

**3. Developer Experience**
- Automatic HTTPS and SSL certificates
- Instant preview deployments for every commit
- Built-in CI/CD with GitHub integration
- Real-time deployment logs and error tracking

**4. Serverless Architecture**
- API routes run as serverless functions
- Pay-per-use pricing model
- Automatic scaling based on traffic
- No server management required

**Live Demo**: [https://interactiveavatarchallenge.vercel.app/](https://interactiveavatarchallenge.vercel.app/)

### Deployment Configuration

The project includes a `vercel.json` configuration file for optimal deployment settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Environment Variables

Required environment variables configured on Vercel:
- `GROQ_API_KEY`: Groq API authentication (server-side only)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles and animations
│   └── api/
│       └── chat/
│           └── route.ts      # Groq API endpoint
├── components/
│   ├── InteractiveAvatar.tsx  # Main orchestration component
│   ├── AvatarControls.tsx    # Avatar container with orbital buttons
│   └── AvatarImage.tsx        # Avatar image rendering with emotions
└── lib/
    ├── config.ts              # Configuration utilities
    ├── groq.ts                # Groq API client
    └── voice.ts               # Voice interaction utilities
```

## 🎨 Design Principles

### Glassmorphism-Inspired Visual Style ✨

**Styling/Animation: Glassmorphism-inspired visual style**

Our entire interface leverages a **Glassmorphism-inspired visual style**, creating a modern, translucent aesthetic that enhances depth and visual hierarchy.

#### Core Glassmorphism Features

**1. Translucent Elements with Blur**
- All major UI components use `background: rgba(255, 255, 255, 0.15)` for semi-transparency
- `backdropFilter: blur(10px)` creates the signature "frosted glass" effect
- Allows vibrant gradient background to show through while maintaining readability

**2. Subtle Borders & Shadows**
- Thin borders (`1px solid rgba(255, 255, 255, 0.3)`) define element edges
- Soft box shadows (`0 8px 32px 0 rgba(31, 38, 135, 0.37)`) create depth
- Multiple layers: glass box → avatar pop-out → chat bubbles

**3. Application Across Interface**

```css
/* Glassmorphism Effects Used In: */
- Main introduction card (translucent container for title & intro)
- Avatar orbital buttons (volume, language, emotions, etc.)
- Chat message bubbles (translucent background with blur)
- Text input field (translucent with placeholder text)
- Footer bar (semi-transparent with text overlay)
- Accessibility menu (expandable glass container)
```

**4. Visual Hierarchy**
```
Layer 1: Background gradient (furthest back)
  ↓
Layer 2: Glassmorphism introduction card
  ↓
Layer 3: Avatar pop-out effect (half overlapping card)
  ↓
Layer 4: Orbital buttons (hover states with scale)
  ↓
Layer 5: Chat bubbles (floating above)
```

#### Glassmorphism Color Palette
- **Background**: Animated gradient `rgb(234 150 215)` → `rgb(255 150 200)` → `rgb(130 167 255)`
- **Glass Elements**: `rgba(255, 255, 255, 0.15)` with `blur(10px)`
- **Active States**: Light blue (#BFDBFE) for interactions
- **High Contrast**: Yellow (#ffff00) with black borders when activated

### Animation Strategy

#### Framer Motion Animations

**1. Button Interactions**
```typescript
whileHover={{ scale: 1.1 }} 
whileTap={{ scale: 0.95 }}
transition={{ duration: 0.3, ease: 'easeInOut' }}
```

**2. Chat Message Animations**
```typescript
initial={{ opacity: 0, y: 20, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -10, scale: 0.95 }}
transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
```
- Messages fade in from below with slight scale effect
- Exit animations slide up and fade out
- Smooth easing creates natural, organic motion

**3. Avatar Magic Ring Rotation**
```typescript
<motion.svg
  initial={{ rotate: 0 }}
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
>
```
- Continuous 10-second rotation around avatar
- Dashed circle with subtle animation
- Creates sense of energy and activity

**4. Menu Expansions**
- Language menu expands from 44px to 240px width
- Volume slider expands vertically from 44px to 180px
- Emotion selector expands to 140px
- Smooth `ease: 'easeInOut'` with 0.35s duration

**5. Animated Gradient Background**
```css
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```
- **Duration**: 15 seconds (slow, subtle movement)
- **Effect**: Three-color gradient smoothly shifts horizontally
- **Loop**: Infinite, seamless transition
- **Palette**: Pink → Magenta → Blue

#### Custom CSS Animations

**1. Scrollbar Styling**
```css
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
```

**2. Large Font Transitions**
```css
h1.large-font-title {
  transition: font-size 0.3s ease-in-out;
}
```
- Smooth font size changes when accessibility mode activated
- Prevents jarring layout shifts

### Animation Timing & Performance

- **Micro-interactions**: 0.2-0.3s (snappy, immediate feedback)
- **Transitions**: 0.3-0.4s (smooth, noticeable)
- **Complex animations**: 0.45s (chat messages, menu expansions)
- **Continuous animations**: 10s (avatar ring), 15s (background gradient)
- **Easing**: `ease-in-out` for natural deceleration
- **Hardware acceleration**: Using `transform` and `opacity` for GPU acceleration

### CSS Architecture
This project uses a **hybrid styling approach** that balances maintainability with performance:

- **`globals.css`**: Global styles, animations, and utility classes
  - Background gradients, scrollbar styling, accessibility fonts
  - Tailwind CSS integration with custom theme variables
  - Keyframe animations for dynamic effects

- **Inline Styles**: Used for dynamic, state-dependent styling
  - Why inline? Values depend on JavaScript state (`highContrast`, `isProcessingVoice`, etc.)
  - Enables real-time style updates without CSS class toggling
  - Better performance for frequently changing styles
  - Direct integration with Framer Motion's `whileHover`, `animate`, `initial` props

- **Best Practices Applied**:
  ✅ Inline styles for dynamic values (`highContrast ? '#ffff00' : '#fff'`)
  ✅ CSS classes for static, reusable styles (`.glassmorphism`, `.animate-float`)
  ✅ Framer Motion for animations requiring JavaScript coordination
  ✅ Tailwind for utility classes where appropriate
  ✅ No CSS-in-JS libraries (unnecessary overhead for this project)

This is a **best practice** in modern React/Next.js for projects with highly dynamic UIs. Separating CSS to external files would:
- ❌ Increase bundle size (extra HTTP requests)
- ❌ Break style-co-location with component logic
- ❌ Require CSS class toggling for every state change
- ❌ Complicate Framer Motion integration

## 🎨 Design & UX Philosophy

This project follows a **"human-first"** approach – prioritizing empathy, inclusivity, and clarity in every design decision. Every animation, interaction, and accessibility feature was designed to:

- **Reduce cognitive load**: Clear visual hierarchy, predictable interactions
- **Encourage exploration**: Multiple input modalities (voice, text, gestures)
- **Provide multimodal feedback**: Visual animations, auditory responses, and tactile button states
- **Align with WCAG 2.1 AA**: Built-in accessibility from the ground up, not as an afterthought

### Why the Avatar Speaks, Expresses Emotions, and Reacts Smoothly

The interactive avatar communicates through three channels:
1. **Visual Expression**: Facial emotions change based on conversation context, creating emotional connection
2. **Voice Interaction**: Natural speech synthesis provides human-like conversational flow
3. **Smooth Transitions**: Framer Motion animations (0.3-0.4s) create perceived responsiveness and reduce interface friction

This multimodal approach ensures users with different abilities and preferences can engage meaningfully with the interface.

## 🎯 Key Challenges & Solutions

### Challenge 1: 3D Model Integration (Not Completed)
**Problem**: Attempted to implement 3D rendering with Three.js and GLB models, but encountered:
- GLB files ranged from 100-123MB (exceeded GitHub's 100MB limit)
- Complex integration required with @react-three/fiber
- Time constraints during development
- Performance concerns with large 3D models on web

**Solution**: 
- Switched to 2D static PNG images with dynamic emotion switching
- Created AvatarImage.tsx component for avatar rendering
- Implemented animated circular ring effects for visual interest
- Maintained emotion switching functionality with PNG assets

### Challenge 2: Emotion Detection Accuracy
**Problem**: Generic words triggering wrong emotions  
**Solution**: Refined keyword lists, removed ambiguous words, added context

### Challenge 3: Screen Reader Compatibility
**Problem**: Different screen readers interpret announcements differently  
**Solution**: Hybrid approach combining ARIA + speech synthesis + sequential queuing

### Challenge 4: Glassmorphism Browser Support
**Problem**: backdrop-filter not supported in all browsers  
**Solution**: Fallback solid colors for unsupported browsers

### Challenge 5: Voice Selection
**Problem**: Not all languages have female voices  
**Solution**: Cascading fallback system (preferred → female → default)

### Challenge 6: State Management Complexity
**Problem**: Multiple interdependent states across components  
**Solution**: Centralized state in InteractiveAvatar, prop drilling with optional chaining

### Challenge 7: iOS Web Speech API Limitations
**Problem**: Web Speech API (speech recognition) is not supported on iOS Safari and Chrome for iOS browsers. This is a known limitation where iOS devices cannot access the microphone for speech-to-text conversion through web browsers.

**Solution**: 
- Implemented automatic device detection using `User-Agent` parsing
- Conditionally hide voice-related controls (microphone, volume, stop buttons) on iOS devices
- Provide clear text-based interaction as fallback
- User receives visual feedback that voice features are unavailable on their device

**Technical Implementation**:
```typescript
const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
const hasVoiceSupport = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && !isIOS;
```

## 💬 Conversational Flow Architecture

The system maintains contextual awareness using a stateful message history:

1. **User Input** → Captured via microphone or keyboard
2. **Groq API Processing** → Analyzes message tone and intent
3. **Emotion Calculation** → Detects sentiment and triggers avatar expression
4. **Visual + Audio Feedback** → Avatar emotion changes + voice tone adaptation
5. **Accessibility Mirror** → Screen reader announces conversation state

**Emotion Detection Logic**:
```
if (response.includes("happy keywords")) → Emotion: Happy
if (response.includes("sad keywords")) → Emotion: Sad  
if (response.includes("surprised keywords")) → Emotion: Surprised
else → Emotion: Neutral (Happy)
```

## 🧪 Testing & Quality Assurance

All testing was performed **manually** across multiple browsers and devices:

### Manual Testing Performed
- **Cross-browser Testing**: Chrome
- **Mobile Testing**: Responsive behavior on iPhone and Android devices
- **Accessibility Testing**: 
  - Keyboard navigation (Tab, Shift+Tab, Enter, Space)
  - Screen reader compatibility (NVDA on Windows, VoiceOver on Mac)
  - High contrast mode verification
  - Font scaling verification
- **Performance Testing**: Manual verification of smooth animations and responsive UI
- **Voice Testing**: Speech-to-text and text-to-speech across languages

### Glassmorphism & Visual Testing
- Verified backdrop-filter compatibility across browsers
- Checked color contrast ratios for WCAG AA compliance
- Tested animation performance (smooth 60fps transitions)

**Note**: Due to time constrictions, all functional testing was performed manually to ensure real-world user experience quality.

## ♿ Hybrid Accessibility Explained

Unlike traditional screen readers that depend solely on ARIA regions, this project integrates **three complementary methods**:

1. **Native ARIA Live Regions**: Standard screen reader compatibility (`aria-live`, `role="status"`)
2. **Browser Speech Synthesis**: Immediate audio feedback via `SpeechSynthesis` API
3. **User-Controlled Toggle**: Prevents conflicts with native assistive software

This hybrid approach ensures accessibility for users **with or without** dedicated screen readers, providing maximum compatibility across different assistive technologies.

### Speech Behavior Matrix

| Mode | Input | Output | Audio | Emotion | Accessibility |
|------|-------|--------|-------|---------|---------------|
| Voice | Microphone | Speech synthesis | ✅ Yes | Dynamic | Optional |
| Text | Keyboard | Text on screen | ✅ Yes | Dynamic | ✅ Full ARIA |

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript validation

### Browser Support
✔ Fully tested on latest Chrome

### Performance Optimizations
- **Lazy Loading**: Avatar images load on demand
- **Memoization**: React.useMemo for expensive computations
- **CSS Transforms**: Hardware-accelerated animations
- **Code Splitting**: Dynamic imports for heavy components

## 📱 Responsive Design

The interface adapts to:
- **Desktop** (1200px+): Full orbital layout with all features
- **Tablet** (768px - 1199px): Compact layout, maintained functionality
- **Mobile** (320px - 767px): Vertical stack, touch-optimized buttons

## 🔐 Environment Variables

```env
GROQ_API_KEY=your_api_key
```

### 🔒 Security Best Practices

To protect your API key from exposure:

1. **Never commit API keys to Git** - Always use `.env.local` (which is gitignored)
2. **Use server-side environment variables** - I use `GROQ_API_KEY` (NOT `NEXT_PUBLIC_GROQ_API_KEY`) so the key stays on the server and never reaches the browser
3. **Configure in Vercel** - For deployment, add `GROQ_API_KEY` in Vercel's Environment Variables (Settings → Environment Variables)
4. **Rotate keys if exposed** - If you accidentally commit a key to a public repository, immediately:
   - Delete the exposed key in your provider's console
   - Create a new key
   - Update all deployments with the new key

**Why NOT use `NEXT_PUBLIC_` prefix?**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and can be viewed by anyone
- This is a security risk for sensitive API keys
- I use `GROQ_API_KEY` which stays server-side only in API routes

## 🔧 How to Extend / Customize

Developers can easily extend this project:

### Adding New Emotions
Update `/src/app/api/chat/route.ts` in the `detectEmotion` function:
```typescript
// Add to happy keywords array
'feliz', 'contente', 'alegre'  // PT
'happy', 'glad', 'joyful'      // EN  
'heureux', 'content', 'joie'   // FR
```

### Extending Language Support
Add new language in `/src/components/InteractiveAvatar.tsx`:
```typescript
const translations = {
  pt: { placeholder: '...', send: '...' },
  en: { placeholder: '...', send: '...' },
  // Add new language here
}
```

### Integrating Different AI Provider
Replace `/src/lib/groq.ts` with your provider:
```typescript
// Keep the same interface, change API calls
export async function getChatResponse(message: string, language: string) {
  // Your API integration
}
```

### Replacing Avatar with 3D Model
To implement 3D rendering, you would need to:
1. Install Three.js dependencies: `npm install three @react-three/fiber @react-three/drei`
2. Replace the static image rendering in `/src/components/AvatarImage.tsx` with a Three.js Canvas
3. Import and load 3D models (GLB files optimized for web)

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Mariana Pereira**  
Developed for a Frontend Challenge

## 🙏 Acknowledgments

- **Groq** - For fast AI inference
- **Framer Motion** - For beautiful animations
- **Lucide React** - For beautiful, accessible icons
- **Three.js** - For 3D rendering engine
- **Tailwind CSS** - For rapid styling

## 🎓 Lessons Learned

1. **Accessibility is not optional** - Built accessibility from the ground up, not as an afterthought
2. **Progressive enhancement** - Hybrid approaches provide better compatibility
3. **Performance matters** - Large 3D files need careful handling
4. **User feedback** - Direct testing with assistive technologies is essential
5. **Type safety** - TypeScript caught many potential bugs early

## 🔮 Future Enhancements

- [ ] Avatar customization options
- [ ] Additional languages support
- [ ] Voice cloning for more natural speech
- [ ] Gesture recognition
- [ ] AR integration for mobile
- [ ] Export conversation history
- [ ] Multi-user collaboration

## 📞 Support

For issues or questions, please open an issue on GitHub.
