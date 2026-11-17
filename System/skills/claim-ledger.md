# Claim ledger

Trigger: translate of substantive source claims, multi-source merge, synthesis,
or weekly synthesis. Read `System/skills/README.md`.

Before finalizing claims, follow topic indexes into relevant filed notes and read
what their sources assert. Append one marker to each substantive Key Claim in
the destination content note (never in an index or sealed raw source):
- `[new]` when no matching claim is found in the vault.
- `[corroborates: [[note]]]` for agreement; identify whether the source is independent.
- `[CONTRADICTS: [[note]]]` for incompatible assertions.

Don't force claim sections onto bare tasks, inventories, or simple factual captures.
Do not decide which conflicting source is right. Preserve source attribution,
dates, and uncertainty. If a link would be ambiguous, use an unambiguous vault-path
wikilink rather than silently resolving to the wrong filename.

For every contradiction, create or update a matching entry in
`03-resources/contradictions.md`: date, links to both notes, Claim A, Claim B,
what is incompatible, and Status: open. Check for an existing pair/claim before
adding an entry. Keep this substantive ledger out of `00-wiki` and index it under
the relevant topic when the existing threshold is met.

Append the count or “no contradictions found” to `03-resources/vault-log.md`.
Verify every marked contradiction has a ledger entry and every marker link resolves.
Weekly synthesis may suggest theses for claims supported by two independent
sources or conflicts still open after two ingests; the user decides whether to adopt.

Unattended runners write only their report and activity line: record proposed
ledger entries in the report for manual application, without modifying source
notes, the ledger, indexes, or theses.
