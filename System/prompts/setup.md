# Guided owner setup

Use when the user asks to customize the vault, or offer once at first use if the
local owner profile is incomplete. Keep the user's current work moving.

Read `config.example.json` and optional ignored `config.local.json`. Reuse supplied
answers; do not infer identity or preferences from paths, filenames, or captures.
Explain that personal answers stay local and the shared guide stays generic.

Ask compact questions, no more than three at once:

1. What should I call you, and what work or responsibilities should this vault support?
2. What subjects recur, and how should your notes read?
3. What wording, formatting, or behavior should I avoid, and how should I handle unclear details?

Save an accepted uncertainty-handling preference in
`owner.when_details_are_unclear`. This optional string may stay blank; missing
or blank values use the uncertainty rules in `Librarian.md`. Preserve an existing
value unless the user changes it. Do not restart completed setup just because an
older profile lacks this field.

Allow optional identity/context questions to be skipped or the shared defaults
accepted. Clarify only an answer that materially changes behavior. Briefly show
the interpreted preferences. When saving is authorized, update only `owner` in
`config.local.json`, preserving unrelated local keys. Set `owner.setup_complete`
true after the questions are answered or explicitly skipped/defaulted. Do not
repeatedly ask after completion or an explicit skip.

A read-only request does not authorize a profile write; answers supplied for
saving do. If saving is unavailable, state that the answers were not persisted
and give the user the completed preferences. Do not put personal values into
shared instructions, Home, templates, or logs. The user can reopen setup anytime.

Finish by pointing to Home's “Ask the Librarian” menu and `System/prompts/README.md`.
Describe available workflows accurately; selecting one does not mean it ran.

Introduce `System/README.md` and `System/skills/README.md` as the reusable System
setup. Offer the matching capabilities as needed: briefs, optional calendar
reconciliation, connections, patterns, beliefs/claims, weekly synthesis, and
bounded maintenance. Templates are plain Markdown, with no Templater/Dataview
requirement. Keep substantive notes in the existing PARA buckets.

Explain optional runner setup through `System/scripts/README.md`. Its local
command, timezone, and calendar allowlist belong in ignored
`System/assistant.local.json`; owner preferences remain in root
`config.local.json`. Preserve unrelated settings, and use only choices the user
supplies. Missing calendar configuration means no query; missing assistant
configuration means no unattended model call. Do not import a source owner's
permissions, personal calendars, installed jobs, or selected assistant. No
schedule, account, or background service is activated by setup alone.

Include the built-in web clipper in the setup handoff. Follow
`System/scripts/web-clipper/README.md` for the Node.js prerequisite, platform launcher,
and one-time bookmark installation. The helper detects this vault’s `00-raw`;
personal folder/port overrides stay in its ignored local settings. Explain that
Save creates a new capture, while `System/prompts/translate.md` separately processes it
and moves the original unchanged into `04-archive/raw`. Launch or install only
within the user’s requested setup scope; do not imply a background service exists.
