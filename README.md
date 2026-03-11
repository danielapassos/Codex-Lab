# Codex Lab Network

Directory-first network site for Codex Lab, built with Next.js App Router.

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NEXT_PUBLIC_JOIN_FORM_URL` in `.env.local` when the real interest form is ready.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
pnpm build
```

## Data

The placeholder member dataset lives in [`lib/members.ts`](./lib/members.ts).

Each member record includes:

- `id`
- `name`
- `focus`
- `website`
- `avatar`
- `disciplines`
- `domains`
- `links`
- `connections`
