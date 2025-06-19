# Build & Lint Commands

- Dev server: `pnpm dev`
- Build: `pnpm build` (runs tsc first)
- Format: `pnpm format` (prettier) - ALWAYS use this instead of lint
- Format check: `pnpm format:check`
- Preview build: `pnpm preview`

# Code Style

- TypeScript with strict mode enabled
- React 19 with functional components
- Indentation: 2 spaces
- Component naming: PascalCase (Sidebar, RichTextEditor)
- Hooks: camelCase with 'use' prefix (useAuth)
- Boolean props: 'is' prefix (isActive)
- Imports: React first, libraries, then local files
- Styling: @griffel/react for component styles
- UI components: @radix-ui/themes
- State management: React hooks + TanStack DB
- Routing: TanStack Router
- Editor: Tiptap
- Text case: sentence case for UI buttons/labels (e.g., "New thread" not "New Thread")
- Dark mode: Use var(--purple-3) for links and buttons in dark mode
- Cursor: All interactive elements MUST use cursor: pointer
  - For UI components: Add cursor: pointer directly in component styles
  - For custom clickable elements: Add className="clickable"

# Architecture

- Vite build system
- Component-based organization in src/components/
- Routes defined in src/routes/
- DB schemas in src/db/schemas.ts
