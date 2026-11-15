import { parseHTML } from 'linkedom';
import { DefuddleClass as Defuddle } from 'defuddle/node';
import { createRequire } from 'node:module';
import { link, mkdir, open, realpath, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const MAX_CAPTURE_BYTES = 8 * 1024 * 1024;
// Defuddle 0.19.2 exposes its Markdown converter on the browser build only.
// Use the same pinned converter's Node build to keep DOM globals out of the server.
const require = createRequire(import.meta.url);
const { createMarkdownContent } = require(path.join(path.dirname(require.resolve('defuddle')), 'markdown.js'));

export function sourceURL(value) {
  if (!value) return '';
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Use an HTTP or HTTPS page address without embedded credentials.');
  }
  return url.href;
}

function cleanDocument(html, url) {
  const { document } = parseHTML(html);
  document.URL = url || 'https://example.invalid/';
  document.styleSheets = [];
  document.defaultView.getComputedStyle = () => ({ display: '' });
  document.querySelectorAll('script:not([type="application/ld+json"]),style,iframe,object,embed,input,textarea,select,button').forEach(el => el.remove());
  for (const el of document.querySelectorAll('*')) {
    for (const attr of [...el.attributes]) {
      if (/^on/i.test(attr.name) || ['srcdoc', 'style'].includes(attr.name)) el.removeAttribute(attr.name);
    }
    for (const attr of ['href', 'src', 'poster']) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      try {
        const absolute = new URL(value, url || 'https://example.invalid/');
        if (['http:', 'https:', 'mailto:'].includes(absolute.protocol)) el.setAttribute(attr, absolute.href);
        else el.removeAttribute(attr);
      } catch { el.removeAttribute(attr); }
    }
  }
  return document;
}

function plainText(value) {
  return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
}

export function extractCapture(input) {
  const url = sourceURL(input.url);
  const text = plainText(input.text);
  if (text && !input.html) {
    return { title: plainText(input.title) || text.split('\n')[0].slice(0, 160), url,
      author: '', published: '', site: url ? new URL(url).hostname : '',
      description: '', mode: 'text', content: text };
  }
  if (typeof input.html !== 'string' || !input.html.trim()) throw new Error('Capture a page or paste some text first.');
  if (Buffer.byteLength(input.html) > MAX_CAPTURE_BYTES) throw new Error('This page is too large. Select a smaller passage and clip again.');
  const document = cleanDocument(input.html, url);
  // Synchronous extraction intentionally avoids transcript/other network fetches.
  const result = new Defuddle(document, { url, removeImages: false }).parse();
  let content;
  const mode = input.selection ? 'selection' : 'article';
  if (input.selection) {
    const selection = cleanDocument(`<html><body>${input.selection}</body></html>`, url);
    content = createMarkdownContent(selection.body.innerHTML, url);
  } else {
    content = createMarkdownContent(result.content, url);
  }
  if (!content?.trim()) throw new Error('No readable content found. Copy the passage and use Paste text.');
  return { title: plainText(input.title) || result.title || 'Untitled capture', url,
    author: plainText(result.author), published: plainText(result.published),
    site: plainText(result.site), description: plainText(result.description),
    mode, content: content.trim() };
}

export function renderNote(clip, captured = new Date()) {
  const title = plainText(clip.title);
  const content = plainText(clip.content);
  if (!title || !content) throw new Error('Add a title and some content before saving.');
  const url = sourceURL(clip.url);
  const metadata = { title, source: url || undefined, author: plainText(clip.author) || undefined,
    published: plainText(clip.published) || undefined, captured: captured.toISOString(),
    capture: ['article', 'selection', 'text'].includes(clip.mode) ? clip.mode : 'text',
    tags: ['clipping'] };
  const frontmatter = Object.entries(metadata).filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
  const notes = plainText(clip.notes);
  return `---\n${frontmatter}\n---\n\n# ${title.replace(/\s+/g, ' ')}\n\n${content}\n${notes ? `\n## My notes\n\n${notes}\n` : ''}`;
}

function slug(title) {
  return plainText(title).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 48).replace(/-$/g, '') || 'capture';
}

export async function saveCapture(inbox, clip, captured = new Date()) {
  const note = renderNote(clip, captured);
  const destination = await realpath(inbox);
  // Fully write beside the inbox, then publish with an exclusive hard link.
  // Readers never see partial captures; collisions never replace existing files.
  const pending = path.join(path.dirname(destination), '.para-clipper-pending');
  await mkdir(pending, { recursive: true, mode: 0o700 });
  const temp = path.join(pending, `${randomUUID()}.tmp`);
  const handle = await open(temp, 'wx', 0o600);
  try {
    try {
      await handle.writeFile(note, 'utf8');
      await handle.sync();
    } finally { await handle.close(); }
    const stamp = captured.toISOString().replace(/[:.]/g, '-');
    const base = `${stamp}-${slug(clip.title)}`;
    for (let count = 0; count < 1000; count++) {
      const filename = `${base}${count ? `-${count + 1}` : ''}.md`;
      try {
        await link(temp, path.join(destination, filename));
        return { filename, path: path.join(destination, filename) };
      } catch (error) { if (error.code !== 'EEXIST') throw error; }
    }
    throw new Error('Could not create a unique capture filename.');
  } finally {
    // Cleanup failure after publication must not turn a successful save into a retry.
    await unlink(temp).catch(error => console.warn('Temporary capture cleanup failed:', error.code));
  }
}
