# PARA-brain

A second brain: dump raw stuff in, an AI agent cleans it up and files it, you read the result. No manual filing, no folder maintenance beyond what the agent does for you.

It combines two ideas:

- **[SimpleBrain](https://github.com/BuildGreatProducts/SimpleBrain)**: capture into an inbox, let an AI agent turn it into clean notes.
- **[PARA](https://fortelabs.com/blog/para/)**: file by *actionability* (what you're going to do with something) rather than by subject. Four buckets: Projects (has an end date), Areas (ongoing, no end date), Resources (reference material), Archive (inactive).

Every path in this vault's documentation is relative to the vault root.

## Setup

1. Copy this whole folder. It's your vault.
2. Open `CLAUDE.md` and fill in the "About You" section: name, role, how you want notes to sound. `AGENTS.md` is a symlink to it, so any agent looking for either filename sees the same content.
3. Run `git init` if the folder isn't already a repo. Version control is the safety net behind the "nothing is ever lost" promise, and `prompts/archive-sweep.md` reads git history to tell what's genuinely stale.
4. Open the folder as an Obsidian vault. The notes are plain markdown and readable anywhere, but `[[wikilinks]]`, backlinks, and graph view are what make `00-wiki` navigable. Logseq, Foam, and Dendron work too. See "Other tools" below.
5. Point your AI agent at the folder and have it read `CLAUDE.md` first. In Claude Code that's `claude` from inside the folder, then `run prompts/translate.md`.

## Folders

There's one file at the top level, `Home.md`, the vault's start page with links into each bucket below. Everything else here is a folder, each with its own short `README.md` explaining what belongs there. Those are static signs on the door, not something you maintain.

- `00-raw`: drop anything here as you capture it, including notes, screenshots, links, and voice memos. Don't sort it yourself. That's the agent's job.
- `00-wiki`: topic indexes, and no content of its own. Each note is mostly `[[wikilinks]]` into the buckets below, grouped by subject. Nothing gets filed here. New indexes start from `templates/wiki-note.md`. The vault's start page, `Home.md`, lives at the top level, not in here.
- `01-projects/<project>`: anything with a specific goal and an end date (Projects). One folder per project, each with its own status `README.md` from `templates/project-readme.md`, kept current with `prompts/project-digest.md`.
- `02-areas/<area>`: ongoing responsibilities with no end date (Areas), such as health, finances, or a role at work. Can have a status `README.md` too, from `templates/area-readme.md`.
- `03-resources`: reference material (Resources). A single fact is a single file; a topic with enough material becomes a folder. This is the default home for anything that isn't a project or an area.
- `04-archive/`: everything inactive (Archive). Processed captures as a permanent record, plus dead folders moved here whole from projects, areas, or resources.

Project and area status READMEs are living documents. The rest are written once and left alone.

## How the wiki works

The wiki is an index, not a bucket. Nothing is filed into it.

PARA organizes by actionability, which is what makes it good at answering "what should I be working on." It's bad at answering "what do I know about X," because a single subject scatters across a project, an area, and a handful of resource notes. `00-wiki` is the fix: one note per topic, mostly `[[wikilinks]]` into the three live buckets, grouped by theme, with brief prose on how the pieces relate. A library card catalog, which tells you where things are without holding them.

`prompts/translate.md` maintains it. After filing a note, it finds or creates that topic's index and links the new material in. Obsidian's backlinks panel and graph view do the rest, so a link only needs to exist on one side.

The test for whether something belongs in a wiki note: if deleting the file would lose information, it's in the wrong place. An index should be reconstructable from the notes it points at.

## Using it day to day

1. **Capture.** Write or drop anything into `00-raw`. Don't think about where it goes.
2. **Process.** Ask your agent to run `prompts/translate.md`. It reads `00-raw`, decides what each item is for, files a clean note into `01-projects`, `02-areas`, or `03-resources`, links it into the right `00-wiki` topic index, then moves the original into `04-archive/raw/`.
3. **Review.** Start at `Home.md` for a snapshot of what's active, or `00-wiki` when you want everything on one subject regardless of which bucket it landed in.
4. **Digest.** Ask your agent to run `prompts/project-digest.md` on a project folder any time you want its README brought up to date.
5. **Retire.** When a project finishes, an area winds down, or a resource stops being useful, run `prompts/archive-sweep.md`. It finds inactive folders, confirms with you, then moves them into the matching `04-archive` subfolder.
6. **Audit.** Once a month, run `prompts/audit.md`. See "Keeping it honest" below.
7. **Front page.** Steps 2 and 5 already keep `Home.md` current on their own. Run `prompts/home-digest.md` by itself only if it falls out of date some other way.

You never file anything by hand. If a note ends up in the wrong bucket, tell your agent and it'll move it. The rule it's following is in `CLAUDE.md`.

## Prompts

- `prompts/translate.md`: process `00-raw` into filed notes. Run whenever the inbox has piled up.
- `prompts/project-digest.md`: refresh a project's or area's README from its notes.
- `prompts/archive-sweep.md`: find and retire inactive projects, areas, and resources.
- `prompts/audit.md`: read-only health check for broken links, duplicates, misfiles, and orphans. Run monthly.
- `prompts/home-digest.md`: refresh `Home.md`'s status section with what's actually in each bucket. Runs automatically at the end of `translate.md` and `archive-sweep.md`; run it by hand if `Home.md` looks stale for any other reason.

## Templates

See `templates/README.md` for what each one is and where its output lands.

- `templates/project-readme.md`: shape of a `01-projects/<project>/README.md`.
- `templates/area-readme.md`: shape of a `02-areas/<area>/README.md`.
- `templates/wiki-note.md`: shape of a `00-wiki` topic index.

Notes in `03-resources` are free-form and have no template.

## Keeping it honest

Everything above writes to the vault. Nothing above checks it, and a second brain that quietly degrades is worse than none, because you trust it. `prompts/audit.md` is the counterweight. Run it monthly, read what it found, fix the top few things. Skipping it is how you end up with three notes on the same topic and a link graph full of holes.

## Version control

The whole folder should be a git repo. Commit after each batch of captures. Two things depend on it: recovering from a bad merge or a misfile, and `prompts/archive-sweep.md`, which uses git history to tell what's genuinely stale. Filesystem timestamps lie after any clone or sync.

## A note on binaries and sync

Processed captures land in `04-archive/raw/` permanently. For text that's free. For screenshots, voice memos, and video it isn't: git stores every version forever, and a vault fed from a phone camera will reach gigabytes. Either keep large media out of the vault and capture a text description instead, or add `04-archive/raw/*.mp4` and similar patterns to `.gitignore` and accept that those files aren't versioned.

If you sync this vault across devices (Obsidian Sync, iCloud, Dropbox) *and* use git, run the agent on one device at a time. A sync client and a git checkout writing the same files concurrently produce conflicts that are tedious to untangle.

## Other tools

The vault is plain markdown in plain folders, so any editor can read it. The one hard dependency is `[[wikilinks]]`, which need a tool that resolves them: **Obsidian**, **Logseq**, **Foam** (VS Code), or **Dendron**. Plain markdown viewers, including GitHub's web interface, render `[[like this]]` as literal text and won't link anything.

If you'd rather keep it universally readable, change the linking rule in `CLAUDE.md` and `prompts/translate.md` to relative markdown links (`[text](../00-wiki/note.md)`). You lose backlinks and graph view and gain rendering everywhere.

Notion, Evernote, and similar hosted apps can't be used directly. They store notes in a database rather than files on disk, so an agent has no folder to point at. You'd be importing and exporting on every cycle, which defeats the loop.

Any agent that reads `CLAUDE.md` or `AGENTS.md` works: Claude Code, Cursor, Codex, Copilot, Gemini CLI, and others.
