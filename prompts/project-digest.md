# Project and Area Digest Prompt

Refresh a `01-projects/<name>/` or `02-areas/<name>/` folder's `README.md` from its notes. All paths are relative to the vault root.

1. Read every file in the folder, including subfolders, except `README.md` itself.
2. Read the existing `README.md` first and update it. Don't discard history that's still relevant, such as decisions already made or context that still matters. If there's no `README.md` yet, start from `templates/project-readme.md` for projects or `templates/area-readme.md` for areas, filling in its placeholders with real values.
3. Write or update `README.md` with what it is, current status, key decisions so far, open questions, and next steps.
4. Keep it short. This is a status snapshot rather than a transcript. Link out to the individual notes with `[[wikilinks]]` for detail instead of repeating them.
