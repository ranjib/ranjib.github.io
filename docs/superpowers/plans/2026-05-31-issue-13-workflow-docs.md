# Issue 13 Workflow Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document the source-of-truth files, public knowledge graph workflow, local validation path, and branch/PR workflow for maintaining the personal website.

**Architecture:** This is a documentation-only change. A top-level `README.md` will be the maintainer entry point, while this plan records the implementation steps for issue #13.

**Tech Stack:** Hugo, Anatole Hugo theme submodule, GitHub Actions, GitHub Pages, public-only knowledge graph pack.

---

### Task 1: Add Maintainer Documentation

**Files:**
- Create: `README.md`
- Create: `docs/superpowers/plans/2026-05-31-issue-13-workflow-docs.md`

- [ ] **Step 1: Add a top-level maintainer README**

Create `README.md` with sections for repository layout, source-of-truth, local build, public wiki context, branch workflow, and publishing.

- [ ] **Step 2: Verify generated artifacts are described accurately**

Confirm the README names `public/`, `resources/`, and `.hugo_build.lock` as generated outputs and points follow-up policy work to #14.

- [ ] **Step 3: Verify branch and PR workflow**

Confirm the README says to start from latest `origin/master`, use a `codex/<topic>` feature branch, open a PR, update tracking tickets, and delete the branch after merge.

- [ ] **Step 4: Verify public wiki workflow**

Confirm the README uses this exact public-only command:

```bash
go -C /home/ranjib/workspace/llm-wiki-ranjib-codex run ./cmd/kg packs build public_professional_footprint
```

and this exact output path:

```text
/home/ranjib/workspace/llm-wiki-ranjib-codex/build/packs/public_professional_footprint.md
```

- [ ] **Step 5: Run validation**

Run:

```bash
hugo --gc --minify
```

Expected result in a normal developer environment: the site builds successfully. If the local snap-packaged Hugo is blocked by sandbox permissions, record the exact failure in the PR.

- [ ] **Step 6: Commit**

Run:

```bash
git add README.md docs/superpowers/plans/2026-05-31-issue-13-workflow-docs.md
git commit -m "docs: document website maintenance workflow"
```
