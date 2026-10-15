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
