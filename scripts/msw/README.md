<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

# scripts/msw

Scripts for managing [Mock Service Worker](https://mswjs.io/) in this project.

## remove-msw-worker.js

Removes `mockServiceWorker.js` from both the Vite build output directory after a production build, so the worker is not committed as a stale artifact and not shipped to production.

The build output directory is read from `vite.build.outDir` in `package.json` (defaults to `dist`).

Skips removal when `VITE_USE_MOCK_API=true` is set — mock builds keep the worker file.

### Usage

```sh
node scripts/msw/remove-msw-worker.js
```
