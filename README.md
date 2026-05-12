# Inventory Management Frontend

This repository contains the frontend workspace for the Inventory Management System. It is currently reset to a clean Next.js shell so developers can build the product from scratch on top of the shared design system in [DESIGN.md](DESIGN.md).

The app keeps only the structural pieces needed to start development:

- A minimal root layout in [src/app/layout.tsx](src/app/layout.tsx)
- An empty homepage entrypoint in [src/app/page.tsx](src/app/page.tsx)
- The shared Tailwind design token layer in [src/app/globals.css](src/app/globals.css)

## Folder Structure

```text
.
├── AGENTS.md
├── CLAUDE.md
├── DESIGN.md
├── README.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   ├── providers/
│   ├── schemas/
│   ├── stores/
│   └── types/
├── tsconfig.json
└── pnpm-lock.yaml
```

## What Each Folder Is For

### `src/app/`

Next.js App Router entrypoint. This is where route files, layouts, and shared route-level CSS live.

- `layout.tsx` wraps the entire application and provides the root HTML structure.
- `page.tsx` is the homepage route. It is intentionally empty for now.
- `globals.css` contains the Tailwind theme variables and base design tokens that should be reused across future screens.

### `src/components/`

Reserved for UI components.

- `components/ui/` is the place for reusable low-level primitives such as buttons, inputs, cards, and other design-system building blocks.
- `components/shared/` is where higher-level application components should go later, such as headers, panels, tables, and page sections.

### `src/lib/`

Reserved for shared utilities and infrastructure helpers.

Typical examples for this folder are formatting helpers, API clients, query-client setup, and general-purpose utility functions.

### `src/providers/`

Reserved for React provider components.

This is the right place for application-wide wrappers such as query providers, theme providers, and other client-side context boundaries.

### `src/schemas/`

Reserved for validation schemas.

Use this folder for Zod schemas and shared form validation rules as the app grows.

### `src/stores/`

Reserved for application state stores.

This folder is intended for client-side state management, such as Zustand stores for authentication, filters, or UI state.

### `src/types/`

Reserved for shared TypeScript types and API contracts.

Put backend response shapes, domain models, and reusable interfaces here.

### `public/`

Static files served directly by Next.js, such as images, icons, and other assets.

## Supporting Files

### `DESIGN.md`

The source design reference for the project. It defines the color system, typography, spacing, elevation, shapes, and component behavior that should guide all future UI work.

### `components.json`

Configuration used by shadcn-style component generation and local aliasing.

### `next.config.ts`

Next.js configuration file.

### `eslint.config.mjs`

ESLint configuration for the workspace.

### `postcss.config.mjs`

PostCSS configuration used by Tailwind.

### `tsconfig.json`

TypeScript compiler configuration and path aliases.

### `package.json`

Project metadata, scripts, and dependency definitions.

## Current State

The repository is intentionally kept minimal right now. There is no feature code, no auth flow, and no dashboard shell in place yet. That work is expected to be implemented by developers starting from the clean structure above.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Design Source Of Truth

When adding new screens or components, follow the visual direction in [DESIGN.md](DESIGN.md):

- Crisp light background with soft layering
- Deep navy primary actions
- Inter for UI text and JetBrains Mono for data-heavy values
- Rounded 12px containers and 8px inputs/buttons
- Subtle borders and soft shadows instead of heavy outlines

## Notes For Developers

- Keep structural code small until a feature needs it.
- Add new folders under `src/components`, `src/lib`, `src/providers`, `src/schemas`, `src/stores`, and `src/types` as the implementation grows.
- Treat [DESIGN.md](DESIGN.md) as the canonical UI reference before building any new screen.
