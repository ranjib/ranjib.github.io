#!/usr/bin/env bash
# Require compiled-plan provenance in a PR body (#100).
# usage: check_pr_provenance.sh BODY_FILE [ADDED_PLAN_PATH...]
# env: PLAN_BASELINE points at the base branch's plan baseline.
set -euo pipefail

body=$1
shift
baseline=${PLAN_BASELINE:-docs/superpowers/plans/.locallab-baseline}

need_graph=0
need_slice=0

# A reviewed re-baseline may exempt plans pinned by the same PR. The separate
# baseline-freeze check requires the reason before this exception is honored.
override=0
if grep -qiE '^Baseline-Override:[[:space:]]*[^[:space:]]+' "$body"; then
  override=1
fi

for plan in "$@"; do
  name=$(basename "$plan")
  if grep -qF "  $name" "$baseline" 2>/dev/null; then
    continue
  fi
  if [ "$override" = 1 ] && [ -n "${PLAN_HEAD_BASELINE:-}" ] && grep -qF "  $name" "$PLAN_HEAD_BASELINE" 2>/dev/null; then
    continue
  fi
  need_graph=1
done

if grep -qiE '^Slice-ID:' "$body"; then
  need_graph=1
  need_slice=1
fi

has() { grep -qiE "^$1:[[:space:]]*[^[:space:]]+" "$body"; }

fail=0
require() {
  if ! has "$1"; then
    echo "ERROR: PR body is missing a non-empty '$1:' line (compiled-plan provenance, #100)" >&2
    fail=1
  fi
}

if [ "$need_graph" = 1 ]; then
  require Graph-ID
  require Spec-Hash
  require Plan-Hash
fi
if [ "$need_slice" = 1 ]; then
  require Slice-ID
fi

exit "$fail"
