// Manual browser QA uses an isolated inbox, never the user's real captures.
import http from 'node:http';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createClipper } from '../server.mjs';
import { bookmarklet, capturePage } from '../public/bookmarklet.js';

const temp = await mkdtemp(path.join(os.tmpdir(), 'para-clipper-browser-'));
const inbox = path.join(temp, '00-raw'); await mkdir(inbox);
const helper = createClipper({ config: { inbox }, persistConfig: async () => {} });
const origin = 'http://127.0.0.1:27125';
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Keeping source material</title>
<meta name="author" content="PARA test author"><meta property="article:published_time" content="2026-11-14"></head>
<body><nav>Unrelated navigation</nav><article><h1>Keeping source material</h1>
<p id="excerpt">A <strong>selected passage</strong> keeps its formatting and <a href="/reference">source link</a>.</p>
<p>An article capture preserves the ideas and context that made a page useful in the first place. It should remain readable in ordinary text editors, while retaining enough provenance to find the source again when a question arises.</p>
<p>After saving, a separate processing step creates useful notes and puts them in a location that matches their purpose. The original capture remains a permanent source record and is moved unchanged into the raw archive. This keeps the source distinct from the interpretation and makes future corrections easier.</p>
<pre><code>const inbox = '00-raw';</code></pre></article>
<a id="clip-article" href="${bookmarklet(origin).replace(/"/g, '&quot;')}">Clip whole article</a>
<button id="clip-selection">Clip selected passage</button>
<script>document.getElementById('clip-selection').onclick=()=>{const range=document.createRange();range.selectNodeContents(document.getElementById('excerpt'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);(${capturePage.toString()})(${JSON.stringify(origin)});};</script>
</body></html>`;
const fixture = http.createServer((request, response) => { response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(page); });
await new Promise(resolve => helper.listen(27125, '127.0.0.1', resolve));
await new Promise(resolve => fixture.listen(27126, '127.0.0.1', resolve));
console.log(`QA helper: ${origin}\nQA article: http://127.0.0.1:27126/\nIsolated inbox: ${inbox}`);
process.on('SIGINT', async () => {
  helper.closeAllConnections(); fixture.closeAllConnections(); helper.close(); fixture.close();
  await rm(temp, { recursive: true, force: true }); process.exit(0);
});
