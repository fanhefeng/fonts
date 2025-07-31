# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Clean out directory and build for production export
- `npm start` - Start production server
- `npm run lint` - Run Next.js linting

## Project Architecture

This is a Next.js 15 font showcase application that displays and manages local font collections with interactive previews.

### Core Structure

- **Font System**: Centralized font loading through `styles/fonts.ts` using Next.js `localFont`
- **Font Storage**: Physical font files in `styles/fonts/` organized by font family directories
- **State Management**: Local state with localStorage persistence for font favorites
- **UI Framework**: Ant Design v5 with React 19 compatibility patches

### Key Files

- `styles/fonts.ts` - Font definitions and exports using Next.js localFont loader
- `src/app/page.tsx` - Main font showcase with search, filtering, and global style controls
- `src/components/ui/FontConfig.tsx` - Global font preview configuration panel
- `src/components/ui/MyFont.tsx` - Individual font display component
- `src/types/global.d.ts` - TypeScript type definitions

### Font Management

Font definitions in `styles/fonts.ts` export variable names that become display names in the UI. Each font uses:
- `localFont` from Next.js for loading
- CSS variables for styling (e.g., `--font-pragmata`)
- `display: "swap"` for optimized loading
- Multi-weight definitions for font families like Poppins and RobotoMono

### Configuration

- **Build**: Static export configured (`output: "export"`)
- **Optimization**: SWC minification and CSS optimization enabled
- **Font Loading**: Next.js font loader with URL support
- **Path Aliases**: `@/*` for src/, `@/fonts` for styles/fonts
- **Styling**: TailwindCSS v4 with PostCSS

### Data Flow

1. Fonts loaded from `styles/fonts.ts` and initialized with like status
2. Font preferences stored in localStorage
3. Search and filter applied in real-time
4. Global styling controls affect all font previews simultaneously