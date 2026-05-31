# Hugo Theme Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Anatole submodule theme with first-party root-level Hugo layouts driven by `design-system/tokens.css`, producing a working Hugo build for all existing content.

**Architecture:** Hugo reads `layouts/`, `assets/`, `static/` from the repo root (no `themes/` directory). CSS tokens are inlined per-page via `os.ReadFile "design-system/tokens.css"` in `<head>` — no import chain, tokens stay the single source of truth. `assets/css/main.css` is fingerprinted via Hugo's asset pipeline.

**Tech Stack:** Hugo 0.162.0 extended, plain CSS (no SASS), Google Fonts (Inter, Source Serif 4, JetBrains Mono).

**Branch:** All work on `nuke_theme`. Do NOT commit to `master`.

---

### Task 1: Commit staged submodule removal

**Files:**
- Staged (already): `themes/anatole` (deleted), `.gitmodules` (deleted), `config.toml` (removed `theme =`), `.gitignore` (updated)

- [ ] **Step 1: Verify staged state**

```bash
git -C /path/to/repo status
```
Expected: `themes/anatole` and `.gitmodules` show as staged deletions. `config.toml` and `.gitignore` show as modified.

- [ ] **Step 2: Commit**

```bash
git add config.toml .gitignore
git commit -m "chore: remove Anatole submodule, drop theme config"
```
Expected: commit succeeds, working tree clean.

---

### Task 2: Create CSS entry point

**Files:**
- Create: `assets/css/main.css`

- [ ] **Step 1: Create `assets/css/` directory and `main.css`**

```bash
mkdir -p assets/css
```

Write `assets/css/main.css` with the following content (tokens are NOT imported here — they are inlined via `os.ReadFile` in `head.html`):

```css
/* ============================================================
   ranjib.dev — Main Stylesheet
   Tokens are inlined as a <style> block in head.html.
   All values reference CSS custom properties from tokens.css.
   ============================================================ */

/* ---- Reset ---- */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--fs-md);
  line-height: var(--lh-prose);
  color: var(--text);
  background: var(--bg);
  font-feature-settings: "kern", "liga", "calt";
}
::selection { background: var(--selection); }
a {
  color: var(--link);
  text-decoration: underline;
  text-decoration-color: color-mix(in oklch, var(--link), transparent 60%);
  text-underline-offset: 0.18em;
  transition: color var(--dur-fast) var(--ease-out);
}
a:hover { color: var(--link-hover); text-decoration-color: currentColor; }
hr { border: 0; border-top: 1px solid var(--hairline); margin: var(--s-7) 0; }
img, svg { max-width: 100%; display: block; }

/* ---- Layout ---- */
.site-container {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
.site-main {
  padding-block: var(--s-8);
}

/* ---- Site header / nav ---- */
.site-header {
  border-bottom: 1px solid var(--hairline);
  padding-block: var(--s-4);
}
.site-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
.site-wordmark {
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: var(--tr-tight);
}
.site-wordmark:hover { color: var(--link); }
.site-nav {
  display: flex;
  gap: var(--s-5);
  list-style: none;
  margin: 0;
  padding: 0;
}
.site-nav a {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: var(--tr-wide);
  text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease-out);
}
.site-nav a:hover,
.site-nav a[aria-current="page"] { color: var(--link); }

/* ---- Footer ---- */
.site-footer {
  border-top: 1px solid var(--hairline);
  padding-block: var(--s-6);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--text-meta);
  text-align: center;
}

/* ---- Post card ---- */
.post-list { margin-top: var(--s-6); }
.post-card { padding-block: var(--s-5); border-bottom: 1px solid var(--hairline); }
.post-card:first-child { padding-top: 0; }
.post-card-title {
  font-family: var(--font-serif);
  font-size: var(--fs-xl);
  font-weight: 500;
  line-height: var(--lh-snug);
  letter-spacing: var(--tr-tight);
  margin: 0 0 var(--s-2);
}
.post-card-title a { color: var(--text); text-decoration: none; }
.post-card-title a:hover { color: var(--link); }
.post-card-meta {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--text-meta);
  margin: 0 0 var(--s-3);
}
.post-card-summary {
  font-size: var(--fs-base);
  color: var(--text-muted);
  margin: 0;
  line-height: var(--lh-normal);
}

/* ---- Page header ---- */
.page-header {
  margin-bottom: var(--s-7);
  padding-bottom: var(--s-5);
  border-bottom: 1px solid var(--hairline);
}
.page-title {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  font-weight: 500;
  line-height: var(--lh-tight);
  letter-spacing: var(--tr-tight);
  margin: 0;
}

/* ---- Post single ---- */
.post-title {
  font-family: var(--font-serif);
  font-size: var(--fs-3xl);
  font-weight: 500;
  line-height: var(--lh-tight);
  letter-spacing: var(--tr-tight);
  margin: 0 0 var(--s-3);
}
.post-meta {
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--text-meta);
  display: flex;
  gap: var(--s-3);
  align-items: center;
  margin: 0;
}
.post-header { margin-bottom: var(--s-7); padding-bottom: var(--s-5); border-bottom: 1px solid var(--hairline); }

/* ---- Prose ---- */
.post-body { max-width: var(--measure-prose); }
.post-body p, .post-body li { line-height: var(--lh-prose); }
.post-body h2 {
  font-size: var(--fs-2xl);
  font-weight: 500;
  letter-spacing: var(--tr-tight);
  line-height: var(--lh-snug);
  margin: var(--s-8) 0 var(--s-4);
}
.post-body h3 {
  font-size: var(--fs-xl);
  font-weight: 500;
  letter-spacing: var(--tr-tight);
  line-height: var(--lh-snug);
  margin: var(--s-7) 0 var(--s-3);
}
.post-body h4 {
  font-size: var(--fs-lg);
  font-weight: 600;
  margin: var(--s-6) 0 var(--s-2);
}
.post-body blockquote {
  margin-inline: 0;
  padding-inline-start: var(--s-5);
  border-left: 3px solid var(--hairline);
  color: var(--text-muted);
  font-style: italic;
}
.post-body code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--surface-alt);
  padding: 0.1em 0.3em;
  border-radius: var(--r-sm);
}
.post-body pre {
  background: var(--surface-alt);
  padding: var(--s-5);
  border-radius: var(--r-md);
  overflow-x: auto;
  line-height: var(--lh-normal);
}
.post-body pre code { background: none; padding: 0; font-size: var(--fs-sm); letter-spacing: var(--tr-mono); }
.post-body table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); margin-block: var(--s-6); }
.post-body th, .post-body td { padding: var(--s-2) var(--s-3); border: 1px solid var(--hairline); text-align: left; }
.post-body th { background: var(--surface-alt); font-family: var(--font-sans); font-weight: 600; }

/* ---- Utilities ---- */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls assets/css/main.css
```
Expected: file listed.

