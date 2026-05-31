# Hugo Theme Migration — Design Spec

**Date:** 2026-05-31
**Branch:** `nuke_theme`
**Status:** Approved

---

## Goal

Complete the migration of ranjib.dev from the Anatole git-submodule theme to a first-party, root-level Hugo layout powered by the `design-system/` design tokens. Ship as a PR against `master`. Create a tracking issue for deferred §8 items.

## Scope (this PR)

Implement a minimal working site: the Hugo build succeeds, all existing content renders, and the visual output matches the design tokens in `design-system/tokens.css` and the styleguide in `design-system/styleguide.html`.

**Excluded from this PR** (tracked in GitHub issue):
- Chroma syntax highlighting theme
- Responsive image pipeline
- Search (Pagefind / Lunr)
- Custom RSS page
- Comments (Giscus)
- Dark/light mode toggle
- `design-system/templates/` HTML mockups

## Architecture

Hugo reads layouts and assets from the repo root — no `themes/` directory, no submodule. The CSS pipeline:

```
assets/css/main.css
  └── @import "../../design-system/tokens.css"   ← all design values
```

Hugo's built-in asset pipeline processes `main.css` via `resources.Get` and fingerprints the output. No SASS binary required — plain CSS only.

## Files to create

```
layouts/
├── _default/
│   ├── baseof.html       ← page shell: <html>, head, header, main, footer
│   ├── list.html         ← post/section listing page
│   └── single.html       ← individual post page
├── partials/
│   ├── head.html         ← <head>: charset, viewport, title, fonts, CSS bundle
│   ├── site-header.html  ← site wordmark + nav (Home, Blogs, About)
│   ├── site-footer.html  ← year, site name, minimal
│   └── post-card.html    ← reusable card: title, date, summary
└── index.html            ← home page: brief intro + recent posts list

assets/css/
└── main.css              ← imports tokens; base reset; typography; layout;
                             nav; post-card; prose body

CLAUDE.md                 ← per §7 of design-system/STRATEGY.md
```

### Config changes (already staged)

- `theme = 'anatole'` removed from `config.toml`
- `themes/anatole` submodule deleted
- `.gitmodules` removed
- `.gitignore` includes `/public/` and `/resources/`

## Content bindings

| Template | Content served | Key Hugo variables |
|---|---|---|
| `index.html` | Home page: intro + recent posts | `.Site.Params.title`, `.Site.RegularPages` |
| `list.html` | Section listing (posts, about) | `.Title`, `.Pages` |
| `single.html` | Individual post or about page | `.Title`, `.Date`, `.Content`, `.ReadingTime` |
| `partials/post-card.html` | Post summary card | `.Title`, `.Date`, `.Summary`, `.Permalink` |

## CSS structure (`main.css`)

Sections in order, all values via `var(--token)` — no hardcoded hex or px:

1. `@import` of `tokens.css`
2. Base reset (`*, box-sizing`, `html`, `body`, `a`, `img`, `hr`)
3. Typography (headings h1–h4, body, lead paragraph, `.post-meta` date/reading-time line)
4. Layout (`.site-container` max-width, `.site-main` padding)
5. Navigation (`.site-header`, `.site-nav`, `.site-nav a`)
6. Post card (`.post-card`, `.post-card-title`, `.post-card-meta`, `.post-card-summary`)
7. Prose (`.post-body` — the rendered Hugo content block: `p`, `ul`, `ol`, `blockquote`, `pre`, `code`, `table`)
8. Utilities (`.sr-only` for accessibility)

## Fonts

Loaded from Google Fonts in `head.html`:
- Inter (400, 500, 600) — UI / nav
- Source Serif 4 (300, 400, 500, 600, 700 — optical size 8–60) — body text
- JetBrains Mono (400, 500) — inline code

Same as styleguide; no new decisions.

## Navigation

The existing `config.toml` menu entries (Home `/`, Blogs `/posts/`, About `/about/`) are rendered via `{{ range .Site.Menus.main }}` in `site-header.html`. Active page highlighted via `{{ if .Page.IsMenuCurrent "main" . }}` class.

## Quality bar (from §9 of STRATEGY.md)

Before the PR is opened:
- [ ] Uses only tokens from `tokens.css` — no inline hex/px outside the token file
- [ ] Renders at 320px, 768px, 1200px viewports
- [ ] `hugo build` exits 0 with no warnings
- [ ] All existing content pages render (posts + about sections)
- [ ] Keyboard-navigable focus rings visible
- [ ] Body line-length respects `--measure-prose` (68ch)

## Delivery

1. Commit all new files on `nuke_theme`
2. Open PR against `master`
3. Open GitHub issue titled "Design system: deferred §8 items" listing the out-of-scope items above
