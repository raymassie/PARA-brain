# Belief tracker

Trigger: “Track beliefs” or “Belief update”. Read `System/skills/README.md`.
Read the user's stated theses from `03-resources/active-theses.md`, if present.
If absent or empty, report that no theses are configured; do not infer beliefs
from captured articles or create a blank theses file.

Read relevant additions from the last seven days. For each material piece of
evidence, cite the specific claim and note and assess CONFIRMS or CHALLENGES.
Skip irrelevant material. Grade challenges MINOR / MODERATE / SIGNIFICANT and
recommend UPDATE / INVESTIGATE / ACKNOWLEDGE where justified. Distinguish a
source's assertion from the user's own position and independent corroboration from
several copies of the same claim.

Save `03-resources/compound/YYYY-MM-DD-belief-tracker.md` with confirmed evidence,
challenged evidence, and exact thesis wording changes recommended. The user curates
theses: propose changes, do not write them automatically. Use shared logging and
indexing conventions. If nothing changes a belief, say so without padding.
