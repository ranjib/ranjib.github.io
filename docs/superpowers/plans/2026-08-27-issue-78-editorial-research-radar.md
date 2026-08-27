# Issue 78 Editorial Research Radar Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development when available, or
> superpowers:executing-plans to implement this plan task-by-task. This plan is
> intentionally compatible with Codex CLI and Claude Code.

**Goal:** Implement the bounded MVP foundation for issue #78 and ship it as a
pull request.

**Architecture:** Keep deterministic invariants in repository files and scripts;
use Agentic Workflows only for synthesis, materiality judgment, and issue
creation. Research must create issues, never articles.

**Tech Stack:** Hugo, Node.js validation scripts, GitHub Actions, GitHub
Agentic Workflows, Codex or Claude Code.

---

### Task 1: Resolve the Seeded Drift Fixture

**Files:**

- Update: `README.md`

- [x] Remove stale Anatole theme/submodule guidance.
- [x] Describe root-level `layouts/`, `assets/`, and `static/` as the source of
      truth.
- [x] Preserve generated-output, public-KG, branch, and content guidance.

### Task 2: Add the Editorial Radar Contract

**Files:**

- Create: `docs/editorial-radar.md`
- Create: `docs/superpowers/specs/2026-08-27-editorial-research-radar.md`
- Create: `docs/superpowers/plans/2026-08-27-issue-78-editorial-research-radar.md`

- [x] Define editorial thesis, lanes, and recurring concepts.
- [x] Define evidence hierarchy and source preferences.
- [x] Define novelty, lived-experience, and trend-rejection tests.
- [x] Define freshness classes.
- [x] Define scoring rubric and dispositions.
- [x] Define privacy rules, allowed outputs, prohibited outputs, and approval
      boundaries.

### Task 3: Add Source and State Models

**Files:**

- Create: `data/research-sources.yaml`
- Create: `data/research-signals.json`

- [x] Add curated source registry across SRE, GenAI, open source/physical
      computing, and hobbies.
- [x] Mark authority levels and review policy.
- [x] Seed weak-signal state with explicit schema and required fields.

### Task 4: Add Deterministic Validation

**Files:**

- Create: `scripts/validate-editorial-radar.mjs`
- Update: `.github/workflows/build.yml`
- Update: `.github/workflows/deploy.yml`

- [x] Validate required files and policy phrases.
- [x] Validate source URLs and registry breadth.
- [x] Validate signal-state JSON shape.
- [x] Validate workflow source boundaries.
- [x] Wire the validator into CI.

### Task 5: Add Manual Agentic Workflow MVP

**Files:**

- Create: `.github/workflows/editorial-radar.md`
- Create after compile when tooling is available:
  `.github/workflows/editorial-radar.lock.yml`

- [x] Use `workflow_dispatch` for manual runs.
- [x] Use Codex as the default engine with a documented Claude Code switch.
- [x] Enable web search explicitly for current external research.
- [x] Use safe output to create one research issue.
- [x] Prohibit content edits and publication.
- [x] Compile with `gh aw compile`.

### Task 6: Validate and Ship

- [ ] Run `hugo --gc --minify`.
- [ ] Run all existing validators.
- [ ] Run `node scripts/validate-editorial-radar.mjs`.
- [ ] Run `git diff --check`.
- [ ] Commit changes.
- [ ] Push branch.
- [ ] Open a draft PR linked to #78.
