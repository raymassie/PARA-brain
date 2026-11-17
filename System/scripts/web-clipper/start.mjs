import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const directory = path.dirname(fileURLToPath(import.meta.url));
if (Number(process.versions.node.split('.')[0]) < 22) {
  console.error('PARA Clipper needs Node.js 22 or newer. Install it from https://nodejs.org, then open the clipper again.');
  process.exit(1);
}
if (!existsSync(path.join(directory, 'node_modules/defuddle/package.json'))) {
  console.log('Preparing the built-in clipper (first launch only)…');
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: directory, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status || 1);
}
process.argv.push('--open');
// Importing server does not start it; execute it as the main entry point.
const result = spawnSync(process.execPath, [path.join(directory, 'server.mjs'), '--open'], { stdio: 'inherit', cwd: directory });
process.exit(result.status || 0);
