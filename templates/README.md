# Templates

Starting shapes for the files agents create in this vault. You will rarely open this folder yourself. `prompts/translate.md` and `prompts/project-digest.md` read from it when they need to create something new.

| Template | Used when creating | Lands in |
|---|---|---|
| `project-readme.md` | a new project's status file | `01-projects/<project>/README.md` |
| `area-readme.md` | a new area's status file | `02-areas/<area>/README.md` |
| `wiki-note.md` | a new topic index (Map of Content) | `00-wiki/<topic>.md` |

Notes in `03-resources` have no template. They're free-form by design.

Every placeholder in these files (`<project name>`, `YYYY-MM-DD`, and so on) must be replaced with a real value before the file is saved. See Hard Rule 8 in `CLAUDE.md`.
