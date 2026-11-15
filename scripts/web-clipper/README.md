# Built-in web clipper

Capture a readable article or selected passage into this vault’s `00-raw` using
a browser bookmark. The same tool ships with PARA-brain and PARA-workbench.
It uses ordinary Markdown files; no browser extension, Obsidian installation,
AI model, account, or hosted capture service is required.

## Set up and launch

The clipper requires [Node.js](https://nodejs.org/) 22 or newer and a terminal
window that stays open while you clip. The macOS and Windows launchers open
Terminal or Command Prompt for you. On Linux, open a terminal yourself.

Install Node.js first, then start the clipper from the vault root:

- **macOS:** double-click `Start PARA Clipper - macOS.command`.
- **Windows:** double-click `Start PARA Clipper - Windows.cmd`.
- **Linux or any terminal:** run `node scripts/web-clipper/start.mjs`.

The launcher installs the pinned dependencies with `npm ci --ignore-scripts` on
first use, then opens the local clipper. That first launch needs internet access.
Subsequent bookmarklet capture and saving work locally. You can minimize the
terminal window, but closing it stops the clipper. Press Control-C in that window
when you want to stop it. Nothing is installed as a service.

On the setup page, drag **Clip to PARA** to the bookmarks bar. If dragging is
unavailable, expand **Can’t drag a bookmark?**, copy the URL, create a browser
bookmark, and paste it into the bookmark’s URL field. The bookmark includes only
the local helper address, with no personal paths or credentials.

The default destination is the `00-raw` folder beside this repository’s README.
Settings accepts the full path to another existing inbox. Settings remain in
ignored `scripts/web-clipper/config.local.json`; `config.example.json` in this
folder shows the format. A custom port requires restarting the helper and
replacing the bookmark using the new setup page.

Each repository supplies its default port in `defaults.json`: PARA-brain uses
27123; PARA-workbench uses 27124. Both helpers can run at once. Install the bookmark
from the vault you want to receive captures. Rename bookmarks if keeping both.

## Capture and save

1. Open a web page and click **Clip to PARA**. Select text first to capture only
   that passage. The bookmarklet copies the currently rendered page to the local
   helper, which extracts readable Markdown and available source metadata.
2. Review and edit the title, Markdown, author, publication date, and optional
   personal notes in the preview. Missing source metadata stays blank.
3. Click **Save to 00-raw**. The confirmation names the new file. Captures contain
   title, source URL, available author/publication date, capture time and mode,
   the captured content, and any notes you added.

File names include a UTC timestamp and title. Existing files are never replaced.
Concurrent/retried Save requests share one receipt for the running session.
Complete captures are published atomically using an exclusive hard link from a
temporary sibling folder, `.para-clipper-pending`, on the inbox’s filesystem.
That folder and local dependencies/settings are excluded from version control.
The destination filesystem must support hard links (for example APFS, NTFS, or
ext4); unsupported filesystems report an error instead of weakening the save rule.

## What happens after saving

Saving adds an unsorted source record. It does not call an AI assistant, classify
the capture, run inbox processing, or change other vault notes.

Ask an assistant with vault file access to **“Read the vault instructions and
follow prompts/translate.md to process the inbox.”** The Librarian reads each
capture, creates or merges a useful note into Projects, Areas, Resources, or the
appropriate Archive bucket for inactive work, updates relevant wiki indexes when
justified, moves the untouched original to `04-archive/raw`, and refreshes Home.
Both `00-raw` and the raw archive retain their append-and-move-only rules.

## Compatibility and fallback

Bookmarklets need a browser that supports JavaScript bookmarks. The preview opens
in the same tab; Back returns to the source. A site’s security policy or browser
restrictions can block the script or its local form submission. Internal browser
pages, embedded document viewers, closed shadow
DOM, and cross-origin iframe contents are outside this version’s capture scope.
Use **Load page** for a public HTML/text URL, or paste copied text directly into
Content (or press **Paste text**). Pasted text does not require a source URL.

The bookmarklet can capture readable signed-in content already on screen without
sharing browser cookies. URL loading has no browser login state and cannot
recover private/paywalled content. It accepts public IPv4 destinations, checks
redirects, and pins the resolved address; local/private network URLs are rejected.
Images remain remote Markdown references and are not downloaded for offline use.
This version does not import Obsidian templates or offer persistent highlights,
reader mode, or video transcription. Review the preview before saving.

The helper listens only on `127.0.0.1`. Its API checks the host, requesting origin,
and a per-run token. The bookmarklet submits HTML in a local form POST; it stays
out of URLs and URL history. The helper holds at most five temporary drafts in
memory for up to five minutes and redirects to a random draft ID. The editor
consumes the draft once and clears the ID from its address. Capture requires a
separate Save action before any file is written. Captured HTML is parsed without
executing scripts, previewed as editable text, and never rendered as active HTML.
Only the page you explicitly capture is transferred; there is no browsing monitor.

## Source inspection and maintenance

Inspected the upstream source on 2026-11-14:

- [Obsidian Web Clipper core API](https://github.com/obsidianmd/obsidian-clipper/blob/main/src/api.ts)
  separates document input, Defuddle extraction, templates/frontmatter, and output.
- [Page capture](https://github.com/obsidianmd/obsidian-clipper/blob/main/src/content.ts)
  reads the live document and selected HTML.
- [Obsidian output](https://github.com/obsidianmd/obsidian-clipper/blob/main/src/utils/obsidian-note-creator.ts)
  hands note content to Obsidian using its URI scheme and clipboard.
- [Defuddle](https://github.com/kepano/defuddle) is the reusable extraction and
  Markdown engine, distributed under MIT. The upstream clipper is also
  [MIT licensed](https://github.com/obsidianmd/obsidian-clipper/blob/main/LICENSE);
  its trademarks and marketing assets are excluded. This feature uses its own
  bookmarklet, UI, and file writer, and consumes Defuddle as a dependency.

The extension capture/message layer is replaced with a bookmarklet/local form POST;
Obsidian output is replaced with a direct append-only inbox writer. The same
Defuddle engine is retained. Its pinned Node Markdown module is used because
0.19.2’s public `defuddle/full` converter is a browser bundle. Recheck that boundary
when upgrading the pinned dependency. Synchronous extraction performs no async
transcript or other enrichment requests.

Run `npm test --prefix scripts/web-clipper` from the vault root. Tests use isolated
temporary inboxes and check extraction, selected passages, provenance, exclusive
concurrent saves, API protections, retry receipts, and bookmarklet handoff. They
never create test captures in the real inbox. Browser checks are a separate step.
Keep the tool source identical in both repositories except `defaults.json`.
