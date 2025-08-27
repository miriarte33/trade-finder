# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application called "trade-finder" using modern tooling and shadcn/ui components.

## Key Technologies

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with HMR (Hot Module Replacement)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Utilities**: class-variance-authority (cva) for component variants, clsx + tailwind-merge for className utilities

## Essential Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture & Structure

### Import Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)
- shadcn/ui uses specific aliases: `@/components`, `@/lib/utils`, `@/components/ui`

### Component System
- UI components located in `src/components/ui/` following shadcn/ui conventions
- Uses compound component pattern with `asChild` prop for polymorphic behavior
- Styled with cva (class-variance-authority) for consistent variant management
- All components use the `cn()` utility from `@/lib/utils` for className merging

### Styling Architecture
- Tailwind CSS v4 with the new Vite plugin (`@tailwindcss/vite`)
- CSS variables enabled for theming (`cssVariables: true` in components.json)
- Uses "neutral" as base color with support for light/dark modes
- Main styles in `src/index.css`

### TypeScript Configuration
- Project uses TypeScript project references (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- Strict type checking enabled
- ESLint configured with TypeScript, React hooks, and React refresh rules

## Development Notes

When adding new shadcn/ui components, they should be placed in `src/components/ui/` and follow the existing pattern using cva for variants and the `cn()` utility for className handling.

## Code Style Requirements

**ALWAYS use functions. NEVER use classes.** Types and interfaces are okay but ABSOLUTELY NO CLASSES. Use function declarations, arrow functions, and functional programming patterns instead of class-based approaches.