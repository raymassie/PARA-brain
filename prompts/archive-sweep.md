# Archive Sweep Prompt

Find projects, areas, and resources that look inactive and move them out of the way.

## 1. Determine what's actually stale

Do not trust filesystem mtimes. Cloning, checking out, and syncing a vault all rewrite
them, so every file can look "recently modified" when nothing has been touched in months.

Use these signals instead, in order:

- **Git history:** `git log -1 --format=%cs -- <folder>` gives the real last-change date
  for a path. This is the reliable signal. If the vault isn't a git repo, say so and fall
  back to explicit status, below.
- **Explicit status:** for a promoted project, its `README.md` with `**Status:** done`
  / `shipped` / `cancelled`. For a project still living as a single file, the same
  values in its `status` frontmatter. Either way, or a goal that plainly reads as
  accomplished, counts.
- **Content:** a folder whose notes describe something finished, superseded, or abandoned.

## 2. Propose, don't act

For each candidate, report the folder, the signal that flagged it, and its last-change
date. Never move anything without confirmation. Staleness is a judgment call and a
six-month-old area may be dormant rather than dead.

## 3. Move on confirmation

Move the whole folder, or the single file if it was never promoted to one, into the
matching `04-archive/projects/`, `04-archive/areas/`, or `04-archive/resources/`
subfolder, unchanged. Never delete, never edit contents on the way in.

If any `[[wikilinks]]` elsewhere in the vault point into the folder you moved, note them in
your report. Obsidian resolves links by filename rather than path, so most keep working,
but flag any that now point somewhere ambiguous.

## 4. Refresh the front page

Follow `prompts/home-digest.md` to bring `Home.md`'s status section current. Anything
you moved in step 3 should drop out of its listing.
