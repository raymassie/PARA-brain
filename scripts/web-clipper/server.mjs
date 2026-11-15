import http from 'node:http';
import { readFile, writeFile, realpath, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { extractCapture, saveCapture, MAX_CAPTURE_BYTES, sourceURL } from './lib/clip.mjs';
import { bookmarklet } from './public/bookmarklet.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(root, 'config.local.json');
const vaultKey = createHash('sha256').update(path.resolve(root, '../..')).digest('hex').slice(0, 16);

export async function readConfig() {
  const defaults = JSON.parse(await readFile(path.join(root, 'defaults.json'), 'utf8'));
  let config = {};
  try { config = JSON.parse(await readFile(configPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!config.inbox) {
    const candidate = path.resolve(root, '../..', '00-raw');
    try { if ((await stat(candidate)).isDirectory()) config.inbox = candidate; } catch {}
  }
  return { inbox: '', ...defaults, ...config };
}

function privateAddress(address) {
  const ip = address.replace(/^\[|\]$/g, '');
  if (isIP(ip) === 4) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  // URL fallback uses public IPv4 hosts only, to avoid mapped/local IPv6 variants.
  return true;
}

async function fetchPage(value) {
  let url = new URL(sourceURL(value));
  for (let redirects = 0; redirects < 5; redirects++) {
    const addresses = await lookup(url.hostname, { all: true, family: 4 });
    if (!addresses.length || addresses.some(entry => privateAddress(entry.address))) {
      throw new Error('URL loading supports public websites only. Use the bookmarklet or paste text for a local page.');
    }
    // Pin the checked address so a second DNS resolution cannot change the target.
    const response = await new Promise((resolve, reject) => {
      import(url.protocol === 'https:' ? 'node:https' : 'node:http').then(({ default: transport }) => {
        const request = transport.get(url, { timeout: 15000,
          headers: { 'User-Agent': 'PARA-Clipper/0.1', Accept: 'text/html,text/plain' },
          lookup: (_hostname, options, callback) => options?.all
            ? callback(null, [addresses[0]]) : callback(null, addresses[0].address, addresses[0].family)
        }, resolve);
        request.on('timeout', () => request.destroy(new Error('The website took too long. Use the bookmarklet or paste text.')));
        request.on('error', reject);
      }).catch(reject);
    });
    if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
      response.resume();
      if (!response.headers.location) throw new Error('The website returned an empty redirect.');
      url = new URL(sourceURL(new URL(response.headers.location, url).href));
      continue;
    }
    if (response.statusCode !== 200) { response.resume(); throw new Error(`The website returned ${response.statusCode}. Use the bookmarklet or paste text.`); }
    const type = response.headers['content-type'] || '';
    if (!/text\/(html|plain)|application\/xhtml\+xml/i.test(type)) { response.resume(); throw new Error('This address is not a readable web page. Paste the text instead.'); }
    let size = 0;
    const chunks = [];
    for await (const chunk of response) {
      size += chunk.length;
      if (size > MAX_CAPTURE_BYTES) { response.destroy(); throw new Error('This page is too large. Clip a selected passage instead.'); }
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString('utf8');
    return /text\/plain/.test(type) ? { text: content, url: url.href } : { html: content, url: url.href };
  }
  throw new Error('The website redirected too many times.');
}

async function requestBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_CAPTURE_BYTES * 2) throw new Error('Capture too large. Select a smaller passage.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function jsonBody(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw new Error('Expected JSON input.');
  const body = JSON.parse(await requestBody(request));
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid capture.');
  return body;
}

export function createClipper({ config, persistConfig = async value => {
  await writeFile(configPath, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
} }) {
  const token = randomBytes(32).toString('hex');
  const receipts = new Map();
  const drafts = new Map();
  const server = http.createServer(async (request, response) => {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const headers = {
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
    };
    const send = (status, value, type = 'application/json; charset=utf-8') => {
      response.writeHead(status, { ...headers, 'Content-Type': type });
      response.end(type.startsWith('application/json') ? JSON.stringify(value) : value);
    };
    if (request.headers.host !== new URL(origin).host) return send(403, { error: 'Open the clipper using its 127.0.0.1 address.' });
    const pathname = new URL(request.url, origin).pathname;
    if (pathname.startsWith('/api/')) {
      if ((request.headers.origin && request.headers.origin !== origin) ||
        (request.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(request.headers['sec-fetch-site']))) {
        return send(403, { error: 'Open the local clipper to continue.' });
      }
      if (pathname !== '/api/session') {
        const supplied = Buffer.from(String(request.headers['x-para-token'] || ''));
        const expected = Buffer.from(token);
        if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return send(403, { error: 'Refresh the clipper page to reconnect.' });
      }
    }
    try {
      if (request.method === 'POST' && pathname === '/capture') {
        if (!request.headers['content-type']?.startsWith('application/x-www-form-urlencoded')) throw new Error('Use the Clip to PARA bookmark.');
        const encoded = new URLSearchParams(await requestBody(request)).get('capture');
        if (!encoded || Buffer.byteLength(encoded) > MAX_CAPTURE_BYTES) throw new Error('Capture too large. Copy a passage and paste it instead.');
        const capture = JSON.parse(encoded);
        if (!capture || typeof capture.html !== 'string') throw new Error('Invalid page capture.');
        sourceURL(capture.url);
        if (drafts.size >= 5) drafts.delete(drafts.keys().next().value);
        const id = randomBytes(24).toString('hex');
        drafts.set(id, capture);
        setTimeout(() => drafts.delete(id), 5 * 60 * 1000).unref();
        // No file writes, extraction, network requests, or automatic saves here.
        response.writeHead(303, { ...headers, Location: `/#draft=${id}` });
        return response.end();
      }
      if (request.method === 'GET' && pathname === '/health') return send(200, { app: 'para-clipper', version: '0.1.0', vaultKey });
      if (request.method === 'GET' && pathname === '/api/session') return send(200, { token, inbox: config.inbox, bookmarklet: bookmarklet(origin) });
      if (request.method === 'POST' && pathname === '/api/draft') {
        const { id } = await jsonBody(request);
        if (typeof id !== 'string' || !drafts.has(id)) throw new Error('This preview expired. Return to the page and clip it again.');
        const capture = drafts.get(id);
        drafts.delete(id);
        return send(200, capture);
      }
      if (request.method === 'POST' && pathname === '/api/config') {
        const body = await jsonBody(request);
        if (typeof body.inbox !== 'string' || !path.isAbsolute(body.inbox)) throw new Error('Enter the full path to your inbox folder.');
        const inbox = await realpath(body.inbox);
        if (!(await stat(inbox)).isDirectory()) throw new Error('Choose an existing folder.');
        const next = { ...config, inbox };
        await persistConfig(next);
        Object.assign(config, next);
        return send(200, { inbox });
      }
      if (request.method === 'POST' && pathname === '/api/extract') {
        const body = await jsonBody(request);
        const input = !body.html && !body.text && body.url ? { ...body, ...await fetchPage(body.url) } : body;
        return send(200, extractCapture(input));
      }
      if (request.method === 'POST' && pathname === '/api/save') {
        const body = await jsonBody(request);
        if (!config.inbox) throw new Error('Choose your inbox folder in Settings first.');
        if (typeof body.requestId !== 'string' || !/^[\w-]{8,100}$/.test(body.requestId)) throw new Error('Refresh the preview before saving.');
        // Concurrent/retried clicks share one promise and one saved file.
        if (!receipts.has(body.requestId)) {
          if (receipts.size >= 10000) throw new Error('Restart the helper before saving more captures.');
          const pending = saveCapture(config.inbox, body.clip).catch(error => { receipts.delete(body.requestId); throw error; });
          receipts.set(body.requestId, pending);
        }
        return send(200, await receipts.get(body.requestId));
      }
      const assets = { '/': ['index.html', 'text/html; charset=utf-8'],
        '/app.js': ['app.js', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
      if (request.method === 'GET' && assets[pathname]) {
        const [file, type] = assets[pathname];
        return send(200, await readFile(path.join(root, 'public', file)), type);
      }
      send(404, { error: 'Not found.' });
    } catch (error) { send(400, { error: error.message || 'Could not complete the capture.' }); }
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 10000;
  return server;
}

function openBrowser(url) {
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer.exe' : 'xdg-open';
  const child = spawn(command, [url], { stdio: 'ignore', detached: true });
  child.on('error', () => console.log(`Open ${url} in your browser.`));
  child.unref();
}

async function main() {
  const config = await readConfig();
  const port = Number(process.env.PARA_CLIPPER_PORT || config.port);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Choose a port between 1024 and 65535.');
  const url = `http://127.0.0.1:${port}`;
  const server = createClipper({ config });
  server.on('error', async error => {
    if (error.code === 'EADDRINUSE') {
      try {
        const existing = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) });
        const running = await existing.json();
        if (running.app === 'para-clipper' && running.vaultKey === vaultKey) {
          console.log(`PARA Clipper is already running at ${url}`);
          if (process.argv.includes('--open')) openBrowser(url);
          return;
        }
      } catch {}
      console.error(`Port ${port} is busy. Choose a different port in config.local.json.`);
    } else console.error(error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`PARA Clipper: ${url}\nInbox: ${config.inbox || 'Choose a folder in Settings'}\nKeep this window open while clipping. Press Control-C to stop.`);
    if (process.argv.includes('--open')) openBrowser(url);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
