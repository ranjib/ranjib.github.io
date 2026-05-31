# Issue 14 Generated Artifacts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent generated Hugo artifacts from accidentally entering source changes.

**Architecture:** Treat source files and generated output separately. `.gitignore` enforces the policy, while `README.md` explains how CI generates and publishes output.

**Tech Stack:** Hugo, Git, GitHub Actions, GitHub Pages.

---

### Task 1: Ignore Generated Hugo Output

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`
- Create: `docs/superpowers/plans/2026-05-31-issue-14-generated-artifacts.md`

- [ ] **Step 1: Update `.gitignore`**

Add these generated artifacts:

```gitignore
# Hugo generated output
public/
resources/
.hugo_build.lock
```

- [ ] **Step 2: Update README generated-output guidance**

Replace the unresolved issue reference with explicit policy: `public/`, `resources/`, and `.hugo_build.lock` are ignored and should not be committed unless a future publishing change intentionally changes that policy.

- [ ] **Step 3: Verify no generated artifacts are tracked**

Run:

```bash
git ls-files public resources .hugo_build.lock
```

Expected: no output.

- [ ] **Step 4: Run Hugo build validation**

Run:

```bash
hugo --gc --minify
```

Expected in a normal developer environment: the site builds and generated output remains ignored by Git. If the local snap-packaged Hugo is blocked by sandbox permissions, record the exact failure in the PR.

- [ ] **Step 5: Confirm Git status**

Run:

```bash
git status --short
```

Expected: only `.gitignore`, `README.md`, and this plan file are modified or added.
