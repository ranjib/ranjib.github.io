---
locallab_spec_envelope: docs/superpowers/compiled/2026-10-15-public-boundary-pilot.spec.json
locallab_plan_envelope: docs/superpowers/compiled/2026-10-15-public-boundary-pilot.plan.json
locallab_graph: docs/superpowers/compiled/2026-10-15-public-boundary-pilot.graph.json
---

# Public-boundary validation pilot

Issue #100 requires one real multi-slice blog/platform change to complete
through compiled routing. The repository's publishing pipeline calls for
public leak checks, while the exported build/lint/test routes do not yet own a
deterministic source-and-rendered boundary check. This plan closes that gap
without reading private sources or replacing human privacy review.

Graph `graph-b7841828f0910d588e1fa808` was compiled against blog `master` at
`c9faa913bae2c4185af1802e766868f0294f5eb1` with repository-owned validator
commands imported from that exact Git object.

## Slices

- [ ] `boundary-contract` (`local_grind`): add the shared redacting detector,
  regression probes, and test-route integration.
- [ ] `source-boundary` (`local`, depends on `boundary-contract`): enforce the
  detector across all Markdown post sources, including drafts.
- [ ] `rendered-boundary` (`local`, depends on `boundary-contract`): enforce
  the detector across generated post HTML.

Each slice is restricted to its compiled `allowed_paths` and its bound `test`
or `lint` validator. LocalLab may create draft PRs only after deterministic
validation; it cannot merge or publish the site. Human review remains required,
and no matched private value or credential may appear in validator output.
