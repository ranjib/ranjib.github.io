#!/usr/bin/env python3
"""Standalone Superpowers plan-compilation checker (stdlib only).

A vendorable single-file counterpart of `locallab plan check` for repositories
(e.g. PGCC-Org/corpus) whose CI cannot install LocalLab. Copy this file into a
repository and run:

    python3 scripts/plan_check_standalone.py --mode required

Behavior and violation codes match `locallab/plan/check.py`; the parity test in
`tests/plan/test_check_standalone.py` runs both over the same repositories.
Difference: this checker verifies the compiled artifacts' *hashes and shape*
(spec/plan/graph chain) but does not re-validate them against the full pydantic
contracts; run `locallab plan check` where LocalLab is available for that.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

PLANS_DIR = "docs/superpowers/plans"
BASELINE_FILE = f"{PLANS_DIR}/.locallab-baseline"
_FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
_CHECKBOX = re.compile(r"^\s*[-*] \[[ xX]\] ", re.MULTILINE)
_REQUIRED_KEYS = ("locallab_spec_envelope", "locallab_plan_envelope", "locallab_graph")
_SHA256 = re.compile(r"^[0-9a-f]{64}$")


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _content_hash(payload: object) -> str:
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return _sha256_bytes(encoded)


def _front_matter(text: str) -> dict:
    match = _FRONT_MATTER.match(text)
    if not match:
        return {}
    meta: dict[str, str] = {}
    for line in match.group(1).splitlines():
        key, sep, value = line.partition(":")
        if sep and not line.startswith((" ", "\t", "#", "-")):
            meta[key.strip()] = value.strip().strip("'\"")
    return meta


def read_baseline(root: Path) -> dict[str, str]:
    path = root / BASELINE_FILE
    if not path.exists():
        return {}
    entries: dict[str, str] = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        digest, _, name = line.partition("  ")
        entries[name.strip()] = digest.strip()
    return entries


def _resolve(root: Path, relative: object) -> Path | None:
    if not isinstance(relative, str) or not relative:
        return None
    candidate = (root / relative).resolve()
    try:
        candidate.relative_to(root.resolve())
    except ValueError:
        return None
    return candidate


def _load_json(path: Path) -> dict:
    data = json.loads(path.read_text())
    if not isinstance(data, dict):
        raise ValueError("expected a JSON object")
    return data


def check_plan(root: Path, plan: Path, baseline: dict[str, str]) -> list[tuple[str, str, str]]:
    rel = plan.relative_to(root).as_posix()
    text = plan.read_text()
    meta = _front_matter(text)

    if not any(meta.get(key) for key in _REQUIRED_KEYS):
        return _check_uncompiled(plan, rel, text, meta, baseline)

    missing = [key for key in _REQUIRED_KEYS if not meta.get(key)]
    if missing:
        return [(rel, "incomplete_compiled_metadata", f"missing front-matter keys {missing}")]

    paths = {key: _resolve(root, meta[key]) for key in _REQUIRED_KEYS}
    for key, path in paths.items():
        if path is None or not path.is_file():
            return [(rel, "compiled_artifact_missing", f"{key} does not resolve to a file in the repository")]
    try:
        spec = _load_json(paths["locallab_spec_envelope"])
        plan_env = _load_json(paths["locallab_plan_envelope"])
        graph = _load_json(paths["locallab_graph"])
        slices = plan_env["slices"]
        if not isinstance(slices, list) or not slices:
            raise ValueError("plan envelope has no slices")
        for field in ("spec_hash", "plan_hash"):
            if not _SHA256.match(str(graph[field])):
                raise ValueError(f"graph {field} is not a sha256")
        if not isinstance(graph["slices"], list) or not graph["slices"]:
            raise ValueError("graph has no slices")
        plan_env["spec_hash"]
    except (ValueError, KeyError, TypeError) as exc:
        return [(rel, "compiled_artifact_invalid", str(exc).splitlines()[0] if str(exc) else repr(exc))]

    problems = []
    if _content_hash(spec) != graph["spec_hash"] or plan_env["spec_hash"] != graph["spec_hash"]:
        problems.append("spec envelope does not match the graph's spec_hash")
    canonical_plan = dict(plan_env, slices=sorted(slices, key=lambda s: s.get("slice_key", "")))
    if _content_hash(canonical_plan) != graph["plan_hash"]:
        problems.append("plan envelope does not match the graph's plan_hash")
    return [(rel, "compiled_graph_stale", p) for p in problems]


def _check_uncompiled(plan: Path, rel: str, text: str, meta: dict, baseline: dict[str, str]):
    pinned = baseline.get(plan.name)
    if pinned is not None:
        if pinned == _sha256_bytes(plan.read_bytes()):
            return []
        return [(rel, "baselined_plan_modified",
                 "plan changed since it was baselined; compile it or re-baseline in review")]
    if meta.get("locallab_kind") == "research":
        if _CHECKBOX.search(text):
            return [(rel, "research_plan_has_tasks",
                     "a research document cannot contain implementation task checkboxes")]
        return []
    return [(rel, "uncompiled_plan",
             "implementation plan has no compiled graph (run `locallab plan compile` and add front-matter)")]


def check_repository(root: Path) -> list[tuple[str, str, str]]:
    root = root.resolve()
    plans_dir = root / PLANS_DIR
    if not plans_dir.is_dir():
        return []
    baseline = read_baseline(root)
    violations: list[tuple[str, str, str]] = []
    seen = set()
    for plan in sorted(plans_dir.glob("*.md")):
        seen.add(plan.name)
        violations += check_plan(root, plan, baseline)
    for name in sorted(set(baseline) - seen):
        violations.append((BASELINE_FILE, "baseline_entry_without_plan", name))
    return violations


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--root", default=".", help="Repository root (default: current directory)")
    parser.add_argument("--mode", choices=("required", "optional"), default="required")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON")
    args = parser.parse_args(argv)

    violations = check_repository(Path(args.root))
    if args.json:
        print(json.dumps([{"path": p, "code": c, "message": m} for p, c, m in violations], indent=2))
    else:
        for path, code, message in violations:
            print(f"{'ERROR' if args.mode == 'required' else 'WARN'}: {path}: {code}: {message}", file=sys.stderr)
        if not violations:
            print("plan compilation check passed")
    return 1 if violations and args.mode == "required" else 0


if __name__ == "__main__":
    sys.exit(main())