- [ ] **Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "feat: add CSS entry point for first-party theme"
```

---

### Task 3: Create Hugo partials

**Files:**
- Create: `layouts/partials/head.html`
- Create: `layouts/partials/site-header.html`
- Create: `layouts/partials/site-footer.html`
- Create: `layouts/partials/post-card.html`

- [ ] **Step 1: Create partials directory**

```bash
mkdir -p layouts/partials
```

- [ ] **Step 2: Write `layouts/partials/head.html`**

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{ if .IsHome }}{{ .Site.Params.title }}{{ else }}{{ .Title }} — {{ .Site.Params.title }}{{ end }}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />
<style>{{ os.ReadFile "design-system/tokens.css" | safeCSS }}</style>
{{ $css := resources.Get "css/main.css" | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" />
<link rel="alternate" type="application/rss+xml" title="{{ .Site.Params.title }}" href="{{ .Site.BaseURL }}index.xml" />
```

- [ ] **Step 3: Write `layouts/partials/site-header.html`**

```html
<header class="site-header">
  <div class="site-header-inner">
    <a href="{{ .Site.BaseURL }}" class="site-wordmark">{{ .Site.Params.title }}</a>
    <nav aria-label="Site navigation">
      <ul class="site-nav">
        {{ range .Site.Menus.main }}
        <li>
          <a href="{{ .URL }}"{{ if $.Page.IsMenuCurrent "main" . }} aria-current="page"{{ end }}>{{ .Name }}</a>
        </li>
        {{ end }}
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 4: Write `layouts/partials/site-footer.html`**

```html
<footer class="site-footer">
  <div class="site-container">
    <p>© {{ now.Year }} Ranjib Dey</p>
  </div>
</footer>
```

- [ ] **Step 5: Write `layouts/partials/post-card.html`**

```html
<article class="post-card">
  <h2 class="post-card-title">
    <a href="{{ .Permalink }}">{{ .Title }}</a>
  </h2>
  <p class="post-card-meta">
    <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "January 2, 2006" }}</time>
    {{ if .ReadingTime }}· {{ .ReadingTime }} min read{{ end }}
  </p>
  {{ with .Summary }}
  <p class="post-card-summary">{{ . }}</p>
  {{ end }}
