# Design System Strategy — ranjib.dev

## §1 Purpose

This document governs the design system for ranjib.dev. It defines the workflow, constraints, and decision-making authority for all visual changes.

## §2 Design token hierarchy

`design-system/tokens.css` is the **single source of truth** for every visual value. Two categories:

- **Primitive tokens** — raw palette values (e.g. `--ink-12`, `--accent-terra`). Defined once, never changed except for palette refresh.
- **Semantic tokens** — context-specific values that map to primitives (e.g. `--text`, `--bg`, `--link`). Light and dark modes both live in `tokens.css`.

**Rule:** `assets/css/main.css` may reference only semantic tokens. No primitive token should appear outside `tokens.css`.

## §3 File roles

| File | Role |
|------|------|
| `design-system/tokens.css` | All CSS custom properties. Inlined per page via `os.ReadFile`. |
| `design-system/STRATEGY.md` | This file. Governance and decisions. |
| `design-system/styleguide.html` | Static HTML preview of all components. Reference for new components. |
| `design-system/templates/*.html` | Static HTML page mockups (home, post, listing, about). |
| `assets/css/main.css` | Layout and component CSS. References tokens only. |
| `layouts/partials/` | Hugo templates. Must use same class names as styleguide. |

## §4 Two-tool workflow

When designing a new component:

1. **Tool 1 — Static design:** Edit `design-system/styleguide.html` and/or a template in `design-system/templates/`. Use only token variables. Get visual sign-off before writing Hugo templates.
2. **Tool 2 — Hugo binding:** Copy HTML from the styleguide into the relevant partial. Wire up Hugo variables.

Never write Hugo template code first. Always design in static HTML.

## §5 Adding tokens

1. Add the primitive to `:root` in `tokens.css`.
2. Add a semantic alias in both `:root, [data-theme="light"]` and `[data-theme="dark"]` blocks.
3. Document the intended usage in a comment.
4. Update `design-system/styleguide.html` with a swatch or example.

## §6 Dark mode

Dark mode is driven by `[data-theme="dark"]` on the `<html>` element. The toggle is in `layouts/partials/site-header.html`. User preference is persisted to `localStorage`.

Tokens that differ between light and dark are declared in both blocks in `tokens.css`. If a token is the same in both modes, declare it only in `:root`.

## §7 CLAUDE.md

`CLAUDE.md` at the repo root summarises these rules for agentic sessions.

## §8 Deferred items (tracked in GitHub issue #22)

- Code syntax highlighting (Chroma theme using `--syn-*` tokens)
- Responsive image pipeline (WebP + fallback, lazy loading)
- Search (Pagefind, post-build)
- RSS (Hugo default is live; custom template deferred)
- Comments (stance: none)
- Dark/light mode toggle (JS + `data-theme`)
- `design-system/templates/` HTML page mockups

## §9 Quality bar

Before any PR touching visual code:

- No hardcoded hex, rgb, or px values outside `tokens.css`
- All new tokens added to `tokens.css` first
- `hugo build` exits 0 with no warnings
- Checked at 320px, 768px, 1200px
- Focus rings visible on all interactive elements
- `design-system/styleguide.html` updated to reflect any new components
