const $ = id => document.getElementById(id);
let session;
let clip = { mode: 'text' };
let requestId = crypto.randomUUID();
let saved = false;
let busy = false;
const draftId = location.hash.startsWith('#draft=') ? location.hash.slice(7) : '';
history.replaceState(null, '', '/');

function status(message, kind = '') { $('status').textContent = message; $('status').className = kind; }
function updateControls() {
  const count = $('content').value.trim().split(/\s+/u).filter(Boolean).length;
  $('word-count').textContent = `${count.toLocaleString()} words · Markdown`;
  $('save').disabled = busy || saved || !session || !session.inbox || !count || !$('title').value.trim();
  $('load-url').disabled = busy;
  $('save').textContent = saved ? 'Saved ✓' : busy ? 'Working…' : 'Save to 00-raw ↗';
}
function destination(inbox) {
  session.inbox = inbox;
  $('inbox').value = inbox;
  $('destination').textContent = inbox || 'Choose your inbox in Settings';
  updateControls();
}
async function api(route, data) {
  const response = await fetch(`/api/${route}`, { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-PARA-Token': session.token }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Could not complete the capture.');
  return result;
}
async function extract(input) {
  if (busy) return;
  busy = true; updateControls(); status('Preparing your capture…');
  try {
    clip = await api('extract', input);
    for (const key of ['url', 'title', 'content', 'author', 'published']) $(key).value = clip[key] || '';
    $('notes').value = '';
    requestId = crypto.randomUUID(); saved = false;
    $('capture-kind').textContent = clip.mode === 'selection' ? 'SELECTED PASSAGE' : clip.mode === 'article' ? 'ARTICLE' : 'PASTED TEXT';
    status('Ready to save. Review the Markdown and add anything you want to remember.');
  } catch (error) { status(error.message, 'error'); }
  finally { busy = false; updateControls(); }
}

$('settings-toggle').addEventListener('click', () => {
  $('settings').hidden = !$('settings').hidden;
  $('settings-toggle').setAttribute('aria-expanded', String(!$('settings').hidden));
  if (!$('settings').hidden) $('inbox').focus();
});
$('settings-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!session) return;
  try {
    const result = await api('config', { inbox: $('inbox').value.trim() });
    destination(result.inbox); status('Inbox folder saved.', 'success');
    $('settings').hidden = true;
    $('settings-toggle').setAttribute('aria-expanded', 'false');
  } catch (error) { status(error.message, 'error'); }
});
$('bookmarklet').addEventListener('click', event => {
  event.preventDefault();
  status('Drag “Clip to PARA” to your bookmarks bar, then click the bookmark while viewing a web page.');
});
$('copy-bookmark').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(session.bookmarklet); status('Bookmark URL copied. Paste it into a browser bookmark’s URL field.', 'success'); }
  catch { $('bookmark-code').focus(); $('bookmark-code').select(); status('Select and copy the bookmark URL, then paste it into a browser bookmark.'); }
});
$('load-url').addEventListener('click', () => extract({ url: $('url').value.trim() }));
$('paste-text').addEventListener('click', async () => {
  if (!session || busy) return;
  try {
    const text = await navigator.clipboard.readText();
    if (text.trim()) await extract({ text, url: $('url').value.trim(), title: $('title').value });
  } catch { $('content').focus(); status('Paste into the Content field with your usual keyboard shortcut.'); }
});
for (const id of ['url', 'title', 'content', 'notes', 'author', 'published']) {
  $(id).addEventListener('input', () => {
    if (saved) { requestId = crypto.randomUUID(); saved = false; }
    if (!$('title').value && id === 'content') $('title').value = $('content').value.trim().split('\n')[0].slice(0, 160);
    updateControls();
  });
}
$('capture-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || saved || $('save').disabled) return;
  busy = true; updateControls(); status('Saving your capture…');
  try {
    const current = { ...clip };
    for (const key of ['url', 'title', 'content', 'notes', 'author', 'published']) current[key] = $(key).value;
    const result = await api('save', { requestId, clip: current });
    saved = true;
    status(`Saved ${result.filename}. It is in your inbox, ready for “process the inbox”.`, 'success');
  } catch (error) { status(error.message, 'error'); }
  finally { busy = false; updateControls(); }
});

async function start() {
  try {
    const response = await fetch('/api/session');
    if (!response.ok) throw new Error('Could not connect to the local helper.');
    session = await response.json();
    $('bookmarklet').href = session.bookmarklet;
    $('bookmark-code').value = session.bookmarklet;
    destination(session.inbox);
    if (!session.inbox) {
      $('settings').hidden = false;
      $('settings-toggle').setAttribute('aria-expanded', 'true');
    }
    if (draftId) await extract(await api('draft', { id: draftId }));
  } catch (error) { status(`${error.message} Start PARA Clipper, then refresh this page.`, 'error'); }
  finally { updateControls(); }
}
start();
