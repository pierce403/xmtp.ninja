# AGENTS

This repo is a static, client-only React + TypeScript app for GitHub Pages.
Keep changes aligned with the single-page, no-backend model.

## Guardrails

- Do not add secrets, API keys, or private endpoints.
- Keep the build static and compatible with GitHub Pages (Vite base is `./`).
- Prefer ASCII in source files unless there is a clear, intentional reason.
- Preserve the bold, intentional visual style; avoid default UI patterns.

## Product focus

- Primary tool: Inbox Unifier (route all identities to one inbox).
- Future tools should live on the same page and share the same design system.
- Prefer progressive enhancement: mock data first, then wire to real XMTP APIs.
