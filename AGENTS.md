# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router groups — `(frontend)` user site, `(studio)/admin` Sanity Studio, `api/*` routes.
- `src/ui`: Reusable React components; `src/lib`: utilities (e.g., `lib/env.ts`, `lib/validation.ts`).
- `src/sanity`: Sanity schemas (`schemaTypes/*`), studio structure, and client utilities.
- `public`: static assets; `scripts`: SEO/ops scripts (IndexNow, sitemap submit).
- `tests`: TypeScript tests compiled to `tests/dist`.

## Build, Test, and Development Commands
- `npm i`: install (Node `v22.22.2`, see `.nvmrc`).
- `npm run dev`: start Next.js locally at `http://localhost:3000`.
- `npm run build`: extract Studio manifest then build the app.
- `npm start`: run the production build.
- `npm run typecheck`: strict TypeScript check with no emit.
- `npm run lint` / `npm run format`: ESLint and Prettier over `src/` and `scripts/`.
- `npm test`: compile tests (`tsconfig.test.json`) and run `tests/dist/*.test.js`.

## Coding Style & Naming Conventions
- Prettier: tabs, no semicolons, single quotes, trailing commas (`.prettierrc`).
- ESLint: Next + Sanity config; some React hook rules disabled (`eslint.config.mjs`).
- TypeScript + React 19. Use PascalCase for components (`PostPreview.tsx`), camelCase for functions/vars.
- Files: colocate UI in `src/ui/*`, app routes in `src/app/**/page.tsx` or nested segments.

## Testing Guidelines
- Framework: Node `assert` with simple TS files in `tests/*.test.ts`.
- Name tests `*.test.ts`; import from `src/**/*` (example: `tests/validation.test.ts`).
- Run `npm test`; ensure all tests pass and add coverage where logic branches change.

## Commit & Pull Request Guidelines
- Commits: conventional style — `feat:`, `fix:`, `refactor:`, `chore:` (see `git log`).
- PRs: include summary, linked issues, screenshots for UI, and notes on perf/SEO if relevant.
- CI hygiene: run `typecheck`, `lint`, and `test` locally before opening PRs.

## Security & Configuration Tips
- Env: set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, optional `NEXT_PUBLIC_BASE_URL` in `.env.local`; never commit secrets.
- Review `scripts/` usage; do not commit private keys (e.g., Google service accounts).
- Image domains and redirects configured in `next.config.ts`; update thoughtfully.
