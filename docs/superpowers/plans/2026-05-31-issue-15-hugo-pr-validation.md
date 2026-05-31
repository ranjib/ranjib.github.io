# Issue 15 Hugo PR Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repeatable Hugo build validation for pull requests.

**Architecture:** Add a dedicated PR build workflow separate from the existing deploy workflow. The PR workflow checks out the theme submodule, installs a pinned extended Hugo version, and runs `hugo --gc --minify` without publishing artifacts.

**Tech Stack:** GitHub Actions, Hugo, peaceiris/actions-hugo, Anatole theme submodule.

---

### Task 1: Add PR Build Workflow

**Files:**
- Create: `.github/workflows/build.yml`
- Create: `docs/superpowers/plans/2026-05-31-issue-15-hugo-pr-validation.md`

- [ ] **Step 1: Add workflow triggers**

Create `.github/workflows/build.yml` with these triggers:

```yaml
on:
  pull_request:
    branches:
      - master
  workflow_dispatch:
```

- [ ] **Step 2: Add read-only permissions**

Use read-only repository permissions:

```yaml
permissions:
  contents: read
```

- [ ] **Step 3: Pin the Hugo setup path**

Use `peaceiris/actions-hugo@v3`, pin Hugo to `0.85.0`, and install the extended build:

```yaml
env:
  HUGO_VERSION: "0.85.0"
```

- [ ] **Step 4: Check out the theme submodule**

Use `actions/checkout@v4` with recursive submodules:

```yaml
with:
  submodules: recursive
```

- [ ] **Step 5: Build without publishing**

Run:

```bash
hugo --gc --minify
```

The workflow must not deploy or commit generated files.

- [ ] **Step 6: Validate locally where possible**

Run:

```bash
hugo --gc --minify
```

If local snap-packaged Hugo fails before loading the site, record the exact failure in the PR and rely on the PR workflow for hosted validation.

- [ ] **Step 7: Commit**

Run:

```bash
git add .github/workflows/build.yml docs/superpowers/plans/2026-05-31-issue-15-hugo-pr-validation.md
git commit -m "ci: add hugo pull request build"
```
