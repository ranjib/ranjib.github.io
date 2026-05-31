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
