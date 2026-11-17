# Templates

Starting shapes for the files agents create in this vault. You will rarely open this folder yourself. `System/prompts/translate.md` and `System/prompts/project-digest.md` read from it when they need to create something new.

| Template | Used when creating | Lands in |
|---|---|---|
| `project-note.md` | a project's first note | `01-projects/<name>.md` |
| `project-readme.md` | a project's status file, once it's promoted | `01-projects/<project>/README.md` |
| `area-note.md` | an area's first note | `02-areas/<name>.md` |
| `area-readme.md` | an area's status file, once it's promoted | `02-areas/<area>/README.md` |
| `wiki-note.md` | a new topic index (Map of Content) | `00-wiki/<topic>.md` |

Projects and areas start as a single file and only get promoted to a folder with a
`README.md` once a second note joins the first. `System/prompts/project-digest.md` and
`System/prompts/translate.md` both know how to do that promotion.

Resources are free-form. The optional shapes below can help when a note needs
structure; they do not make a format mandatory. Resource folders do not get a
README, since the topic index already supplies navigation.

Every placeholder in these files (`<project name>`, `YYYY-MM-DD`, and so on) must be replaced with a real value before a filed note is saved. See Rule 8 in `Librarian.md`. Unknown facts should be labeled unknown rather than invented; template and instruction examples may retain placeholders.

Before creating an active project, follow `System/prompts/project-intake.md` for its goal,
start/end dates and date certainty. Explicit `undecided` is a filled date answer.
Keep one actionable checklist in the project note or README, or link its designated
live tracker. Promotion carries forward custom fields, original dates, completed
work, evidence, and that same list; it does not create another live tracker.

## Optional capture and reflection shapes

These adapt BRAIN's System templates into plain Markdown. No Templater commands,
Dataview queries, owner information, invented dates, or special wiki content layer
is required. Choose only a shape that helps the requested note. Replace its
placeholders with actual values or explicit uncertainty, and remove unused sections.

| Template | Purpose | Destination |
|---|---|---|
| `quick-idea.md` | Preserve a new thought with context | New file in `00-raw` |
| `daily-note.md` | Dated intentions and reflection | An optional journal area in `02-areas` |
| `weekly-review.md` | Personal review of a week | Its related area/project; not a generated weekly synthesis |
| `monthly-review.md` | Review progress and lessons for a month | Its related area/project |
| `annual-review.md` | Review a year's changes and direction | Its related area |
| `decision-log.md` | Record options, evidence, decision, and review | The project/area it serves, otherwise `03-resources` |
| `source-note.md` | Attribute a substantive article/literature source | Its actionability bucket, usually `03-resources` |
| `insight-note.md` | Express an atomic idea, concept, or synthesis | Its actionability bucket, usually `03-resources` |
| `learning-note.md` | Track practice and understanding | A bounded learning project or ongoing learning area |
| `resource.md` | Optional reference shape | `03-resources` |

A source/insight template does not grant permission to create a note. Apply
Librarian's filing test, update a matching live note before making another, and
index related material when the existing threshold is met. BRAIN's source,
entity, concept, synthesis, and permanent-note ideas use these substantive shapes;
`wiki-note.md` remains an index only. Do not create duplicate topic indexes or a
new top-level journal/permanent-note bucket. Keep live tasks in the existing
canonical project checklist.
