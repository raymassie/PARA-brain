# Vault transaction

Trigger: translate/ingest, multi-source merge, authorized audit fixes, or edits to
three or more existing files. Read Librarian.md; preserve repository ownership and
the sealed archive. Git is optional; this recipe does not authorize a commit.

1. Read every target in full. If Git is available, inspect parent and any relevant
   nested status and record HEAD plus explicit target paths. Preserve unrelated
   edits. An in-flight target change requires careful reconciliation, not an
   automatic overwrite; ask only for a genuine unresolved conflict. Without Git,
   preserve exact before-state copies in an operation-specific backup outside the
   live notes and state the backup limitation.
2. Preview affected paths and purpose. A clean HEAD is a checkpoint; do not create
   empty commits or commit pre-existing changes without authorization. Preserve
   uncommitted target content separately before applying edits.
3. Apply the scoped work. Announce necessary scope expansion. Never reset or clean
   the working tree. Never stage a nested implementation tree in the parent repo.
4. Verify full source completeness, destinations, resolved links, indexes,
   collision-safe archive moves, claim/ledger consistency, Home, and the activity
   entry. Inspect the actual diff; explain changes to existing notes and why.
5. If the user authorized a commit, stage only the intended paths, inspect the staged
   diff and ownership boundaries, commit without including unrelated staged work,
   and verify the new commit with git log and status. Otherwise leave reviewed
   edits uncommitted and state that explicitly. Never push without authorization.

If verification fails, fix and reverify or report exactly what remains unfinished.
Never use git reset --hard as automatic recovery. Restore/revert only an authorized
operation's paths after checking subsequent and unrelated changes.

Report runners atomically create one new report and append activity; they do not
merge existing reports or modify analyzed notes. Review their output before manual
indexing, Home refresh, ledger changes, and any separately authorized commit.


For development of the outbound framework itself, verify source paths, tools,
and documentation against the clean source checkout. Keep development trackers,
example captures, and run/activity records out of the starter content. Use
isolated temporary vaults to verify content-writing workflows.
