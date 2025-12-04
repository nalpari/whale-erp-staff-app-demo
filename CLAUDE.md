# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whale ERP Staff App Demo - A Korean-language mobile-first salary statement (급여명세서) viewer for employees. Built as a staff-facing module of a larger ERP system.

## Commands

```bash
pnpm dev      # Start development server at localhost:3000
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router (React 19)
- **Styling**: Tailwind CSS v4 with CSS variables, tw-animate-css
- **UI Components**: shadcn/ui (new-york style) with Lucide icons
- **Language**: TypeScript (strict mode)
- **Font**: Pretendard (Korean-optimized, loaded via CDN)

## Architecture

### Directory Structure
```
src/
├── app/           # Next.js App Router pages
│   ├── layout.tsx # Root layout (Korean lang, Pretendard font)
│   ├── page.tsx   # Main salary statement page
│   └── globals.css # Tailwind config, CSS variables, dark mode
├── components/    # React components (no /ui subdirectory yet)
└── lib/
    └── utils.ts   # cn() utility for className merging
```

### Component Pattern

Components are functional with TypeScript interfaces for props. Mobile-first design targeting 375px width with responsive desktop wrapper.

```tsx
// Example pattern from existing components
interface ComponentProps {
  prop: string;
}

export default function Component({ prop }: ComponentProps) {
  return <div>...</div>;
}
```

### Styling Conventions

- Uses `@/` path alias for imports (maps to `./src/`)
- Tailwind classes directly on elements (no CSS modules)
- Color values use hex codes inline (e.g., `text-[#1A1A1A]`, `bg-[#5B5DED]`)
- CSS variables defined in globals.css using oklch color space
- Dark mode via `.dark` class with `@custom-variant dark`

### shadcn/ui Setup

Configured in components.json:
- Style: new-york
- RSC: enabled
- CSS variables: enabled
- Path aliases: `@/components`, `@/lib/utils`, `@/components/ui`
