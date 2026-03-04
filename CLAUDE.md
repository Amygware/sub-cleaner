# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sub Cleaner is a bulk Reddit subreddit unsubscriber built with SvelteKit 2 + Svelte 5, deployed on Vercel. Users authenticate via Reddit OAuth2 (implicit token flow), then select and batch-unsubscribe from subreddits.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (Vercel adapter)
- `npm run check` — TypeScript type checking via svelte-check
- `npm run lint` — Prettier check (no ESLint configured)
- `npm run format` — Auto-format with Prettier

No test framework is configured.

## Architecture

### Auth Flow
1. Landing page (`/`) → user clicks login → redirected to Reddit OAuth (`response_type=token`)
2. `/callback` → extracts `access_token` from URL hash, stores in `localStorage` as `reddit_token`
3. `/unsubscribe` → reads token, fetches/displays subreddits, handles bulk unsubscription

### API Proxy
`/api/reddit/+server.ts` — Single POST endpoint that proxies requests to Reddit's OAuth API server-side to avoid CORS. Accepts `{ url, token, method, body }`.

### Core Logic (`$lib/utils.ts`)
- `fetchSubreddits(token)` — Paginates `/subreddits/mine/subscriber` (100/page) via proxy
- `batchUnsubscribe(token, names, onProgress)` — Processes in batches of 5 with 1s delay for rate limiting

### UI Components
- shadcn-svelte pattern: `bits-ui` headless primitives + `tailwind-variants` styling (in `$lib/components/ui/`)
- Custom components: `SubredditCard`, `LoadingOverlay`, `FlickeringGrid` (canvas animation), `SnakeGame`, `Safari` (browser mockup)
- Config: `components.json` (style: default, base color: stone)

### Key Routes
- `/` — Landing page with hero, features, CTA
- `/unsubscribe` — Main app (two-column select + unsubscribe UI)
- `/callback` — OAuth2 callback handler
- `/guide` — SEO content page

## Code Style

- **Formatting:** Tabs, single quotes, no trailing commas, 100 char width (`.prettierrc`)
- **Mixed Svelte versions:** Layout and newer components use Svelte 5 runes (`$props()`). The `/unsubscribe` page still uses Svelte 4 patterns (`export let`, `on:click`, `$:` reactive declarations)
- **Path aliases:** `$lib` maps to `src/lib`
- **Dark mode:** Class-based via `mode-watcher`, CSS custom properties for theming

## Environment Variables

- `VITE_REDDIT_CLIENT_ID` — Reddit OAuth app client ID
- `VITE_REDIRECT_URI` — OAuth callback URL (e.g., `http://localhost:5173/callback`)
