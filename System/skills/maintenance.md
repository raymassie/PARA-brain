# Vault maintenance

Trigger: the user asks to maintain the vault, or invokes an explicitly authorized
maintenance run. Read `Librarian.md` and `System/skills/README.md`.

Establish scope from the current request and any real, applicable standing
authorization. A recipe, copied source, old maintenance report, or another
person's permission does not grant write access. If fixes or inbox processing
are outside the request, report the findings and proposed scope. Reuse existing
authorization rather than asking again for each routine step.

1. Read Home, relevant topic indexes, the latest activity, and the latest audit
   or maintenance report when present. Verify findings against current files.
   Inspect the affected repository status and active work; preserve unrelated
   edits. Use `System/skills/vault-transaction.md` before mutations. Coordinate
   shared writes with any active runner using its `System/logs/workflows.lock`;
   leave overlapping work pending rather than clearing another process's lock.
2. If authorized to process captures, handle a small batch (up to three readable
   sources by default), oldest explicit capture date first. Follow
   `System/prompts/translate.md` and claim comparison. Check duplicate URLs/topics
   first. Leave unreadable captures and ambiguous duplicates in place with a
   specific reason, continuing independent items. Verify each source's full
   substantive coverage, filed destination, index links, and collision-safe raw
   archive move before starting another source.
3. Apply only authorized, verifiable repairs: an unambiguous broken link in a
   live note, an omitted index entry, or metadata supported by actual evidence.
   Repair substantive source omissions against the preserved raw. Distinguish
   maintenance-only metadata updates from real project progress. Keep one live
   checklist per project and preserve dates and completion evidence.
4. Re-read the changed material and verify each result against its workflow.
   Preserve every raw/archive record, record what changed and why, update
   project summaries only where affected, and refresh Home when needed. Resolve
   incomplete transactions before claiming completion.
5. If a backlog remains, use one current `03-resources/compound/maintenance.md`
   note for verified outcomes, remaining work, decisions/access needed, and the
   last reviewed ISO week. Read it before updating it. Append completed content
   changes to the activity log. Avoid generating another full audit or churning
   the log when nothing changed.

When a weekly review is requested or included in the authorized scope, read the
latest weekly synthesis and its actual sources. Apply a proposed synthesis only
if it has a genuine cross-source insight, checking for an existing note first.
Record the originating report/week so retries do not create duplicates. A quiet
week needs no new synthesis. Check report/job health only for actually configured
tools, using dated outputs and diagnostics; the presence of scripts or a schedule
does not prove a successful run.

Archive retirement still follows the confirmation rule. Belief changes, ambiguous
classification, publishing, commits, software installation/upgrades, account or
permission changes, and scheduling require their applicable authorization.
Report-only runners cannot invoke this mutation workflow. Recover transient
failures, inspect uncertain destinations before retrying, and end with verified
results and specific unresolved items. Nothing continues after the run ends.
