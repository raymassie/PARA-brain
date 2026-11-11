# Guided owner setup

Use when the user asks to customize the vault, or offer once at first use if the
local owner profile is incomplete. Keep the user's current work moving.

Read `config.example.json` and optional ignored `config.local.json`. Reuse supplied
answers; do not infer identity or preferences from paths, filenames, or captures.
Explain that personal answers stay local and the shared guide stays generic.

Ask compact questions, no more than three at once:

1. What should I call you, and what work or responsibilities should this vault support?
2. What subjects recur, and how should your notes read?
3. What wording, formatting, or behavior should I avoid?

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

Finish by pointing to Home's “Ask the Librarian” menu and `prompts/README.md`.
Describe available workflows accurately; selecting one does not mean it ran.
