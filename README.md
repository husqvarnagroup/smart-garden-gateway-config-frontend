# SG Gateway Config Frontend

Frontend for the Smart Garden Gateway configuration interface.

## Prerequisites

- Install [Git](https://git-scm.com/)
- Install [nvm](https://github.com/creationix/nvm#install-script)
- Configure [NPM Artifactory Registry](https://confluence-husqvarna.riada.se/display/SGS/Artifactory#Artifactory-Setup). Verify with `pnpm ping`

## Setup

```bash
nvm install
nvm use
corepack enable pnpm
pnpm install
```

## Development

Start the Vite dev server:

```bash
pnpm dev
# or
pnpm dev:mock
```

Create a production build:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Quality Checks

Format check:

```bash
pnpm format
```

Apply formatting fixes:

```bash
pnpm format:fix
```

Run lint checks:

```bash
pnpm lint
```

Apply lint fixes:

```bash
pnpm lint:fix
```

Run formatting, lint, and type-checks together:

```bash
pnpm code
```

Apply formatting and lint fixes, then run type-checking:

```bash
pnpm code:fix
```

Type-check the app:

```bash
pnpm type-check
```

Run unit tests:

```bash
pnpm test:unit
```

## Mocking With Mock Service Worker

This project uses [Mock Service Worker](https://mswjs.io/) to intercept browser requests during local development.

Start the app with mocks enabled:

```bash
pnpm dev:mock
```

This sets `VITE_USE_MOCK_API=true`, which makes `src/main.ts` start the MSW worker from `src/mocks/browser.ts` before the Vue app is mounted.

The worker script is checked in at `public/mockServiceWorker.js`. If MSW is re-initialized, run:

```bash
pnpm msw:init
```

Mock handlers live in `src/mocks/handlers.ts`.

