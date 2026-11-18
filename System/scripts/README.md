# Optional local tools

The Markdown workflows can be used directly in your chosen assistant. The tools
below are optional; no assistant, account, calendar, or schedule is selected by
this repository.

## Web capture

The root `Start PARA Clipper - macOS.command` and
`Start PARA Clipper - Windows.cmd` launchers start the included
[web clipper](web-clipper/README.md). It requires Node.js 22+ and a terminal window
that remains open while clipping. The launchers open that window for you. Linux
users can run `node System/scripts/web-clipper/start.mjs` from the vault root.

## Report runners

The runners require Python 3.9+ and Unix file locking (macOS/Linux). Windows users
can run the same Markdown recipes interactively in an assistant with file access.
Each runner returns a report only; it cannot authorize inbox processing or fixes.

| Entry point | Recipe | Saved report |
|---|---|---|
| `morning-brief.sh` | `System/skills/morning-brief.md` | `03-resources/compound/YYYY-MM-DD-morning-brief.md` |
| `nightly-lint.sh` | `System/prompts/audit.md` | `03-resources/compound/lint/YYYY-MM-DD.md` |
| `weekly-synthesis.sh` | `System/prompts/weekly-synthesis.md` | `03-resources/compound/weekly/YYYY-Www.md` |

Inspect setup from the vault root without calling a model, querying Calendar, or
writing files:

```sh
zsh System/scripts/morning-brief.sh --dry-run
zsh System/scripts/nightly-lint.sh --dry-run
zsh System/scripts/weekly-synthesis.sh --dry-run
```

For actual reports, copy `System/assistant.example.json` to ignored
`System/assistant.local.json` and set `command` to an argument list for your own
assistant or executable adapter. It receives the report prompt on stdin, reads
the vault, and returns only Markdown with `created`, `tags`, and `sources`
frontmatter and a nonempty report body. `__VAULT_ROOT__` inside an argument expands
to this copy's path. Arguments are passed directly, not interpreted by a shell.
Use the assistant's documented read-only mode and restrict any connected tools
to the same scope. The generic runner cannot enforce a custom adapter's permissions.
Keep authentication in that assistant's own supported setup; do not put secrets
in this repository or in the example JSON. There is no provider fallback.

`--command EXECUTABLE` or `PARA_ASSISTANT_COMMAND` can select one executable
instead; put its arguments in an adapter or the local JSON. Per-job argument
lists under `jobs` override the default command. `timezone` accepts `local` or an
IANA timezone. A run uses the selected assistant's account and can consume its
allowance. Validation uses fixture adapters and makes no live model calls.

The runner atomically publishes one new complete report without replacing an
existing one, then appends one entry to `03-resources/vault-log.md`. It creates no
wiki/index/project/thesis edits and makes no commits. Recommendations stay in the
report for an authorized interactive session. A shared advisory lock at
`System/logs/workflows.lock` prevents these runners from publishing concurrently.

Runtime diagnostics stay in ignored `System/logs/<job>.log`. A pending marker
records an unresolved publication/activity outcome. Inspect the report, marker,
and activity before a retry. If a report was saved but activity failed, preserve
that report and complete the missing activity once; do not regenerate it.
Process interruption before publication may also leave a marker requiring
inspection. A file's existence alone does not establish a verified report.

These entry points are on-demand. No launchd jobs, app automations, timers, or
background services are installed or enabled. Choose and authorize a scheduler
separately if you later want recurring reports. The historical word “nightly” in
an entry-point name does not make it run at night.

## Optional Mac schedules

The schedule generator and templates are adapted from PARA-workbench. They use
this repository's existing `run-workflow.py` runner and private
`System/assistant.local.json` settings; no assistant is selected by the templates.

| Template | Example time (Mac local time) |
|---|---|
| `launchd/morning-brief.plist.template` | Daily 06:00 |
| `launchd/nightly-lint.plist.template` | Daily 23:30 |
| `launchd/weekly-synthesis.plist.template` | Sunday 19:00 |

From the vault root, prepare the log folder and generate machine-specific definitions:

```sh
mkdir -p System/logs
python3 System/scripts/render-schedules.py
```

The generator resolves this vault's location and writes the three inactive
`.plist` files under ignored `System/.local/launchd/`. The default label prefix
is `org.para-brain`. Use `--vault`, `--output`, or `--label-prefix` to select
another vault, output folder, or label namespace. Review example times before
using them; `System/assistant.local.json` controls report-date timezone, while
these schedule times follow the Mac's local timezone.

Identical definitions can be generated again without changing them. If an
existing definition differs, generation stops without replacing it; reconcile
local customizations first. Existing installed jobs are not changed. `RunAtLoad`
is false in every template, and rendering does not install, load, or enable jobs.

Configure and test your assistant command with the report runners before any
separately requested installation. Verify it is available in the scheduled job's
environment; an absolute executable path in private settings avoids relying on
an interactive terminal's PATH. Keep accounts, calendar names, local paths, and
generated definitions out of shared templates. Rendering and tests make no live
assistant or Calendar calls.

## Optional calendar reading

Interactive calendar reconciliation can use any authorized connector. The local
`python3 System/scripts/read-calendar.py` helper is macOS-only and read-only.
Choose calendar names explicitly in `System/assistant.local.json` under
`calendar_names`, or pass `--calendars NAME ...`. Missing/empty configuration
performs no device query. Configured morning briefs can include this allowlist;
`--no-calendar` disables it for one report. No calendar writes are supported.

The helper queries each configured calendar separately with one retry and a
bounded timeout, including overlapping and all-day events. It distinguishes
unavailable calendars from successful empty results. On macOS the requesting
app may need both Automation access to Calendar and Calendars data access;
add-only access cannot read existing events. Check the current requesting app
and verify reading in the context that will actually run it. Permission for an
interactive app is not proof of access for a terminal or scheduled process.
No permissions are granted or changed by these files.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s System/scripts/tests -v
npm test --prefix System/scripts/web-clipper
```

Python tests use temporary vaults, fixture assistants, and mocked calendar calls.
Clipper tests need its dependencies (installed by its first launch) and temporary
local connections. Neither suite creates captures/reports in this starter vault.
