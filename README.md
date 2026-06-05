<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

# SG Gateway Config Frontend

Frontend for the Smart Garden Gateway configuration interface.

## What The App Does

- Authenticated gateway configuration UI with a separate login view
- Manage timezone and Wi-Fi settings
- Reset HomeKit pairings
- Show the current gateway version
- Advanced features for websocket API access and SSH access

## Prerequisites

- Install [Git](https://git-scm.com/)
- Install [nvm](https://github.com/creationix/nvm#install-script)

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

Sort the i18n locale files alphabetically by key (see [`scripts/translations/README.md`](./scripts/translations/README.md)):

```bash
pnpm translations:fix
```

## Environment Variables

Use `https` for gateway URLs.

| Variable            | Description                                                                                                                                                                                                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend origin for the Vite dev/test proxy. The app itself uses relative API paths such as `/login` and `/wifi`. Use `https://localhost` when the app runs on the gateway itself during local development, or the gateway's IP (for example `https://192.168.1.100`) when developing against a real gateway on the same network. |
| `VITE_USE_MOCK_API` | Set to `true` to enable MSW mock interception. Defaults to `false`.                                                                                                                                                                                                                                                              |

Defaults are in `.env.development` (dev server) and `.env.test` (unit tests).

### Pointing The Dev Server At A Real Gateway

Put your gateway IP in `.env.development.local`:

```dotenv
VITE_API_BASE_URL=https://192.168.1.100
```

Vite reads these files literally and does **not** expand shell variables, so `https://$GW_IP` is taken verbatim and fails. Hardcode the IP, or pass it on the command line where the shell expands it:

```bash
GW_IP=192.168.1.100
VITE_API_BASE_URL=https://$GW_IP pnpm dev
```

A command-line value overrides `.env.development.local`.

## Mocking With Mock Service Worker

This project uses [Mock Service Worker](https://mswjs.io/) to intercept browser requests during local development.

Start the app with mocks enabled:

```bash
pnpm dev:mock
```

This sets `VITE_USE_MOCK_API=true`, which makes `src/main.ts` start the MSW worker from `src/mocks/browser.ts` before the Vue app is mounted.

Mock login credentials:

- Password: `pass1234`

The worker script (`public/mockServiceWorker.js`) is gitignored and auto-generated when `dev:mock` runs. To regenerate it manually:

```bash
pnpm msw:init
```

Mock handlers live in `src/mocks/handlers.ts`.

## Releasing

A GitHub Release is published when `package.json` `version` changes on `main`.

1. Bump on a branch: `pnpm version patch` (or `minor` / `major`)
2. PR, review, merge to `main`
3. [`release.yml`](.github/workflows/release.yml) tags `v<version>`, builds, and attaches `sg-gateway-config-frontend-v<version>.tar.gz` (contents of `dist/`).

## Deploying To A Gateway

SSH must be enabled on the gateway first (see [SSH Access](#ssh-access)).

Set the gateway IP once per shell:

```bash
GW_IP=192.168.1.100  # replace with your gateway's IP
```

### Using A GitHub Release

Download a release tar from the [releases page](https://github.com/husqvarnagroup/smart-garden-gateway-config-frontend/releases) and stream it directly to the gateway.

```bash
VERSION=v1.2.3  # replace with the version you want
```

Then run:

```bash
curl -L https://github.com/husqvarnagroup/smart-garden-gateway-config-frontend/releases/download/$VERSION/sg-gateway-config-frontend-$VERSION.tar.gz \
  | ssh root@$GW_IP "rm -rf /usr/share/gateway-config-interface/www/* && tar xzf - -C /usr/share/gateway-config-interface/www"
```

### Using A Local Build

The app uses relative API paths, so `VITE_API_BASE_URL` does not affect the production bundle — it only configures the dev/test proxy. A plain build is enough:

```bash
pnpm build
```

Stream the build over SSH, clear the target, and unpack — no intermediate files on the gateway:

```bash
tar czf - -C dist . | ssh root@$GW_IP "rm -rf /usr/share/gateway-config-interface/www/* && tar xzf - -C /usr/share/gateway-config-interface/www"
```

## SSH Access

SSH is disabled by default. Enable it from the config UI (Advanced features), which also lets you register a public key. Once enabled and your key is added:

```bash
GW_IP=192.168.1.100
ssh root@$GW_IP
```
