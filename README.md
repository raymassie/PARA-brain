# PARA-brain

A second brain: dump raw stuff in, an AI agent cleans it up and files it, you read the result. No manual filing, no folder maintenance beyond what the agent does for you.

It combines two ideas:

- **[SimpleBrain](https://github.com/BuildGreatProducts/SimpleBrain)**: capture into an inbox, let an AI agent turn it into clean notes.
- **[PARA](https://fortelabs.com/blog/para/)**: file by *actionability* (what you're going to do with something) rather than by subject. Four buckets: Projects (has a completable finish line), Areas (ongoing, no end date), Resources (reference material), Archive (inactive).

For optional specialist agents, a local task desk, and report tools, see
[PARA-workbench](https://github.com/raymassie/PARA-workbench). This repository
keeps the plain Markdown foundation; both use the same model-neutral guide.

Every path in this vault's documentation is relative to the vault root.

## Setup

1. Copy this whole folder. It's your vault.
2. Read [Librarian.md](Librarian.md), the canonical guide. Ask your assistant to follow `prompts/setup.md` for optional name, role, and note preferences, saved locally in ignored `config.local.json`. You can keep the shared defaults or skip optional questions. [AGENTS.md](AGENTS.md) is a regular pointer, not a second guide.
3. Decide how to back up and version your notes. Git is optional; if you choose it, establish the ownership boundaries below before initializing or committing. An agent must not initialize a repository or commit or push without your authorization. Without Git, use explicit status and dated evidence for archive decisions.
4. Open the folder as an Obsidian vault. The notes are plain markdown and readable anywhere, but `[[wikilinks]]`, backlinks, and graph view are what make `00-wiki` navigable. Logseq, Foam, and Dendron work too. See "Other tools" below.
5. Give your chosen assistant access to the vault and explicitly ask it to read `AGENTS.md`, `Librarian.md`, and `README.md`, then the prompt for the task. For example: "Read the vault instructions, then follow prompts/translate.md to process the inbox." File discovery and read/write access vary by tool; do not assume a filename or an attachment automatically loads the whole vault. If the assistant cannot access a required source or save changes, it should say so rather than claim the task was done.

## Folders

`Home.md` is the vault's start page, alongside the top-level instructions and setup documentation. Each bucket has a short `README.md` explaining what belongs there. Those are static signs on the door, not project status trackers.

- `00-raw`: drop anything here as you capture it, including notes, screenshots, links, and voice memos. Don't sort it yourself. That's the agent's job.
- `00-wiki`: topic indexes, and no content of its own. Each note is mostly `[[wikilinks]]` into the buckets below, grouped by subject. Nothing gets filed here. New indexes start from `templates/wiki-note.md`. The vault's start page, `Home.md`, lives at the top level, not in here.
- `01-projects`: anything with a specific goal and a completable finish line (Projects); a scheduled end date can be undecided. Starts as a single file from `templates/project-note.md`, status in its frontmatter. Promoted to `01-projects/<project>/` with a status `README.md` from `templates/project-readme.md` once a second note shows up, kept current with `prompts/project-digest.md`.
- `02-areas`: ongoing responsibilities with no end date (Areas), such as health, finances, or a role at work. Same pattern as projects: single file first, promoted to a folder with a `README.md` once it needs one.
- `03-resources`: reference material (Resources). A single fact is a single file; a topic with enough material becomes a folder. This is the default home for anything that isn't a project or an area.
- `04-archive/`: everything inactive (Archive). Processed captures as a permanent record, plus dead folders moved here whole from projects, areas, or resources.

Project and area status READMEs are living documents once they exist. A project or area still living as a single file has no README to maintain, it's just a note with frontmatter. The rest are written once and left alone.

## How the wiki works

The wiki is an index, not a bucket. Nothing is filed into it.

PARA organizes by actionability, which is what makes it good at answering "what should I be working on." It's bad at answering "what do I know about X," because a single subject scatters across a project, an area, and a handful of resource notes. `00-wiki` is the fix: one note per topic, mostly `[[wikilinks]]` into the three live buckets, grouped by theme, with brief prose on how the pieces relate. A library card catalog, which tells you where things are without holding them.

`prompts/translate.md` maintains it. After filing a note, it finds or creates that topic's index and links the new material in. Obsidian's backlinks panel and graph view do the rest, so a link only needs to exist on one side.

The test for whether something belongs in a wiki note: if deleting the file would lose information, it's in the wrong place. An index should be reconstructable from the notes it points at.

## Using it day to day

1. **Capture.** Write or drop anything into `00-raw`. Don't think about where it goes.
2. **Process.** Ask your agent to run `prompts/translate.md`. It reads `00-raw`, decides what each item is for, files a clean note into `01-projects`, `02-areas`, `03-resources`, or the matching archive bucket for finished material, links it into the right `00-wiki` topic index, then moves the original into `04-archive/raw/`.
3. **Review.** Start at `Home.md` for a snapshot of what's active, or `00-wiki` when you want everything on one subject regardless of which bucket it landed in.
4. **Digest.** Ask your agent to run `prompts/project-digest.md` on a project folder any time you want its README brought up to date.
5. **Retire.** When a project finishes, an area winds down, or a resource stops being useful, run `prompts/archive-sweep.md`. It finds inactive folders, confirms with you, then moves them into the matching `04-archive` subfolder.
6. **Audit.** Once a month, run `prompts/audit.md`. See "Keeping it honest" below.
7. **Front page.** Steps 2 and 5 already keep `Home.md` current on their own. Run `prompts/home-digest.md` by itself only if it falls out of date some other way.

If a note ends up in the wrong bucket, ask your assistant to correct its placement and affected live links. The filing rules are in `Librarian.md`.

## Projects and checklists

Before creating a project, the assistant gathers the goal, start date, end date,
and deadline/target certainty using `prompts/project-intake.md`. It reuses answers
you already gave; an explicitly undecided date is valid. A finish line distinguishes
a project from an ongoing area.

Each project has one plain Markdown checkbox list in its note or README, or a link
to your designated live tracker. Tasks state concrete actions and completion checks.
Ask for a status refresh after work or use `prompts/project-review.md` to check the
goal, evidence, blockers, and missing decisions. Reviews are read-only unless you
authorize corrections. Completion of a list still needs confirmation of the goal.

## Prompts

Ask in plain language; `prompts/README.md` is the complete workflow menu.

- `prompts/setup.md`: save optional local owner preferences.
- `prompts/project-intake.md`: start a project with a goal, dates, and actions.
- `prompts/project-review.md`: check project coherence, evidence, and blockers.
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

Run `prompts/audit.md` monthly for a read-only check of links, filing, duplicates,
status, and repository boundaries. Review its findings and authorize the fixes you
want. Use `prompts/project-review.md` for a project's goal, evidence, and next actions.

## Version control

If you use a root Git repository, it owns vault material: notes, status summaries, wiki indexes, context, decisions, instructions, templates, and prompts. Project source, tests, assets, build configuration, and implementation documentation may stay physically under `01-projects/<project>/` in their own independent repositories. Neither repository should absorb the other's files. Intentional nested repositories are valid.

For a new project, a layout such as this keeps the boundary clear:

```text
01-projects/example-project/
  README.md          # vault-owned status summary
  decisions.md       # vault-owned context
  implementation/    # Independent project repository, with its own .git
```

In the parent vault repository, exclude each implementation tree explicitly. For the example above, the root `.gitignore` entry would be `/01-projects/example-project/implementation/`. If the project is later archived, add the corresponding `/04-archive/projects/example-project/implementation/` exclusion before the move. These are examples, not blanket exclusions for all project notes. Apply the same boundary to project-owned implementation bundles that do not yet have their own repository.

Ignore rules do not remove files already tracked. Inspect parent tracking and both repositories' status and staged files separately before committing. A clean parent says nothing about uncommitted child work. Keep vault notes outside the child source root for new projects. If an existing mixed root contains vault notes, protect those notes from project commits with repository-specific exclusions and document any backup gap: a parent cannot reclaim a note inside a wholly ignored tree simply by adding an exception. Propose a specific fix instead of moving source, deleting `.git`, duplicating notes, or silently changing ownership.

Only commit or push when the user has authorized it, and stage the intended files explicitly. Git history shows recorded commits, not all real activity; uncommitted work and sync state also matter. Without Git, state the limitation and use dated evidence and explicit status. Backups remain necessary for anything not versioned.

## A note on binaries and sync

Processed captures land in `04-archive/raw/` permanently. For text that's free. For screenshots, voice memos, and video it isn't: git stores every version forever, and a vault fed from a phone camera will reach gigabytes. Either keep large media out of the vault and capture a text description instead, or add `04-archive/raw/*.mp4` and similar patterns to `.gitignore` and accept that those files aren't versioned.

If you sync this vault across devices (Obsidian Sync, iCloud, Dropbox) *and* use git, run the agent on one device at a time. A sync client and a git checkout writing the same files concurrently produce conflicts that are tedious to untangle.

## Optional local preferences

`config.example.json` contains owner-only defaults. Guided setup saves accepted
answers to ignored `config.local.json`, preserving any unrelated local keys. Keep
personal values out of shared instructions and templates. No setup script, service,
or background process is required; the core is Markdown files and folders.

## Other tools

The vault is plain markdown in plain folders, so any editor can read it. The one hard dependency is `[[wikilinks]]`, which need a tool that resolves them: **Obsidian**, **Logseq**, **Foam** (VS Code), or **Dendron**. Plain markdown viewers, including GitHub's web interface, render `[[like this]]` as literal text and won't link anything.

If you'd rather keep it universally readable, change the linking rule in `Librarian.md` and `prompts/translate.md` to relative markdown links (`[text](../00-wiki/note.md)`). Backlinks and graph support then depend on your editor, while links render in standard Markdown viewers.

Hosted tools need a connector or an import/export workflow that preserves the vault's files and links. Access to a hosted document alone is not access to the local vault. Confirm what your tool can read and write before using it for maintenance.

No particular AI provider, model, command-line tool, or editor is required. Use an assistant that can follow the shared instructions and has the file access needed for the task. If a tool requires a vendor-specific startup file, keep it as an optional thin pointer to `Librarian.md`; do not fork the rules into a separate guide.