</article>
```

- [ ] **Step 6: Commit**

```bash
git add layouts/partials/
git commit -m "feat: add Hugo partials (head, nav, footer, post-card)"
```

---

### Task 4: Create Hugo base layout and page templates

**Files:**
- Create: `layouts/_default/baseof.html`
- Create: `layouts/_default/list.html`
- Create: `layouts/_default/single.html`
- Create: `layouts/index.html`

- [ ] **Step 1: Create directories**

```bash
mkdir -p layouts/_default
```

- [ ] **Step 2: Write `layouts/_default/baseof.html`**

```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}" data-theme="light">
<head>
  {{ partial "head.html" . }}
</head>
<body>
  {{ partial "site-header.html" . }}
  <main class="site-main site-container">
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "site-footer.html" . }}
</body>
</html>
```

- [ ] **Step 3: Write `layouts/_default/list.html`**

```html
{{ define "main" }}
<div class="page-header">
  <h1 class="page-title">{{ .Title }}</h1>
</div>
<div class="post-list">
  {{ range .Pages }}
    {{ partial "post-card.html" . }}
  {{ end }}
</div>
{{ end }}
```

- [ ] **Step 4: Write `layouts/_default/single.html`**

```html
{{ define "main" }}
<article>
  <header class="post-header">
    <h1 class="post-title">{{ .Title }}</h1>
    <p class="post-meta">
      <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "January 2, 2006" }}</time>
      {{ if .ReadingTime }}<span>·</span><span>{{ .ReadingTime }} min read</span>{{ end }}
    </p>
  </header>
  <div class="post-body">
    {{ .Content }}
  </div>
</article>
{{ end }}
```

- [ ] **Step 5: Write `layouts/index.html`**

```html
{{ define "main" }}
<section>
  <h1 class="page-title">{{ .Site.Params.title }}</h1>
</section>
<div class="post-list">
  {{ $posts := where .Site.RegularPages "Section" "posts" }}
  {{ range first 5 $posts.ByDate.Reverse }}
    {{ partial "post-card.html" . }}
  {{ end }}
</div>
{{ end }}
```

- [ ] **Step 6: Commit**

```bash
git add layouts/_default/ layouts/index.html
git commit -m "feat: add Hugo base layout and page templates"
```

---

### Task 5: Create CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write `CLAUDE.md`** (content is from §7 of `design-system/STRATEGY.md`)

```markdown
# CLAUDE.md

This is a Hugo static site for ranjib.dev. Design artifacts are in `/design-system/`.

## Before making any visual change:
1. Read `design-system/STRATEGY.md`
2. Read `design-system/tokens.css` — use these values, do not invent new ones
3. Look for an existing component in `design-system/styleguide.html`

## Rules
- Never hardcode colors, font sizes, or spacing. Always reference `--token-name`.
- New tokens must be added to `design-system/tokens.css` first.
- Hugo partials use the same class names as the design system styleguide.
- Run `hugo server -D` after changes; verify against `design-system/styleguide.html`.
- Keep markup semantic.

## Project structure
- Layouts are ROOT-LEVEL (`layouts/`, `assets/`, `static/`) — there is NO `themes/` folder and no theme submodule. Do not reintroduce one.
- `config.toml` has no `theme =` line.
- CSS entry point: `assets/css/main.css` (no @import — tokens are inlined via `os.ReadFile` in `layouts/partials/head.html`).

