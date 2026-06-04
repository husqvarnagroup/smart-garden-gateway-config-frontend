// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { readFileSync, rmSync } from 'fs';

if (process.env.VITE_USE_MOCK_API === 'true') process.exit(0);

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const outDir = pkg.vite?.build?.outDir ?? 'dist';

rmSync(`${outDir}/mockServiceWorker.js`, { force: true });
