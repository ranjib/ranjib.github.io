---
description: "Manual editorial research radar that creates one review issue."
on:
  workflow_dispatch:
    inputs:
      lookback_days:
        description: "Number of recent days to research"
        required: false
        default: "14"
        type: string
      focus:
        description: "Optional focus area or blank for all lanes"
        required: false
        default: ""
        type: string

permissions:
  contents: read
  issues: read
  pull-requests: read

engine: codex

tools:
  github:
    toolsets: [issues, pull_requests]
  web-search:
  web-fetch:

safe-outputs:
  create-issue:
    title-prefix: "Research Radar - "
    max: 1
---

# Editorial Research Radar

Read `docs/editorial-radar.md` first. Treat it as the controlling policy for
this run.

Research meaningful external developments from the last
`${{ github.event.inputs.lookback_days || '14' }}` days for
`ranjib/ranjib.github.io`. If `${{ github.event.inputs.focus }}` is non-empty,
use it as a focus area; otherwise cover all editorial lanes.

Before researching:

- Read `README.md`.
- Read `CLAUDE.md`.
- Read `docs/blog-pipeline.md`.
- Read `docs/systems-in-practice-hub.md`.
- Read `docs/editorial-radar.md`.
- Inspect existing published posts under `content/posts/`.
- Inspect open GitHub blog and publishing issues.
- Inspect `data/research-sources.yaml`.
- Inspect `data/research-signals.json`.

Prioritize findings that intersect with:

- systems and reliability;
- GenAI practice;
- open source and physical computing;
- hobbies as systems;
- career retrospectives.

Use web search and web fetch only for public sources. Prefer primary,
engineering, standards, research, extension, and project-maintainer sources.
Explain when lower-authority sources materially influence a recommendation.

For each candidate, compare against existing posts, docs, and open issues.
Suppress duplicates and trend-only items. A candidate should have at least one
of these connections:

- first-hand systems, reliability, platform, or open-source experience;
- a GenAI or tooling experiment Ranjib could run;
- a real hobby-system observation;
- a contradiction or update to an existing post;
- a cross-domain systems lesson.

Create exactly one GitHub issue for the run. Use a title like:

```text
Research Radar - 2026-W35
```

The issue body must include:

- run date and lookback window;
- source strategy and public/private boundary note;
- approximately 10 to 15 high-signal findings when available;
- repeated weak signals;
- rejected trend-only candidates;
- suggested experiments before writing;
- open questions for Ranjib;
- next review date.

Each finding must include:

```text
Finding
Why it matters
Editorial lane
Connection to existing article, issue, or backlog item
Potential thesis
Public sources
Freshness
Confidence
Scores: impact, relevance, novelty, evidence quality, lived-experience fit
Recommended disposition: ignore | watch | experiment | update-existing | write
```

Do not create articles. Do not modify published content. Do not create pull
requests. Do not change site branding, domain configuration, GitHub Pages
settings, newsletter configuration, or private knowledge-graph content. Do not
post to social networks or send outreach.

If no finding clears the quality bar, create a short issue explaining that the
radar found no actionable signal and listing the strongest rejected candidates.

Maintainer note: this workflow defaults to Codex. To run the same contract with
Claude Code, change `engine: codex` to `engine: claude`, configure the required
secret, and recompile with `gh aw compile`.
