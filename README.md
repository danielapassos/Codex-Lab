# Codex Lab Member Pages

This repo is the starter project for the Codex Lab student exercise.

It already includes a working student directory and network graph built with
Next.js. The goal of the first session is for each student to turn the
directory into a routed profile system by building their own member page inside
the site.

The directory homepage should stay at `/`. Clicking a student's name in the
directory should open that student's page at `/members/[id]`, reusing the
existing hyphenated ids from [`lib/members.ts`](./lib/members.ts).

## What Students Will Build

Each student should:

1. Make their name clickable in the directory.
2. Create a dedicated member page at `/members/[id]`.
3. Extend the shared `Member` data model with profile information.
4. Add optional custom sections that reflect their personality, projects, or experiments.
5. Keep the experience polished on desktop and mobile.

The homepage should remain the main directory. The member page should feel like
an extension of the same site, not a separate microsite.

## Route Overview

- `/`: student directory homepage
- `/members/[id]`: routed member pages such as `/members/ryan-fernandes`

Use the existing `Member.id` value as the route key. Do not introduce a second
slug system for this lab.

The primary clickable target for this assignment is the student name in the
directory list. Graph-node navigation is optional and not part of the baseline
requirement.

## Shared Profile Fields

Every student page should include a shared set of profile fields so the
directory stays coherent:

- `headline`
- `major/year`
- `location`
- `builder type`
- `interests`
- `tools used`
- `projects/startup`
- `repo/demo links`

Students can add whatever else they want beyond those shared fields:

- experiments
- media
- notes
- favorite prompts
- build logs
- writing
- anything else they want to showcase

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- Vitest
- Playwright

## First-Time Setup (macOS)

