import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
import { extractCapture, renderNote, saveCapture, sourceURL } from '../lib/clip.mjs';
import { createClipper } from '../server.mjs';
import { bookmarklet } from '../public/bookmarklet.js';

const html = `<!doctype html><html><head><title>A useful article</title><meta name="author" content="A. Writer"><meta property="article:published_time" content="2026-11-10"></head><body>
<nav>Unrelated menu</nav><article><h1>A useful article</h1>
<p>Keeping useful information means preserving the source, the context, and the ideas that matter. A plain Markdown inbox makes those ideas accessible to different editors and assistants, without needing a specific application.</p>
<p>Here is a <a href="/reference">reference link</a> and a second paragraph with enough information to explain what the author intended. Captures remain unchanged until they move into a permanent raw archive.</p>
<pre><code class="language-js">const answer = 42;</code></pre>
<p><img src="/diagram.png" alt="A diagram"></p></article><input value="private-field"><script>alert('never run')</script></body></html>`;

test('a copied System layout finds its own raw inbox and retains private overrides', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'PARA vault with spaces-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const inbox = path.join(root, '00-raw'); await mkdir(inbox);
  const copied = path.join(root, 'System', 'scripts', 'web-clipper'); await mkdir(copied, { recursive: true });
  const source = fileURLToPath(new URL('../', import.meta.url));
  for (const name of ['server.mjs', 'package.json', 'defaults.json', 'lib', 'public']) {
    await cp(path.join(source, name), path.join(copied, name), { recursive: true });
  }
  await symlink(path.join(source, 'node_modules'), path.join(copied, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  const { readConfig } = await import(pathToFileURL(path.join(copied, 'server.mjs')).href);
  assert.equal((await readConfig()).inbox, await realpath(inbox));
  assert.equal((await readConfig()).port, 27123);
  const custom = path.join(root, 'personal inbox'); await mkdir(custom);
  await writeFile(path.join(copied, 'config.local.json'), JSON.stringify({ inbox: custom, port: 27200 }));
  assert.deepEqual(await readConfig(), { inbox: custom, port: 27200 });
});

test('extracts article metadata, Markdown links, code, and image references without active content', () => {
  const clip = extractCapture({ url: 'https://example.com/story', html });
  assert.equal(clip.title, 'A useful article');
  assert.equal(clip.author, 'A. Writer');
  assert.equal(clip.published, '2026-11-10');
  assert.match(clip.content, /\[reference link\]\(https:\/\/example.com\/reference\)/);
  assert.match(clip.content, /const answer = 42/);
  assert.match(clip.content, /!\[A diagram\]\(https:\/\/example.com\/diagram.png\)/);
  assert.doesNotMatch(clip.content, /Unrelated menu|private-field|never run|Partial conversion/);
});

test('selection preserves selected formatting and provenance, excluding unselected article', () => {
  const clip = extractCapture({ url: 'https://example.com/story', html,
    selection: '<p>Only <strong>this passage</strong> and <a href="/source">its link</a>.</p>' });
  assert.equal(clip.mode, 'selection');
  assert.equal(clip.author, 'A. Writer');
  assert.match(clip.content, /Only \*\*this passage\*\*/);
  assert.match(clip.content, /https:\/\/example.com\/source/);
  assert.doesNotMatch(clip.content, /Keeping useful|answer = 42/);
});

test('pasted text and YAML-looking titles remain literal data', () => {
  const clip = extractCapture({ text: 'Copied material\n\nAnother paragraph.', title: 'A title\nstatus: processed' });
  const note = renderNote(clip, new Date('2026-11-15T05:00:00Z'));
  assert.match(note, /title: "A title\\nstatus: processed"/);
  assert.match(note, /capture: "text"/);
  assert.match(note, /# A title status: processed/);
  assert.doesNotMatch(note, /^status: processed$/m);
  assert.match(note, /Copied material\n\nAnother paragraph/);
  assert.throws(() => sourceURL('file:///etc/passwd'));
  assert.throws(() => sourceURL('https://user:password@example.com'));
  assert.throws(() => extractCapture({}));
  assert.throws(() => renderNote({ title: 'Empty', content: '' }));
});

test('parallel saves never overwrite an existing capture, escape the inbox, or publish partial files', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'para-clipper-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const inbox = path.join(root, '00-raw'); await mkdir(inbox);
  await writeFile(path.join(inbox, 'existing.md'), 'Preserve this capture.');
  const clip = { title: '../../same/title', content: 'A complete source.', mode: 'text' };
  const now = new Date('2026-11-15T05:00:00Z');
  const results = await Promise.all(Array.from({ length: 12 }, () => saveCapture(inbox, clip, now)));
  assert.equal(new Set(results.map(r => r.filename)).size, 12);
  assert.equal((await readdir(inbox)).length, 13);
  assert.equal(await readFile(path.join(inbox, 'existing.md'), 'utf8'), 'Preserve this capture.');
  for (const result of results) {
    assert.equal(path.dirname(result.path), await realpath(inbox));
    assert.equal(await readFile(result.path, 'utf8'), renderNote(clip, now));
  }
  assert.deepEqual(await readdir(path.join(root, '.para-clipper-pending')), []);
  const unicode = await saveCapture(inbox, { ...clip, title: '保存'.repeat(100) }, now);
  assert.ok(Buffer.byteLength(unicode.filename) < 255);
  assert.equal(path.dirname(unicode.path), await realpath(inbox));
});

test('local API enforces origin/token/host checks and saves a retried request exactly once', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'para-clipper-api-'));
  const inbox = path.join(root, '00-raw'); await mkdir(inbox);
  const persisted = [];
  const server = createClipper({ config: { inbox, port: 0 }, persistConfig: async config => persisted.push(config) });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(root, { recursive: true, force: true }); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const session = await (await fetch(`${origin}/api/session`)).json();
  const headers = { 'Content-Type': 'application/json', 'X-PARA-Token': session.token, Origin: origin };
  const post = (route, body, extraHeaders = {}) => fetch(`${origin}/api/${route}`, { method: 'POST', headers: { ...headers, ...extraHeaders }, body: JSON.stringify(body) });
  assert.equal((await fetch(`${origin}/api/session`, { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  assert.equal((await post('save', {}, { 'X-PARA-Token': '' })).status, 403);
  assert.equal((await post('save', {}, { Origin: 'https://untrusted.example' })).status, 403);
  const wrongHost = await new Promise((resolve, reject) => {
    http.get(`${origin}/`, { headers: { Host: 'untrusted.example' } }, response => {
      response.resume(); resolve(response.statusCode);
    }).on('error', reject);
  });
  assert.equal(wrongHost, 403);
  const preview = await (await post('extract', { html, url: 'https://example.com/story' })).json();
  const captureResponse = await fetch(`${origin}/capture`, { method: 'POST', redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://example.com' },
    body: new URLSearchParams({ capture: JSON.stringify({ html, url: 'https://example.com/story' }) }) });
  assert.equal(captureResponse.status, 303);
  assert.match(captureResponse.headers.get('location'), /^\/#draft=[a-f0-9]{48}$/);
  assert.deepEqual(await readdir(inbox), []);
  const id = captureResponse.headers.get('location').split('=')[1];
  const draft = await (await post('draft', { id })).json();
  assert.equal(draft.html, html);
  assert.equal((await post('draft', { id })).status, 400);
  const payload = { requestId: 'same-request-1234', clip: preview };
  const responses = await Promise.all([post('save', payload), post('save', payload)]);
  assert.deepEqual(await responses[0].json(), await responses[1].json());
  assert.equal((await readdir(inbox)).length, 1);
  assert.equal((await post('extract', { url: 'http://127.0.0.1/private' })).status, 400);
  const config = await post('config', { inbox });
  assert.equal(config.status, 200); assert.equal(persisted.length, 1);
  assert.equal((await post('config', { inbox: '../outside' })).status, 400);
  assert.equal((await fetch(`${origin}/../server.mjs`)).status, 404);
});

test('bookmarklet posts sanitized page content locally without putting it in the URL', () => {
  const helperOrigin = 'http://127.0.0.1:27123';
  const { document } = parseHTML(html);
  let submitted;
  const createElement = document.createElement.bind(document);
  document.createElement = tag => {
    const element = createElement(tag);
    if (tag === 'form') element.submit = () => { submitted = { action: element.action, method: element.method,
      capture: JSON.parse(element.querySelector('input').value) }; };
    return element;
  };
  const window = { getSelection: () => ({ isCollapsed: true }) };
  const context = vm.createContext({ document, window, URL, Blob,
    location: { protocol: 'https:', href: 'https://example.com/story' }, alert: message => assert.fail(message) });
  vm.runInContext(decodeURIComponent(bookmarklet(helperOrigin).slice('javascript:'.length)), context);
  assert.equal(submitted.action, `${helperOrigin}/capture`);
  assert.equal(submitted.method, 'POST');
  assert.equal(submitted.capture.url, 'https://example.com/story');
  assert.doesNotMatch(submitted.capture.html, /private-field|never run/);
  assert.match(extractCapture(submitted.capture).content, /Keeping useful information/);
});
