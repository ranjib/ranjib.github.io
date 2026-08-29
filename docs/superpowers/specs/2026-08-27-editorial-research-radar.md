# Editorial Research Radar - Design Spec

Date: 2026-08-27
Branch: `codex/editorial-research-radar`
Status: Proposed for issue #78

## Goal

Build the first bounded version of the editorial research radar for
`ranjib/ranjib.github.io`: a provider-neutral contract, source registry, weak
signal state model, validation, and a manually dispatched Agentic Workflow that
creates a research issue for human review.

## Scope

This PR implements the MVP foundation for #78:

- fix the known `README.md` versus `CLAUDE.md` theme/submodule drift;
- add `docs/editorial-radar.md` as the radar constitution;
- add `data/research-sources.yaml` as the curated source registry;
- add `data/research-signals.json` as the weak-signal state seed;
- add deterministic validation for radar contract, source, state, and workflow
  files as first-class Go code with package tests;
- wire validation into existing build and deploy checks;
- add a manual GitHub Agentic Workflow source file for weekly research radar;
- document the spec and plan in the existing superpowers-style docs tree.

## Non-Goals

This PR does not:

- publish or draft articles;
- schedule recurring runs;
- expose private wiki content;
- add third-party web-search MCP secrets;
- rewrite existing content for freshness;
- create multiple child issues automatically;
- change Hugo build or deploy behavior beyond adding validation.

## Architecture

Use a split between deterministic invariants and agentic synthesis:

```text
docs/editorial-radar.md
  -> policy, scoring, boundaries, output shape

data/research-sources.yaml
  -> curated source registry and source-quality weighting

data/research-signals.json
  -> persistent weak-signal state seed

cmd/validate-editorial-radar + internal/editorialradar
  -> deterministic contract and schema checks with unit tests

.github/workflows/editorial-radar.md
  -> manual Agentic Workflow that reads repo state, researches recent changes,
     and creates exactly one review issue
```

The agentic workflow is intentionally mutation-light. The agent may synthesize
findings and request a bounded issue through safe outputs, but it must not edit
site content, publish posts, merge PRs, alter domain/brand settings, or read
private knowledge-graph content.

## Agentic Workflow MVP

Current GitHub Agentic Workflows documentation says workflows are Markdown
files in `.github/workflows/` with YAML frontmatter and natural-language
instructions, compiled to `.lock.yml` files by `gh aw compile`. It also lists
Codex and Claude Code as supported engines. This PR uses `engine: codex` by
default and documents that maintainers can switch to `engine: claude` before
recompiling when Claude Code is preferred.

The MVP uses `workflow_dispatch` only. Scheduling is intentionally deferred
until manual runs produce useful research issues with acceptable noise and cost.

## Quality Bar

- The radar contract names the allowed path and prohibited autonomous outputs.
- The source registry contains primary and ecosystem sources across all lanes.
- The signal state is valid JSON with explicit required fields.
- The workflow creates one research issue and does not modify content.
- Radar validation is implemented as Go package code with tests.
- CI validates the radar files alongside the existing Hugo and metadata checks.
- The known README/CLAUDE drift fixture is resolved.
