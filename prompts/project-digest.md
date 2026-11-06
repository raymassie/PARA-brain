# Project and Area Digest Prompt

Refresh a project's or area's status. All paths are relative to the vault root.

If the target is still a single file in `01-projects/` or `02-areas/`, not yet a folder:

1. Read the file. Update its frontmatter (`status` for a project, or leave `type`/`tracking since` as-is for an area) and its body in place.
2. If it's still a single note, stop here. There's no README to maintain yet.

If the target is a `01-projects/<name>/` or `02-areas/<name>/` folder:

1. Read the existing `README.md` in full first, then the linked current actions, decisions, and supporting Brain notes. Respect independent implementation repository boundaries; do not recursively ingest dependency trees, build output, or unrelated application files. Inspect a specific project artifact only when needed to verify a relevant claim, without modifying it.
2. Update the existing `README.md`. Don't discard history that's still relevant, such as decisions already made or context that still matters. Before shortening a long README, preserve that material in linked history or evidence notes. If there's no `README.md` yet, start from `templates/project-readme.md` for projects or `templates/area-readme.md` for areas, filling in its placeholders with real values.
3. Write or update `README.md` with what it is, current status, key decisions so far, open questions, and next steps.
4. Keep it short. This is a status snapshot rather than a transcript. Link out to the individual notes with `[[wikilinks]]` for detail instead of repeating them.
5. Keep one authoritative next-actions list; link to it instead of copying checklists into history, indexes, and summaries. Preserve user-reported progress as reported, separate from verified completion. Label confirmed deadlines, soft targets, and provisional dates. Never infer completion from elapsed dates or a completed communication task. If the designated live tracker or other essential source is unavailable, say what remains unverified.
