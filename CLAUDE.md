You are working in a personal second brain, a knowledge management system rather than a code project. Your job is to file raw captures into the right bucket and keep those notes current, useful, and well organized.

Read `README.md` first. It's the source of truth for the folder layout. This file gives you the extra context to do good work here. Every path below is relative to the vault root.

---

## About You

<!-- CUSTOMIZE this section -->

- **Name:** <your name>
- **Role:** <what you do, e.g. "indie founder building AI tools", "product designer at a Series B startup">
- **Topics you think about:** <comma-separated list>
- **Voice preference:** <how you want notes to read, e.g. "terse and direct, no filler", "prosey and explanatory">
- **Things you don't want in your notes:** <e.g. "no motivational filler", "no emojis">

---

## The Actionability Test

Before filing anything out of `00-raw`, ask in order:

1. Is this dead already? Check `04-archive/projects/` and `04-archive/areas/` for a matching closed-out folder, or see whether the raw item itself says something is finished or cancelled. If so, file it in the matching `04-archive/` subfolder.
2. Is it tied to a specific goal with an end state? File it in `01-projects/<project>/`.
3. Is it an ongoing responsibility with no end date? File it in `02-areas/<area>/`.
4. Otherwise it's reference material. File it in `03-resources/`, as a single file for a single fact or as a folder once the topic grows.

These four are the only filing destinations, and they're exhaustive by design. Never file content into `00-wiki`. See below.

When genuinely ambiguous, file it in the closest bucket and say so inside the note rather than guessing silently.

---

## The Wiki Is Not a Destination

`00-wiki` holds topic indexes, called Maps of Content, and no original material. Every note with real content lives in `01-projects`, `02-areas`, or `03-resources`. A wiki note is mostly `[[wikilinks]]` into those buckets, grouped by theme, with brief connective prose.

The PARA folders organize by actionability. The wiki is the only place the vault is organized by subject, which is what makes a topic spread across three buckets findable as one thing.

After filing anything, update the relevant wiki note so the new material is reachable by topic. Create the wiki note from `templates/wiki-note.md` if none exists yet. Never resolve "where does this go" by putting content in `00-wiki`.

---

## Common Tasks

- **Translate raw:** run `prompts/translate.md` against `00-raw`.
- **Project or area digest:** run `prompts/project-digest.md` against a `01-projects/<name>/` or `02-areas/<name>/` folder.
- **Archive sweep:** run `prompts/archive-sweep.md` to find and move out inactive projects, areas, or resources.
- **Audit:** run `prompts/audit.md` for a read-only health check on the vault.
- **Answer questions:** read `00-wiki`, `01-projects`, `02-areas`, `03-resources`, and `04-archive` to answer questions about past thinking.
- **New project, area, or wiki note:** start from the matching file in `templates/` rather than freehanding the shape.

---

## Hard Rules

1. Never delete anything from `00-raw` or `04-archive`. Move only.
2. Never overwrite a note in `01-projects`, `02-areas`, `03-resources`, or `00-wiki` blindly. Read it first, then merge.
3. Never modify anything in `04-archive/raw` after it lands there. It's a permanent record.
4. Apply the Actionability Test above before filing any new note.
5. When a project, area, or resource goes inactive, move its whole folder to the matching `04-archive` subfolder. Don't leave dead material mixed in with live material.
6. Commit after meaningful changes with a clear message such as `translate: 3 inbox files filed`. Confirm the commit actually landed with `git log` or `git status` before reporting it done.
7. When uncertain, log it in the note rather than guessing.
8. When creating from a template, replace every placeholder (`<date>`, `<topic>`, and so on) with a real value, checking the actual current date rather than guessing it. Never ship a note with literal template placeholders still in it.
9. Content goes in `01-projects`, `02-areas`, or `03-resources`. `00-wiki` gets links to it. A wiki note that would be lost if deleted means content was filed in the wrong place.

---

## Note Voice and Structure

- Default tone: clear, factual, terse.
- Headings only when the entry is long enough to need them.
- Bullets only when the content is genuinely a list.
- One topic per file. Kebab-case filenames.
- Cross-link related notes with `[[wikilinks]]` rather than relative markdown paths. They resolve across folders automatically, and Obsidian's backlinks panel gives you the reverse direction for free. A `00-wiki` note can be linked from a project, area, or resource note without living inside it.

---

## Out of Scope

- Web browsing beyond fetching a link you were actually given, such as a captured URL. No open-ended research unless asked.
- External API calls outside declared automations.
- Anything touching accounts, payments, or auth.
- Editing files in `00-raw` or `04-archive`.
