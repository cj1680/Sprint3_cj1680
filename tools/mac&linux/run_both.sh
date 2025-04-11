#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UNAME=$(uname)

# macOS: open in new Terminal windows
if [[ "$UNAME" == "Darwin" ]]; then
    osascript -e "tell application \"Terminal\" to do script \"bash '$SCRIPT_DIR/run_backend.sh'\""
    osascript -e "tell application \"Terminal\" to do script \"bash '$SCRIPT_DIR/run_frontend.sh'\""

# Linux: run sequentially in same terminal
else
    bash "$SCRIPT_DIR/run_backend.sh"
    bash "$SCRIPT_DIR/run_frontend.sh"
fi
