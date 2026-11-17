#!/bin/zsh
# Optional report entry point; running this file does not install a schedule.
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
exec python3 "$SCRIPT_DIR/run-workflow.py" weekly-synthesis "$@"
