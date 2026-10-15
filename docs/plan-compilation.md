# LocalLab plan compilation

This repository requires LocalLab compilation for new implementation-authorizing
plans under `docs/superpowers/plans/`. Research notes and design exploration may
precede compilation, but they do not authorize implementation.

## Author workflow

1. Write a semantic `SpecEnvelope` with goals, invariants, acceptance criteria,
   evidence references, and explicit uncertainty.
2. Write a `PlanEnvelope` of dependency-linked slices with bounded paths and
   repository validator names. Planner prose must not assign an execution tier.
3. Compile against the exact `master` commit. Import
   `.locallab/validators.json` from that pinned Git object.
4. Commit the spec, plan, and graph artifacts and reference them from the
   human-readable plan front matter:

   ```yaml
   ---
   locallab_spec_envelope: docs/superpowers/compiled/<name>.spec.json
   locallab_plan_envelope: docs/superpowers/compiled/<name>.plan.json
   locallab_graph: docs/superpowers/compiled/<name>.graph.json
   ---
   ```

5. Materialize compiled slices with `locallab plan publish`. Preserve graph,
   spec, plan, and slice identity in generated issues and candidate PRs.

CI runs `python3 scripts/plan_check_standalone.py --mode required`. Historical
plans are pinned in `docs/superpowers/plans/.locallab-baseline`; changing a pin
or a pinned plan requires explicit review and either compilation or deliberate
re-baselining.

## Issue and PR provenance

Use the compiled-slice issue template for materialized work. A compiled slice
issue records `Graph-ID`, `Slice-ID`, `Spec-Hash`, and `Plan-Hash` together with
the compiler-authorized paths and validators.

The `pr-provenance` workflow applies the same identity contract to pull
requests. A PR that declares `Slice-ID`, or adds a new implementation plan,
must provide non-empty graph and hash fields in its body. Ordinary editorial
and maintenance PRs do not need them. A PR also cannot exempt its own plan by
editing `.locallab-baseline`; a deliberate migration requires a non-empty
`Baseline-Override: <reason>` line for reviewer attention.

## Trusted validators

`.locallab/validators.json` exposes the repository-owned commands that the plan
compiler can import from a pinned commit:

- `build` renders the production Hugo site;
- `lint` renders independently, then checks metadata, the content model,
  rendered posts, approved photos, RSS, crawl files, distribution, brand, and
  canonical-domain policy; and
- `test` runs all Go tests and the editorial-radar validator.

Compiler discovery does not grant runtime trust. The LocalLab operator must
adopt the same commands in host configuration before executing a slice.

## Routing and safety

Deterministic site mechanics, validation, metadata, publication plumbing,
editorial-radar implementation, and bounded content transformations are
local-first when their validators are authoritative. Novel thesis selection,
external research, source synthesis, and weak-oracle editorial judgment remain
frontier work. Content research must reuse LocalLab WorkOrder enrichment and
source verification rather than introducing a second evidence contract.

Compilation never authorizes automatic publication or merge. Existing GitHub
Pages, public-source, approved-photo, brand, and domain controls remain in force.
