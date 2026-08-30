# Home Digest Prompt

Refresh `Home.md`'s status section so it reflects what's actually in the vault right now. All paths are relative to the vault root.

1. **Projects.** List every project in `01-projects`, whether it's still a single file or has been promoted to a folder. For a single file, pull `status` from its frontmatter. For a folder, read its `README.md` and pull the `**Status:**` line. If a promoted project has no `README.md` yet, list it with status `unknown` rather than skipping it.
2. **Areas.** List every area in `02-areas`, single file or folder. A single file has no status field, list it by name alone. A folder's `README.md` may have a `## Current state` section; pull its first line as the summary. If that section is empty, leave the summary blank rather than inventing one.
3. **Resources.** List every top-level file and folder in `03-resources`. These have no status to report, this is a plain index of what exists.
4. Replace the "Status" section in `Home.md` with what you found. Keep the rest of the file (buckets, topics, working the vault) untouched.
5. If a bucket is empty, say so plainly (`No active projects.`) rather than leaving an empty heading.
6. This is a snapshot, not a place for commentary. Link each entry with a relative markdown link (`[name](01-projects/name/README.md)`) rather than a wikilink, for the same reason `Home.md`'s bucket links already do: folder READMEs share a filename and `[[wikilinks]]` can't disambiguate them.

`prompts/translate.md` and `prompts/archive-sweep.md` both run this automatically as their last step. Run it standalone any other time `Home.md` looks stale, such as after a project or area README was edited by hand.
