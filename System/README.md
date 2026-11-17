# System

The reusable operating setup for this vault: workflows, templates, local tools,
and optional assistant settings. Your captured material and substantive notes
stay in the numbered PARA folders. `Librarian.md` at the vault root remains the
canonical policy; any assistant with the required file access can follow it.

## Start here

1. Read the root `Librarian.md` and `README.md`.
2. Ask your assistant to follow `System/prompts/setup.md` for optional owner
   preferences. Existing completed setup does not need to run again.
3. Use the [workflow catalog](skills/README.md) to choose a capability, or the
   [core prompt menu](prompts/README.md) to process, review, or archive notes.
4. Use the [template catalog](templates/README.md) for a suitable starting shape.
   The templates are plain Markdown; no template plugin is required.
5. Set up only the tools you want. The [web clipper](scripts/web-clipper/README.md)
   needs Node.js 22+ and an open terminal window. The [optional report runners](scripts/README.md)
   need Python and your own explicitly configured assistant command. Interactive
   use of the Markdown workflows needs neither runner.

| Location | Purpose |
|---|---|
| `prompts/` | Core vault setup, filing, project, audit, and weekly workflows |
| `skills/` | Briefs, calendar reconciliation, connections, patterns, beliefs, claim comparison, and maintenance |
| `templates/` | Project/area/index shapes and optional capture, reflection, source, decision, and learning notes |
| `scripts/` | Built-in clipper, optional report runners, calendar reader, and isolated tests |
| `assistant.example.json` | Neutral example for the optional report runner |
| `assistant.local.json` | Your ignored local command, timezone, and optional calendar allowlist |
| `tag-registry.md` | Optional tag seeds; new subject tags are welcome |
| `logs/` | Ignored runtime diagnostics and recovery markers, created only when tools run |

Capabilities are on demand. Including a workflow installs no automation, selects
no model or account, grants no permission, and starts no background work. A
report-only run diagnoses or recommends; it does not process captures or fix
notes. Maintenance writes require the current user's authorization.

## BRAIN capabilities adapted for PARA

The workflow and reflection ideas are adapted from BRAIN's System setup, using
the portable PARA versions where already available in PARA-workbench. Personal
profiles, note collections, calendar names, selected assistants, installed jobs,
and past permissions are not part of this shared setup.

BRAIN's content-bearing wiki templates become source/insight/synthesis notes in
the appropriate PARA bucket. `00-wiki` stays index-only. A journal is an optional
area, not a required new root folder. Reports live under `03-resources/compound/`;
the activity log, contradictions, and stated theses are created only when needed.
Raw captures and archived records remain unchanged.

## Updating an existing copy

Canonical operational files now live under `System/`. Merge the new paths into
local instructions and launchers, preserving working Home sections, personal
settings, notes, and independent project repositories. Existing root
`config.local.json` owner preferences keep their location. Moving the clipper
folder also carries its ignored local settings; preserve your configured inbox.
Use the root README's update procedure before changing an in-use vault.

`prompts/README.md` and `prompts/archive-sweep.md` are small compatibility pointers.
The archive pointer keeps the existing sealed archive guide usable without
editing it; the actual workflows live only here. Do not copy this reorganization
over an in-use vault or edit archived notes to update old references.

When developing this distribution, keep development trackers, test captures,
generated reports, and machine settings out of the starter content. Use temporary
vaults for tests. PARA-workbench remains a separate repository with its own layout;
this reorganization does not update an installed working vault or that companion.
