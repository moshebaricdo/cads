#!/bin/bash
# Double-click or drag the otfs folder onto this file.
cd "$(dirname "$0")" || exit 1
chmod +x "./install-fa-fonts.sh" 2>/dev/null || true
exec "./install-fa-fonts.sh" "$@"
