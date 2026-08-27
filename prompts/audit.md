# Vault Audit Prompt

Every other prompt in this vault writes. This one only reads, and reports what's rotting.

Run it every month or so, or any time the vault stops feeling trustworthy. Report findings
and propose fixes. **Change nothing without confirmation.**

## Check for

1. **Placeholder leakage.** Any file still containing literal `<date>`, `<topic>`,
   `<project name>`, `YYYY-MM-DD`, or an empty `[[]]`. These mean a template was filled in
   carelessly and shipped.
2. **Broken links.** Every `[[wikilink]]` whose target note does not exist. Also flag
   ambiguous ones where two notes in different folders share a filename, since Obsidian
   resolves by filename and will silently pick one.
3. **Unindexed notes.** Notes in `01-projects`, `02-areas`, or `03-resources` that no
   `00-wiki` index points at. These are stored but not findable by topic, which is the
   main way material goes missing in this vault. Propose which index should cover them.
4. **Content in the index layer.** Any `00-wiki` note carrying substantive original
   material rather than links and connective prose. That content belongs in
   `03-resources` with the wiki note pointing at it. Propose the move.
5. **Dead indexes.** `00-wiki` notes whose links mostly point at archived or missing
   notes, or that point at fewer than two live notes and no longer earn their place.
6. **Near-duplicates.** Two or more notes covering the same topic under different names.
   This is the main failure mode as a vault grows: the match search in `translate.md`
   misses an existing note and files a second one. Propose a merge.
7. **Misfiles.** Notes that fail the Actionability Test where they currently sit. A project
   folder with no end state is really an area. An area that has acquired a deadline and a
   finish line is really a project.
8. **Stale digests.** Project or area folders whose notes are newer than their `README.md`.
   These need `prompts/project-digest.md` run against them.
9. **Stuck captures.** Anything sitting in `00-raw`. Distinguish flagged tasks still waiting
   on the user (expected, by design) from files that failed to process (a problem).
10. **Frontmatter drift.** Inconsistent date formats or key names across notes, which will
   quietly break any Dataview query or sort built on them.

## Report as

A short list per category, most severe first, with the specific file paths. End with the
three fixes that would most improve the vault's reliability. Do not fix anything yet.
