# Vault Audit Prompt

Read the vault and report structural, link, filing, and status problems. This
workflow changes nothing. Use `prompts/project-review.md` for a project's goal,
evidence, dependencies, and missing decisions.

Run it every month or so, or any time the vault stops feeling trustworthy. Report findings
and propose fixes. **Change nothing without confirmation.**

## Check for

1. **Placeholder leakage.** Any file still containing literal `<date>`, `<topic>`,
   `<project name>`, `YYYY-MM-DD`, or an empty `[[]]`. These mean a template was filled in
   carelessly and shipped. Exclude intentional examples in instructions and templates.
2. **Broken links.** Every `[[wikilink]]` or relative Markdown link whose target does not exist. Also flag
   ambiguous ones where two notes in different folders share a filename, since Obsidian
   resolves by filename and will silently pick one. Ignore example links in code blocks,
   inline code, and comments. Report protected archive issues without editing them.
3. **Unindexed notes.** Notes in `01-projects`, `02-areas`, or `03-resources` that no
   `00-wiki` index points at. These are stored but not findable by topic, which is the
   main way material goes missing in this vault. Propose which index should cover them
   when at least two related notes justify one; a lone note need not have an index.
   Exclude bucket instructions and project-owned implementation files.
4. **Content in the index layer.** Any `00-wiki` note carrying substantive original
   material rather than links and connective prose. That content belongs in
   `03-resources` with the wiki note pointing at it. Propose the move.
5. **Dead indexes.** `00-wiki` notes whose links are missing or whose grouping no
   longer helps retrieval. Links to useful archived records remain valid; an index
   can connect related material across live and archive buckets.
6. **Near-duplicates.** Two or more notes covering the same topic under different names.
   This is the main failure mode as a vault grows: the match search in `translate.md`
   misses an existing note and files a second one. Propose merges of live notes;
   leave sealed archived records intact and link related records instead.
7. **Misfiles.** Notes that fail the Actionability Test where they currently sit. A project
   folder with no end state is really an area. An area with a distinct completable
   finish line may need a project. A date alone does not determine the bucket.
8. **Stale digests.** Project/area summaries that omit or contradict current dated
   notes, decisions, task progress, or uncommitted work. Compare content and dated
   evidence; filesystem modification times after clone/sync are not reliable.
   Propose `prompts/project-digest.md` for the affected project or area.
9. **Stuck captures.** Anything sitting in `00-raw`. Distinguish flagged tasks still waiting
   on the user (expected, by design) from files that failed to process (a problem).
10. **Frontmatter drift.** Inconsistent date formats or key names across notes, which will
   quietly break any Dataview query or sort built on them.
11. **Repository boundaries.** Intentional nested repositories are valid. Check for
   project source tracked by the parent vault repo, vault notes tracked by a project
   repo, missing path-specific implementation exclusions (including archived locations),
   and ambiguous ownership or backup gaps. Ignore rules alone do not prove tracked
   files are excluded. Inspect parent and nested status separately without changing
   either; if Git is unavailable, report the limitation.
12. **Instruction drift.** `AGENTS.md` should be a regular pointer to `Librarian.md`.
   Optional tool-specific pointers must not duplicate or contradict the canonical rules.
13. **Status and action drift.** Check for duplicate live task lists, historical
   checklists presented as current, unlabeled provisional dates or soft targets,
   unsupported completion claims, and READMEs that bury current status in transcripts.
14. **Project intake gaps.** Missing or contradictory goal, start/end dates, or
   deadline/target certainty; explicitly undecided dates are valid. Check that
   actions have observable completion checks and that promotion preserved custom
   fields, original dates, completed work, evidence, and one live list.
15. **Archive integrity.** New finished captures should be separate sibling notes
   in the matching archive bucket. Flag evidence of overwrites or edits to sealed
   records, and active work classified as archived solely because history exists.

## Report as

A short list per category, most severe first, with the specific file paths. End with the
three fixes that would most improve the vault's reliability. Do not fix anything yet.