These steps are for students starting from a mostly clean Mac. If you already
have `git`, `brew`, `gh`, `node`, and `pnpm`, you can skip to
[Local Development](#local-development).

### 1. Install Apple Command Line Tools

This gives you Git and other developer tools that many JavaScript packages
expect.

```bash
xcode-select --install
```

After that finishes, confirm Git is available:

```bash
git --version
```

### 2. Install Homebrew

Homebrew is the package manager we will use for the rest of the setup.

Official site: [brew.sh](https://brew.sh/)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When the installer finishes, follow the exact "Next steps" it prints in
Terminal so `brew` is added to your shell correctly. The command differs
between Apple Silicon and Intel Macs.

Then verify it worked:

```bash
brew --version
```

### 3. Install GitHub CLI

GitHub CLI makes it much easier to clone the repo, authenticate Git, and push
your branch.

Official site: [cli.github.com](https://cli.github.com/)

```bash
brew install gh
gh auth login
gh auth status
```

Recommended options during `gh auth login`:

- Choose `GitHub.com`
- Choose `HTTPS`
- Say `yes` when it asks whether Git should authenticate with your GitHub credentials

### 4. Install Node.js

Install the current LTS version of Node.js from the official download page:

- [Node.js download page](https://nodejs.org/en/download)

After installing it, confirm both Node and npm are available:

```bash
node --version
npm --version
```

If you prefer, you can also install Node with Homebrew. The official installer
is usually the least confusing option for students.

### 5. Install pnpm

This repo uses `pnpm` as its package manager.

Official docs: [pnpm installation](https://pnpm.io/installation)

Recommended setup:

```bash
npm install --global corepack@latest
corepack enable pnpm
pnpm --version
```

If you want a Homebrew-based fallback instead, pnpm's docs also support:

```bash
brew install pnpm
```

### 6. Clone the Repository

Use your regular macOS Terminal for the initial clone. That is the least
confusing path for first-time setup.

If you have GitHub CLI set up:

```bash
gh repo clone danielapassos/Codex-Lab
cd Codex-Lab
```

If you prefer plain Git:

```bash
git clone https://github.com/danielapassos/Codex-Lab.git
cd Codex-Lab
```

### 7. Install Dependencies

Run dependency installation from the same Terminal window after `cd Codex-Lab`.

```bash
pnpm install
```

You can also run `pnpm install` from Codex after opening the repo, because
Codex runs commands in the project workspace too. For a first-time setup, the
recommended flow is:

- clone in macOS Terminal
- `cd` into the repo in macOS Terminal
- run `pnpm install` in macOS Terminal
- then open the folder in Codex

### 8. Open the Repo in Codex

Once the repo is on your machine, open the `Codex-Lab` folder in the Codex app.

Recommended first steps inside Codex:

1. Confirm Codex opened the correct folder.
2. Create your feature branch before editing anything:

   ```bash
   git checkout -b codex/<your-name>-profile-page
   ```

3. Ask Codex to inspect the repo before editing. Example:

   ```text
   Inspect this repo and summarize the current architecture before making changes.
   ```

4. Ask Codex to implement your feature with clear constraints. Example:

   ```text
   Add routed member pages at /members/[id], make student names clickable from the directory, preserve the current visual style, and run lint and typecheck when you're done.
   ```

5. Review the diff and test results before you commit.

Short version:

- clone and install dependencies in macOS Terminal
- open the folder in Codex
- create a branch
- ask Codex to inspect the repo first
- ask Codex to make the change
- ask Codex to run verification commands
- review the diff before commit

## Recommended New-Clone Flow

If you are starting from scratch, use this exact sequence:

1. Clone the repo in macOS Terminal.
2. Run `cd Codex-Lab`.
3. Run `pnpm install`.
4. Open the `Codex-Lab` folder in the Codex app.
5. In Codex, create a branch named `codex/<your-name>-profile-page`.
6. Ask Codex to inspect the repo and explain the current structure before editing.
7. Ask Codex to make your feature change.
8. Ask Codex to run `pnpm lint`, `pnpm typecheck`, and any relevant tests.
9. Review the diff.
10. Commit and push your branch.

## Local Development

You can run local commands either in macOS Terminal or by asking Codex to run
them in the repo. Both act on the same project files.

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the current lab flow. The
`.env.example` file is there for future expansion.

## Deployment Accuracy

This project is set up to treat Git as the source of truth for production.

- Production deploys on Vercel must include Git metadata such as branch, repo, and commit SHA.
- `pnpm build` runs a prebuild check that fails a Vercel production deploy if it was uploaded without that metadata.
- The site shows a build provenance panel so anyone can verify which commit a deployment came from.
- Keep Vercel's "Automatically expose System Environment Variables" setting enabled, because the deployment check relies on those values.

Operational rule:

- Do not use `vercel --prod` from a local workspace for this project.
- Push the intended commit to GitHub and let the connected Vercel project build from `main`.
- If a local clone and Vercel ever disagree, compare the live deployment's build provenance to the Git commit history before assuming the clone is wrong.

## Workflow Guardrails

For anyone cloning or extending this repo, follow these rules:

- GitHub `main` is the source of truth for production.
- Use a feature branch whose name starts with `codex/`.
- Install dependencies before opening the repo in Codex, unless you intentionally want Codex to run that setup for you.
- Ask Codex to inspect the codebase before asking it to edit files.
- Run verification before pushing: `pnpm lint`, `pnpm typecheck`, and the relevant tests.
- Review the diff before committing.
- Treat screenshots, `.next/`, and other generated artifacts as outputs, not source code.
- Never use `vercel --prod` from a local machine for this project.
- Use Vercel previews for branch work and merge to `main` for production.

## Project Map

- [`app/page.tsx`](./app/page.tsx): directory homepage entry point
- [`app/members/[id]/page.tsx`](./app/members/[id]/page.tsx): routed member pages
- [`components/directory-home.tsx`](./components/directory-home.tsx): homepage composition and graph state
- [`components/member-table.tsx`](./components/member-table.tsx): mobile and desktop directory UI with member links
- [`components/member-profile-page.tsx`](./components/member-profile-page.tsx): shared shell for each student's page
- [`components/network-graph.tsx`](./components/network-graph.tsx): interactive student network graph
- [`lib/members.ts`](./lib/members.ts): member data, profile fields, and route ids
- [`components/member-table.test.tsx`](./components/member-table.test.tsx): unit tests for the directory table
- [`tests/e2e/home.spec.ts`](./tests/e2e/home.spec.ts): Playwright coverage for the directory and member pages

## Assignment

### Required Outcome

Build a routed member page that opens when a student name is clicked from the
directory and displays richer information for that person.

Each student's page should stay within the shared visual system of the site,
but the content should feel personal.

### Shared Profile Fields

At minimum, each student page should include:

- `headline`
- `major/year`
- `location`
- `builder type`
- `interests`
- `tools used`
- `projects/startup`
- `repo/demo links`

Students may also add extra sections for experiments, notes, media, writing, or
anything else they want to publish.

If you add fields, update the `Member` type in [`lib/members.ts`](./lib/members.ts) so
the data model stays explicit.

### Acceptance Criteria

- Clicking a student name navigates to that student's page at `/members/[id]`.
- Direct navigation to a valid member URL works.
- Invalid member ids render a not-found experience.
- The member page includes:
  - `Codex Lab` in the header
  - the student's name in the main title position
  - a `Back to directory` link pointing to `/`
- The page remains readable on small screens.
- Existing directory content still works, including social/profile links.
- `pnpm lint` and `pnpm typecheck` pass before submission.

## Recommended Implementation Path

1. Extend the `Member` type and the relevant student record in [`lib/members.ts`](./lib/members.ts).
2. Add a dynamic route such as [`app/members/[id]/page.tsx`](./app/members/[id]/page.tsx).
3. Update [`components/member-table.tsx`](./components/member-table.tsx) so student names link to the routed page.
4. Build or extend a shared member page component that renders the required profile fields.
5. Add optional custom sections for any content you want beyond the shared structure.
6. Add or update tests in [`components/member-table.test.tsx`](./components/member-table.test.tsx) and [`tests/e2e/home.spec.ts`](./tests/e2e/home.spec.ts).

## Codex App Workflow

### Recommended Git Flow

Create a branch before you start:

```bash
git checkout -b codex/<your-name>-profile-page
```

Examples:

- `codex/jason-profile-page`
- `codex/mark-member-page`

### How To Work In Codex

1. Open the repo in the Codex app.
2. Ask Codex to inspect the current code before editing anything.
3. Be specific about the outcome, the files, and the constraints.
4. Ask Codex to keep changes minimal and preserve the existing visual style.
5. Ask Codex to run verification commands after making changes.
6. Review the diff before you commit.

### Prompting Tips

Good prompts usually include:

- the feature you want
- the files or components to start from
- the behavior that must stay intact
- the commands Codex should run to verify the work

Weak prompt:

```text
Make this better.
```

Strong prompt:

```text
Inspect this repo and add routed member pages at /members/[id]. Make student names clickable from the directory, preserve the current visual language, and run pnpm lint and pnpm typecheck when you're done.
```

Another useful prompt:

```text
Extend the Member type in lib/members.ts with headline, majorYear, tools, and projects. Add those fields for my student record, render them on my routed member page, and update the relevant tests.
```

## Verification

Run these commands before submitting your work:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```

`pnpm test:e2e` starts its own local dev server through Playwright, so you do
not need to manually start a second server for that command.

## Submission Checklist

- Your branch name starts with `codex/`
- A student name navigates to a routed member page
- Your profile content appears on that page
- The page includes a working `Back to directory` link
- Lint and typecheck pass
- You reviewed the diff before commit

## Current Data Model

The current student dataset lives in [`lib/members.ts`](./lib/members.ts).

Today, each member includes:

- `id`
- `name`
- `university`
- `website`
- `avatar`
- `links`
- `profile`

The shared `profile` object is expected to include:

- `headline`
- `majorYear`
- `location`
- `builderType`
- `interests`
- `tools`
- `projects`
- `repoDemoLinks`
- `about`
- `customSections`
