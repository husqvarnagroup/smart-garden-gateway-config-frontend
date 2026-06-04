#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, '..', '..', 'src', 'i18n', 'locales');

for (const file of readdirSync(localesDir).filter((f) => f.endsWith('.yaml'))) {
  const path = join(localesDir, file);
  const entries = readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line && line !== '---' && !line.startsWith('#'))
    .map((line) => {
      const match = line.match(/^([^:\s]+):\s(.*)$/);
      if (!match) throw new Error(`${file}: unparseable line: ${JSON.stringify(line)}`);
      return [match[1], match[2]];
    })
    .sort(([a], [b]) => a.localeCompare(b, 'en'));

  writeFileSync(path, `---\n${entries.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`);
}
