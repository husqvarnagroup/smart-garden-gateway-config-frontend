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

Production builds inject the current short git commit hash into `dist/index.html` as:

```html
<meta name="git-commit" content="abc1234" />
```

## Quality Checks

Run unit tests:

```bash
pnpm test
```

Run formatting, lint, and type-checks together:

```bash
pnpm code
```

Apply formatting and lint fixes, then run type-checking:

```bash
pnpm code:fix
```

## Environment Variables

| Variable            | Description                                                                                                                                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend origin the browser calls. Use `https://localhost` when the app runs on the gateway itself (production or on-device testing). Use the gateway's IP (e.g. `http://192.168.1.100`) to develop against a real gateway on the same local network. Required in all modes. |
| `VITE_USE_MOCK_API` | Set to `true` to enable MSW mock interception. Defaults to `false`.                                                                                                                                                                                                         |

Defaults are in `.env.development` (dev server) and `.env.test` (unit tests).

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
