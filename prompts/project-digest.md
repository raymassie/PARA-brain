# Project and Area Digest Prompt

Refresh a project's or area's status. All paths are relative to the vault root.

If the target is still a single file in `01-projects/` or `02-areas/`, not yet a folder:

1. Read the file. Update its frontmatter (`status` for a project, or leave `type`/`tracking since` as-is for an area) and its body in place.
2. Preserve goal, start/end dates and certainty, custom fields, completed tasks,
   and evidence. Reconcile the one canonical actionable checklist or designated
   tracker link; do not create duplicate live lists or claim unverified completion.
3. If it's still a single note, there is no README to maintain. Follow
   `prompts/home-digest.md` after the update, then stop.

If the target is a `01-projects/<name>/` or `02-areas/<name>/` folder:

1. Read the existing `README.md` in full first, then the linked current actions, decisions, and supporting vault notes. Respect independent implementation repository boundaries; do not recursively ingest dependency trees, build output, or unrelated application files. Inspect a specific project artifact only when needed to verify a relevant claim, without modifying it.
2. Update the existing `README.md`. Don't discard history that's still relevant, such as decisions already made or context that still matters. Before shortening a long README, preserve that material in linked history or evidence notes. If there's no `README.md` yet, start from `templates/project-readme.md` for projects or `templates/area-readme.md` for areas, filling in its placeholders with real values.
3. Write or update `README.md` with what it is, current status, key decisions so far, open questions, and next steps.
4. Keep it short. This is a status snapshot rather than a transcript. Link out to the individual notes with `[[wikilinks]]` for detail instead of repeating them.
5. Keep one authoritative next-actions list; link to it instead of copying checklists into history, indexes, and summaries. Preserve user-reported progress as reported, separate from verified completion. Label confirmed deadlines, soft targets, and provisional dates. Never infer completion from elapsed dates or a completed communication task. If the designated live tracker or other essential source is unavailable, say what remains unverified.
6. Preserve project goal, start/end dates, certainty, and custom fields. An
   explicitly undecided date stays undecided unless new facts resolve it. Use
   `prompts/project-review.md` for material gaps; do not invent a missing answer.
7. Follow `prompts/home-digest.md` after updating status so Home stays current.
   Report changed paths, the next action, and any material unverified claim.
