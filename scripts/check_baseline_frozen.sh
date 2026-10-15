#!/usr/bin/env bash
# Prevent a PR from silently exempting its own implementation plan (#100).
# usage: check_baseline_frozen.sh OLD_BASELINE NEW_BASELINE BODY_FILE
set -euo pipefail

old=$1
new=$2
body=$3

pins() { grep -vE '^[[:space:]]*(#|$)' "$1" | sort -u || true; }

added=$(comm -13 <(pins "$old") <(pins "$new"))
[ -z "$added" ] && exit 0

if grep -qiE '^Baseline-Override:[[:space:]]*[^[:space:]]+' "$body"; then
  exit 0
fi

echo "ERROR: baseline gained or changed pins without a 'Baseline-Override: <reason>' line in the PR body (#100):" >&2
echo "$added" >&2
exit 1
