# ReplyBro

AI-powered texting assistant that generates smart, funny, flirty or savage replies with mood analysis, rizz scoring, relationship tracking, and chat history.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/replybro run dev` — run the frontend (Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion
- API: Express 5 + Anthropic claude-sonnet-4-6
- DB: PostgreSQL + Drizzle ORM (reply history)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)
- `lib/db/src/schema.ts` — Drizzle DB schema (replyHistoryTable)
- `artifacts/api-server/src/routes/replybro.ts` — all ReplyBro endpoints
- `artifacts/replybro/src/` — frontend app
  - `App.tsx` — root with view-state navigation (landing / dashboard / history / tracker)
  - `pages/landing.tsx` — Hero + Features + CTA
  - `pages/dashboard.tsx` — Generate Reply tab + Rizz Score tab + sidebar
  - `pages/history-view.tsx` — DB-backed reply history
  - `pages/tracker.tsx` — Relationship tracker (local state)

## Architecture decisions

- View-state navigation (not URL routing) — matches reference design, simpler for a single-page tool
- Backend handles all AI calls (Anthropic) — never calls API from browser
- DB stores one reply per generate call (first variant); all 3 variants returned to client only
- Rizz score and tracker advice use direct fetch (not generated hooks) for simplicity
- CSS design system uses custom class names alongside Tailwind — reference CSS classes live in index.css

## Product

- **Generate Reply**: Paste a conversation, pick a mode (Romantic/Funny/Savage/Emotional) + language, get 3 AI reply variants, mood analysis arc-meter, interest level, signal chips, voice playback
- **Rizz Score**: Score an opening line 0–100 with grade, verdict, pros/cons, and an upgraded version
- **History**: Full DB-backed reply history with copy and delete
- **Relationship Tracker**: Track interest levels over time with sparkline chart and AI coaching per person

## User preferences

- Emojis are allowed and encouraged (reference design uses them)
- Dark theme only (bg0 = #080B14)
- Syne font for headings, DM Sans for body

## Gotchas

- After updating `openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen`
- The API server must be restarted after backend code changes (it compiles to dist/)
- `--rb-border` is the custom border variable (not `--border` which is the Tailwind HSL token)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
