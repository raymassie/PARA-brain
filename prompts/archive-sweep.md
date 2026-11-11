# Archive Sweep Prompt

Find projects, areas, and resources that look inactive and move them out of the way.

## 1. Determine what's actually stale

Do not trust filesystem mtimes. Cloning, checking out, and syncing a vault all rewrite
them, so every file can look "recently modified" when nothing has been touched in months.

Use these signals instead, in order:

- **Git history:** `git log -1 --format=%cs -- <folder>` gives the last recorded commit
  date for a path, not the date of all activity. Check uncommitted work and any nested
  project repository separately. If the vault isn't a git repo, or a path is untracked,
  say so and use dated evidence and explicit status instead; do not initialize Git.
- **Explicit status:** for a promoted project, its `README.md` with `**Status:** done`
  / `shipped` / `cancelled`. For a project still living as a single file, the same
  values in its `status` frontmatter. Either way, or a goal that plainly reads as
  accomplished, counts.
- **Content:** a folder whose notes describe something finished, superseded, or abandoned.

## 2. Propose, don't act

For each candidate, report the folder, the signal that flagged it, and its last-change
date. Never move anything without confirmation. Staleness is a judgment call and a
six-month-old area may be dormant rather than dead.

Distinguish reported completion from direct verification. A passed deadline, an old
commit, or a checked-off request to someone else does not establish completion.

## 3. Move on confirmation

Move the whole folder, or the single file if it was never promoted to one, into the
matching `04-archive/projects/`, `04-archive/areas/`, or `04-archive/resources/`
subfolder, unchanged. Never delete, never edit contents on the way in. Check
whether the destination exists before moving; choose a unique sibling name rather
than overwriting or merging into an existing archive record. Verify the destination
and preserved contents before reporting the move complete. If a move's outcome is
uncertain, inspect source and destination before retrying.

For a project containing an independent repository, preserve its `.git`, uncommitted
files, and ownership boundary. When a parent vault repository exists, maintain its
path-specific exclusions for the old and archived implementation locations before
moving anything. Do not edit the archived repository or commit on its behalf.

Check affected links in live notes, including relative Markdown links and path-qualified
wikilinks, and update them for the confirmed move. Report ambiguous targets and broken
links inside protected archives without editing those records.

## 4. Refresh the front page

Follow `prompts/home-digest.md` to bring `Home.md`'s status section current. Anything
you moved in step 3 should drop out of its listing.