## When unsure
Ask: "Does this change belong in `/design-system/` or in `/layouts/`?"
- Visual decision → design-system
- Content/data binding → layouts
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md per design-system/STRATEGY.md §7"
```

---

### Task 6: Verify Hugo build

**Files:** None created. Verification only.

- [ ] **Step 1: Run Hugo build**

```bash
hugo --minify 2>&1
```
Expected: exits 0, output shows pages built, no `ERROR` lines. Warnings about missing features (like search) are acceptable.

- [ ] **Step 2: Check built pages exist**

```bash
ls public/index.html public/posts/index.html public/about/index.html
```
Expected: all three files present.

- [ ] **Step 3: Spot-check a post page**

```bash
grep -l "post-body" public/posts/*/index.html | head -1 | xargs grep -c "post-body"
```
Expected: returns a count ≥ 1, confirming the `.post-body` div was rendered.

- [ ] **Step 4: Check no stale theme references**

```bash
grep -r "anatole\|themes/" layouts/ assets/ config.toml 2>/dev/null
```
Expected: no output.

- [ ] **Step 5: Spot-check token inlining**

```bash
grep -c "ink-12\|accent-terra" public/index.html
```
Expected: count > 0, confirming tokens.css was inlined into the HTML `<head>`.

- [ ] **Step 6: If build fails — debug**

Common issues and fixes:
- `error calling os.ReadFile`: Hugo version < 0.91 — check `hugo version`. Should show 0.162.0.
- `resources.Get failed`: `assets/css/main.css` not found — run `ls assets/css/main.css`.
- Template parse error in `post-card.html`: Check that the `{{ define }}` / `{{ end }}` blocks in list/single/index are correct.
- `WARN: found no layout`: Section missing template — check `layouts/_default/list.html` and `layouts/_default/single.html` exist.

---

### Task 7: Fix `layouts/index.html` pipeline if needed

**Files:**
- Modify: `layouts/index.html` (only if Task 6 Step 1 fails with a pipeline error)

The home page template uses `.ByDate.Reverse` on the result of `where`, which can fail if the `where` result doesn't support `.ByDate` directly.

- [ ] **Step 1: Check if build succeeded in Task 6**

If `hugo` exited 0 in Task 6 Step 1, skip this task entirely.

- [ ] **Step 2: If there was a pipeline error, fix `layouts/index.html`**

Replace the range line with:

```html
{{ define "main" }}
<section>
  <h1 class="page-title">{{ .Site.Params.title }}</h1>
</section>
<div class="post-list">
  {{ $posts := where .Site.RegularPages "Section" "posts" }}
  {{ range first 5 ($posts.ByDate.Reverse) }}
    {{ partial "post-card.html" . }}
  {{ end }}
</div>
{{ end }}
```

- [ ] **Step 3: Re-run build and confirm success**

```bash
hugo --minify 2>&1 | grep -E "ERROR|WARN|pages"
```
Expected: no ERROR lines.

- [ ] **Step 4: Commit if changed**

```bash
git add layouts/index.html
git commit -m "fix: correct post range pipeline in home page template"
```

---

### Task 8: Open GitHub tracking issue

**Files:** None. GitHub CLI only.

- [ ] **Step 1: Create the tracking issue**

```bash
gh issue create \
  --title "Design system: deferred §8 items (code highlight, images, search, RSS, comments)" \
  --body "$(cat <<'EOF'
Tracking issue for items explicitly deferred from the initial theme migration PR (see `design-system/STRATEGY.md` §8).

## Items

- [ ] **Code highlighting** — pick a Chroma syntax theme matching the palette. Recommended: generate a custom theme via Chroma's style API using `--accent-terra` / `--ink-12` values.
- [ ] **Image pipeline** — configure Hugo's built-in image processing for responsive images (WebP + fallback, max widths, lazy loading).
- [ ] **Search** — decide: Pagefind (recommended for static sites) or skip entirely. Pagefind runs post-build and needs a CI step.
- [ ] **RSS** — decide: Hugo's default feed or a custom-designed feed page. Default is likely fine.
- [ ] **Comments** — decide: Giscus for technical posts, or none. Current stance is none.
- [ ] **Dark/light mode toggle** — small JS toggle + `data-theme` attribute. Tokens already have dark-mode vars wired up.
- [ ] **`design-system/templates/`** — create HTML page mockups (home, post, listing, about) per the STRATEGY.md two-tool workflow, so future Claude Design sessions have starting points.

## Reference

- Design spec: `docs/superpowers/specs/2026-05-31-hugo-theme-migration-design.md`
- Strategy: `design-system/STRATEGY.md` §8
EOF
)"
```
Expected: issue URL printed.

---

### Task 9: Open PR

**Files:** None. GitHub CLI only.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin nuke_theme
```
Expected: branch pushed to remote.

- [ ] **Step 2: Open the PR**

```bash
gh pr create \
  --base master \
  --title "feat: migrate to first-party Hugo theme driven by design system tokens" \
  --body "$(cat <<'EOF'
## Summary

- Removes the Anatole git submodule (`themes/anatole`) and all submodule tracking files
- Adds root-level `layouts/` with `baseof`, `list`, `single`, and `index` templates
- Adds `assets/css/main.css` using only CSS custom properties from `design-system/tokens.css`
- Inlines `design-system/tokens.css` per page via Hugo's `os.ReadFile` — single source of truth preserved
- Adds `CLAUDE.md` per `design-system/STRATEGY.md` §7

## What's NOT in this PR (tracked in issue)

Code highlighting, responsive image pipeline, search, RSS customization, comments, dark/light toggle, `design-system/templates/`.

## Test plan

- [ ] `hugo --minify` exits 0 with no ERRORs
- [ ] Home page renders with post list
- [ ] `/posts/` listing renders all posts
- [ ] Individual post renders with title, date, reading time, and body
- [ ] `/about/` renders both about pages
- [ ] Nav links resolve correctly
- [ ] No hardcoded hex or px values in `assets/css/main.css`
- [ ] No `theme =` in `config.toml`
- [ ] No `themes/` directory in repo

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR URL printed.
