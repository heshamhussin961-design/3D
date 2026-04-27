# Innova Stars - Project Documentation

Welcome to the **Innova Stars** project documentation. This document provides a comprehensive overview of the website's architecture, technologies, and features.

---

## 🚀 Project Overview
**Innova Stars** is a premium, high-performance web platform designed for a modern marketing agency based in Abu Dhabi, UAE. The website focuses on a "Space-Tech" aesthetic, utilizing advanced web technologies to deliver an immersive user experience through smooth animations, scroll-triggered sequences, and interactive elements.

---

## 🛠 Technology Stack
The project is built using a modern and optimized stack:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**:
  - [GSAP](https://gsap.com/) (GreenSock Animation Platform) & `@gsap/react`
  - [Framer Motion](https://www.framer.com/motion/)
  - [Lenis](https://lenis.darkroom.engineering/) (Smooth Scrolling)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Orbitron for headers, Inter for body)

---

## 📂 Project Structure

```text
innova-stars/
├── public/              # Static assets (images, videos, webp frames)
├── src/
│   ├── app/             # Next.js App Router (Pages, Layouts, APIs)
│   │   ├── about/       # About page
│   │   ├── services/    # Services page
│   │   ├── work/        # Portfolio/Work page
│   │   ├── ai-demo/     # Interactive AI demonstration
│   │   └── layout.tsx   # Global layout with providers (Lenis, Navigation)
│   ├── components/
│   │   ├── providers/   # Context providers (Lenis, SEO/Structured Data)
│   │   ├── sections/    # Main sections of the landing page (Hero, AICore, etc.)
│   │   └── ui/          # Reusable UI components (Buttons, Modals, Effects)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and constants
│   └── types/           # TypeScript type definitions
└── tailwind.config.ts   # Design system configuration (colors, fonts, animations)
```

---

## ✨ Key Features & Components

### 1. **Scroll-Driven Animation (SDA)**
The website uses `Lenis` for smooth scrolling and `GSAP ScrollTrigger` to sync animations with the user's scroll position.
- **Rocket Launch**: A cinematic sequence that plays as you scroll.
- **Video Scrubbing**: High-performance frame-by-frame video playback controlled by the scroll bar (found in `src/components/ui/ScrollVideo.tsx` and `FrameSequence.tsx`).

### 2. **Space Aesthetics**
- **Starfield & Particle Effects**: Dynamic backgrounds using canvas and CSS to create a deep-space atmosphere (`src/components/ui/Starfield.tsx`).
- **Constellation Map**: Interactive background elements that react to movement.

### 3. **Interactive UI Elements**
- **Magnetic Buttons**: Buttons that follow the cursor for a premium "Apple-like" feel.
- **AI Prompt Box**: A sophisticated UI component for demonstrating AI capabilities.
- **Contact Modal**: A polished, accessible form for lead generation.

### 4. **SEO & Performance**
- **Dynamic Meta Tags**: Automated OpenGraph and Twitter card generation.
- **Preloading**: Critical assets (like the first frames of sequences) are preloaded in the root layout to prevent flickering.
- **Lazy Loading**: Images and videos are lazily loaded to ensure fast initial page speeds.

---

## 🏗 Main Sections (Landing Page)

1. **Hero**: The entry point featuring "Magnetic Wordmarks" and a bold value proposition.
2. **Rocket Launch**: An immersive transition section using scroll-scrubbed video frames.
3. **Problem**: Highlights the challenges businesses face and how Innova Stars solves them.
4. **Services**: Interactive cards showcasing agency offerings (AI Marketing, Brand Strategy, etc.).
5. **AICore**: A deep dive into the technology powering the agency.
6. **Stats**: Data-driven proof of success with animated counters.
7. **CTA**: A final call to action to convert visitors into clients.

---

## 🏃‍♂️ How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security & Optimization
- **TypeScript**: Ensures type safety and reduces runtime bugs.
- **ESLint/Prettier**: Maintains code quality and consistent formatting.
- **Type Checking**: Run `npm run typecheck` before deployments.

---
*Documentation generated for Innova Stars.*
