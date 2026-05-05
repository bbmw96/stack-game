#!/usr/bin/env bash
# Bash utility - file/string helpers

trim() { echo "${1}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'; }

file_ext() { echo "${1##*.}"; }

is_dir() { [[ -d "$1" ]] && echo true || echo false; }

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
