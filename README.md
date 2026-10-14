# XMTP Ninja

XMTP Ninja is a static, single-page toolkit for managing multiple XMTP identities.
The first tool is the Inbox Unifier, which connects a primary identity and routes
all other identities into that single inbox.

This repo ships a lightweight React + TypeScript UI prototype that is ready for
GitHub Pages. It does not yet connect to the XMTP network; it models the flow
and interaction design so the product can be implemented incrementally.

## Stack

- React 18 + TypeScript
- Vite (static build for GitHub Pages)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The app uses `base: "./"` in `vite.config.ts` so it can be deployed from a
GitHub Pages subdirectory without additional configuration.

## Project layout

- `index.html`: HTML shell + fonts
- `src/App.tsx`: Inbox Unifier UI + local state
- `src/styles.css`: Visual system and layout

## Roadmap

See `TODO.md` for the next milestones.

## Cloudflare hosting

Native Git publishes `main` with `npm run build:cloudflare` and `npm run deploy`.
The original generator and GitHub Pages build remain available for recovery.
Cloudflare-only postprocessing adds a no-store revision marker and terminal404;
previews are disabled and deployment credentials stay in Cloudflare.
Application source, local data formats and existing public URLs are preserved.
