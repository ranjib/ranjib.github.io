#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/blog-plan-provenance.XXXXXX")
trap 'rm -rf "$tmp"' EXIT

check_pr="$root/scripts/check_pr_provenance.sh"
check_baseline="$root/scripts/check_baseline_frozen.sh"
old="$tmp/old-baseline"
head="$tmp/head-baseline"
body="$tmp/body.md"

printf '%s\n' 'abc  historical.md' > "$old"
cp "$old" "$head"

expect_pass() {
  if ! "$@" >/dev/null 2>&1; then
    echo "expected pass: $*" >&2
    exit 1
  fi
}

expect_fail() {
  if "$@" >/dev/null 2>&1; then
    echo "expected failure: $*" >&2
    exit 1
  fi
}

# Ordinary editorial PRs and the repository template do not claim compilation.
: > "$body"
expect_pass env PLAN_BASELINE="$old" "$check_pr" "$body"
cp "$root/.github/pull_request_template.md" "$body"
expect_pass env PLAN_BASELINE="$old" "$check_pr" "$body"

# New plans require graph identity and both content hashes.
: > "$body"
expect_fail env PLAN_BASELINE="$old" "$check_pr" "$body" docs/superpowers/plans/new.md
printf '%s\n' 'Graph-ID: graph-1' 'Spec-Hash: spec-1' 'Plan-Hash: plan-1' > "$body"
expect_pass env PLAN_BASELINE="$old" "$check_pr" "$body" docs/superpowers/plans/new.md

# Slice PRs additionally require a non-empty slice identity.
printf '%s\n' 'Slice-ID: slice-1' 'Graph-ID: graph-1' > "$body"
expect_fail env PLAN_BASELINE="$old" "$check_pr" "$body"
printf '%s\n' 'Graph-ID: graph-1' 'Spec-Hash: spec-1' 'Plan-Hash: plan-1' 'Slice-ID: slice-1' > "$body"
expect_pass env PLAN_BASELINE="$old" "$check_pr" "$body"

# The baseline is immutable unless review receives an explicit reason.
printf '%s\n' 'abc  historical.md' 'def  new.md' > "$head"
: > "$body"
expect_fail "$check_baseline" "$old" "$head" "$body"
printf '%s\n' 'Baseline-Override: reviewed migration' > "$body"
expect_pass "$check_baseline" "$old" "$head" "$body"
expect_pass env PLAN_BASELINE="$old" PLAN_HEAD_BASELINE="$head" "$check_pr" "$body" docs/superpowers/plans/new.md

echo "plan provenance self-test passed"
