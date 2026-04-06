# Frontend UI & UX SOP

## 1. Goal
Provide a premium, shocking, cinematic Tarot reading experience using Vite, Vanilla TS, and GSAP.

## 2. Animation Philosophy (GSAP)
- **Glassmorphism**: Use translucent layered panels with backdrop-filters.
- **Cinematic Timing**: Easing should be "power4.out" or "expo.out". Animations should feel heavy, snappy, and satisfying.
- **Micro-interactions**: Hover effects on cards should tilt and glow slightly using 3D transforms.

## 3. UI Flow
### Screen 1: The Void
- Black/dark mist particle background.
- Central elegant text input: "What is your question?"
- Toggle: Beginner Help (ON/OFF).
- Submit button with gradient glow.

### Screen 2: The Shuffle
- Transition to deck view. A 78-card fan animation spreading in an arc.
- Instruction: "Select 3 cards representing your Situation, Action, and Outcome."

### Screen 3: The Spread
- Selected cards levitate and flip over with a majestic 3D rotation, revealing the images.

### Screen 4: The Revelation
- Cards align side-by-side. Mock reading text gradually fades in (with typewriter effect for AI feel).
- Action buttons to Reset.

## 4. Invariants
- Only pure CSS and GSAP for animations (no heavy React-Spring or other libs).
- The DOM must have unique, descriptive IDs for GSAP targeting.
