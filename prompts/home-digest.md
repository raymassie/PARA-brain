# Home Digest Prompt

Refresh `Home.md`'s status section so it reflects what's actually in the vault right now. All paths are relative to the vault root.

1. **Projects.** List every folder in `01-projects`. For each, read its `README.md` and pull the `**Status:**` line. If a project has no `README.md` yet, list it with status `unknown` rather than skipping it.
2. **Areas.** List every folder in `02-areas`. Areas don't carry a status field, so pull the first line under `## Current state` in each `README.md` instead. If that section is empty, leave the summary blank rather than inventing one.
3. **Resources.** List every top-level file and folder in `03-resources`. These have no status to report, this is a plain index of what exists.
4. Replace the "Status" section in `Home.md` with what you found. Keep the rest of the file (buckets, topics, working the vault) untouched.
5. If a bucket is empty, say so plainly (`No active projects.`) rather than leaving an empty heading.
6. This is a snapshot, not a place for commentary. Link each entry with a relative markdown link (`[name](01-projects/name/README.md)`) rather than a wikilink, for the same reason `Home.md`'s bucket links already do: folder READMEs share a filename and `[[wikilinks]]` can't disambiguate them.

`prompts/translate.md` and `prompts/archive-sweep.md` both run this automatically as their last step. Run it standalone any other time `Home.md` looks stale, such as after a project or area README was edited by hand.
