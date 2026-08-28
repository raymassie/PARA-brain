# Translation Prompt

Read every file in `00-raw`. Process each one fully before moving to the next. All paths are relative to the vault root.

## 1. Get the content

- Text and markdown files: read as-is.
- Screenshots and images: read what's actually on them and extract the real information. Don't just note that an image was captured. If your tooling can't read images, say so and leave the file in `00-raw` rather than guessing at its contents.
- Links: fetch the page if you can. Otherwise file the URL with whatever context came with it.
- Voice memo transcripts: treat as text.
- Large binaries such as video, long audio, or big PDFs: extract what you need, then say so in the summary and ask before archiving the original into git. See the note on binaries in `README.md`.
- If a file's content can't be recovered because it's corrupt or unreadable, say so in the summary and leave it in `00-raw` rather than silently archiving something you couldn't process.

## 2. Split it

A single capture can hold more than one idea. A voice memo covering a work update, a book title, and a birthday reminder is three separate items. Split before filing. Don't force one raw file into one note if it doesn't fit.

## 3. File each item

For each idea, apply the Actionability Test in `CLAUDE.md`, then:

- **Check for an existing match first.** Look through the target bucket for a note or folder already about this. Match on topic rather than exact wording. "Sourdough" and "bread starter" are the same note.
- If a match exists, merge into it. Read it first, add what's new, don't overwrite what's there.
- If no match exists, create one. There are three destinations, and `00-wiki` is not among them:
  - `01-projects/<project>/`: new folder with `README.md` started from `templates/project-readme.md`, then the note itself alongside it.
  - `02-areas/<area>/`: new folder, plus `README.md` started from `templates/area-readme.md` if the area is worth a status snapshot, then the note itself.
  - `03-resources/`: a single kebab-case markdown file for a single fact, or a folder once the topic has enough material to need internal structure. There is no size threshold to clear before something can go here.
- Whichever you start from, replace every placeholder with a real value, using the actual current date and an actual title. Never leave literal `<date>` or `<topic>` text in a filed note.
- A bare task with no lasting reference value, such as "call the dentist," is neither wiki nor resource material. Don't manufacture a note for it. Call it out separately in the summary so it doesn't vanish, and leave its raw file in `00-raw` as described in step 5.
- Skip trivial fragments such as a stray word or a dead link with no context rather than manufacturing a note for them. Mention what you skipped and why in the summary.

## 4. Index it

Filing a note makes it stored. Indexing makes it findable. Do both.

For each note you filed, find or create its topic index in `00-wiki`:

- **Find the topic.** Look for an existing `00-wiki` note covering this subject. Match on subject rather than filename.
- **If one exists,** add a `[[wikilink]]` to the new note under the right heading, and update the connective prose if the new material changes how the pieces relate.
- **If none exists,** decide whether the topic has enough around it to be worth indexing. A subject with one lone note doesn't need an index yet. Two or more related notes across any buckets does. Create it from `templates/wiki-note.md`, then add a `[[wikilink]]` to it under Topics in `00-wiki/index.md` so it's reachable from the vault's start page.
- **Never put the content itself in `00-wiki`.** The index links to material in `01-projects`, `02-areas`, and `03-resources`. If you find yourself writing something substantive into a wiki note, it belongs in `03-resources` and the wiki note should link to it.

While you're there, search the live buckets for anything else related and link that too. You only need the link on one side, since Obsidian's backlinks panel shows the reverse direction automatically.

This step is what turns a pile of correctly-filed notes into something you can actually navigate. Don't skip it.

## 5. Archive

Once every idea from a raw file has been filed, or deliberately skipped as trivial, move the original into `04-archive/raw/`. A skip is a decision rather than a failure to process, so it still counts as done.

**Rename on the way in: prefix the filename with today's date, as `YYYY-MM-DD-<original-name>`.** Captures arrive with names that repeat constantly, such as `IMG_1043.jpg`, `Recording.m4a`, or `note.md`, and archiving them under their original names would silently overwrite an earlier capture. If a date-prefixed name still collides, append `-2`, `-3`, and so on. Check before every move and never overwrite a file already in the archive.

A flagged task is different. Leave that raw file sitting in `00-raw` rather than archiving it. It isn't finished, it's waiting on the user rather than on a filing decision. It'll surface again on future runs until they either handle it and clear it out, or tell you it's resolved so you can archive it then.

Never delete anything from `00-raw`.

## 6. Report

End with a short summary: what got filed where, what was merged versus newly created, which wiki indexes you updated or created, what was skipped, any tasks flagged for the user, and anything ambiguous enough to need a second look.
