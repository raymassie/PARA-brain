#!/usr/bin/env python3
"""Read explicitly configured Apple calendars individually; never write events."""
import argparse
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]

def read_calendar(name):
    # Calendar names are process arguments, not executable AppleScript text.
    script = '''
on run argv
set calendarName to item 1 of argv
tell application "Calendar"
    set dayStart to current date
    set time of dayStart to 0
    set dayEnd to dayStart + (1 * days)
    tell calendar calendarName
        set evts to every event whose start date < dayEnd and end date > dayStart
        set rows to {}
        repeat with e in evts
            set end of rows to (summary of e as string) & " || " & (start date of e as string) & " || " & (end date of e as string) & " || all-day=" & (allday event of e as string)
        end repeat
        set AppleScript's text item delimiters to linefeed
        return rows as string
    end tell
end tell
end run
'''
    error = ''
    for attempt in range(2):
        try:
            result = subprocess.run(['/usr/bin/osascript', '-e', script, name],
                                    capture_output=True, text=True, timeout=45)
            if result.returncode == 0:
                return {'calendar': name, 'available': True,
                        'events': result.stdout.strip().splitlines(), 'attempts': attempt + 1}
            error = result.stderr.strip()
        except (OSError, subprocess.TimeoutExpired) as exc:
            error = str(exc)
    return {'calendar': name, 'available': False, 'error': error, 'attempts': 2}

def configured_names(config):
    if not config.exists():
        return []
    data = json.loads(config.read_text())
    names = data.get('calendar_names', []) if isinstance(data, dict) else None
    if not isinstance(names, list) or any(not isinstance(name, str) or not name.strip() or '\n' in name for name in names):
        raise ValueError('calendar_names must be a list of nonempty calendar names.')
    return names

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=ROOT/'System/assistant.local.json')
    parser.add_argument('--calendars', nargs='+', help='Explicit calendar names; overrides local configuration')
    args = parser.parse_args()
    try:
        names = args.calendars if args.calendars is not None else configured_names(args.config)
    except (OSError, ValueError) as exc:
        print(json.dumps({'available': False, 'message': str(exc)}))
        return 1
    if not names:
        print(json.dumps({'available': False, 'message': 'No calendars configured; choose names in System/assistant.local.json or pass --calendars.'}))
        return 0
    print(json.dumps([read_calendar(name) for name in names], indent=2))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
