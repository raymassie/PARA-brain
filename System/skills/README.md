# Workflow catalog

Read root `Librarian.md`, then load only the recipe needed for the request. These
are explicit-load Markdown workflows, usable by any assistant with the required
tools. They are not globally installed skills and do not schedule agents.

| Ask for | What it does | Recipe |
|---|---|---|
| Help customize my vault | Save optional local preferences and explain capabilities | `System/prompts/setup.md` |
| Process the inbox | File useful notes, index them, preserve originals in the raw archive | `System/prompts/translate.md` |
| Morning brief / What matters today | Evidence-backed priorities and open loops; calendar optional | `System/skills/morning-brief.md` |
| Calendar sync / Plan today | Compare an authorized schedule with stated intentions | `System/skills/calendar-sync.md` |
| Find connections | Find insights that emerge from reading filed notes together | `System/skills/connection-finder.md` |
| Surface patterns / Spark | Identify a recurring question or concern in dated material | `System/skills/pattern-surfacing.md` |
| Track beliefs | Compare new evidence with user-supplied theses | `System/skills/belief-tracker.md` |
| Compare source claims | Mark corroboration and contradictions without choosing a side | `System/skills/claim-ledger.md` |
| Weekly synthesis | Review themes, tensions, and open questions across recent notes | `System/prompts/weekly-synthesis.md` |
| Maintain my vault | Perform a bounded, authorized batch of processing and repairs | `System/skills/maintenance.md` |
| Review my project | Check goals, dates, progress evidence, and missing decisions | `System/prompts/project-review.md` |
| Check vault health | Report structural and link problems without changing files | `System/prompts/audit.md` |
| Thinking partner / Decision support / Writing help | Use reusable evidence-grounded prompts | `System/skills/vault-prompts.md` |
| Capture an idea / Write a reflection / Record a decision | Choose an optional plain Markdown shape and file it by purpose | `System/templates/README.md` |

`System/skills/vault-transaction.md` supports ingest, merges, and bulk changes.
Core filing and archive rules always take precedence. An audit or report request
does not authorize fixes; a maintenance recipe is not standing permission.

## Locations and shared conventions

- Captures: `00-raw`; processed originals: `04-archive/raw`. Both are
  append-and-move-only. Never tag, annotate, or add backlinks to an existing raw
  or archived file. Put interpretation and topic tags in its filed live note.
- Substance: `01-projects`, `02-areas`, `03-resources`, and the appropriate archive
  bucket for inactive records. Start discovery in `00-wiki`, then read its targets.
  Indexes contain only links and connective prose, never the sole copy of an idea.
- Reports: `03-resources/compound/YYYY-MM-DD-<type>.md`; weekly reports:
  `03-resources/compound/weekly/YYYY-Www.md`; audits:
  `03-resources/compound/lint/YYYY-MM-DD.md`. Use `created`, `tags`, and `sources`
  frontmatter and cite actual notes. Read an existing report before an authorized
  interactive revision; unattended runs preserve existing outputs.
- Optional shared records: `03-resources/vault-log.md`,
  `03-resources/contradictions.md`, and `03-resources/active-theses.md`. Create them
  only when an operation or user-supplied material needs them. Theses describe the
  user's stated positions, not positions inferred from clipped sources.
- Read Home, relevant topic indexes, and the end of the activity log when it
  exists. A new vault can have no history. Use explicit note/capture dates, Git
  history, and uncommitted work together. File modification times after sync or
  clone are not proof of recent thinking or project progress.
- Exclude System documents, templates, dependency trees, and previous generated
  reports as independent evidence of the user's beliefs or recurring concerns.
  Follow their cited sources instead. Do not recursively read project code.
- After authorized content writes, append a concise activity entry, index the
  output when at least two related notes justify an index, and refresh Home if
  its listing changed. Preserve manual content and generated-section boundaries.
  Framework development in this outbound repository does not create sample
  activity, project trackers, or generated outputs in the starter folders.

No fixed number of findings is required. An empty schedule, unavailable calendar,
quiet week, and unsupported inference are different outcomes; report each plainly.
Calendar access, report commands, and any future scheduling need their own setup;
see `System/scripts/README.md`. No private source vault or Obsidian plugin is required.
