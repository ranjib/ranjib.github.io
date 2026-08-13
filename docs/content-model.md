# Content Model

Public posts use a small, stable frontmatter contract:

```yaml
title: "Post Title"
date: 2026-08-13T00:00:00-07:00
draft: false
description: "Search and social snippet under 160 characters."
summary: "Plain card and listing copy for readers."
lane: "engineering-ai"
tags:
  - "context engineering"
featured: false
images:
  - "images/social/default-card.png"
image_alt: "Ranjib Dey social preview"
```

## Lanes

Every published post needs exactly one primary `lane`.

Allowed lane values:

- `engineering-ai`: Engineering & AI
- `open-source-making`: Open Source & Making
- `field-notes`: Field Notes
- `learning-life`: Learning & Life

Add or rename lanes only by updating all of these together:

- `data/lanes.toml`
- `content/lanes/*/_index.md`
- existing post frontmatter
- any homepage or Start Here links that point at the lane

`learning-life` is for public-safe learning and reflection. Do not use it for family logistics, child-identifying details, health records, precise home information, relationship details, or private knowledge-graph material.

## Tags

Use focused, reusable tags. Prefer stable topic names such as `context engineering`, `reliability`, `reef-pi`, `open source`, and `field planning`.

Do not create one-off tags unless a future reader would reasonably browse by that topic.

## Summaries

`description` is for metadata and should stay concise. `summary` is reader-facing card copy and must be plain text so listing pages emit valid HTML.

The post card partial intentionally reads `summary` first and falls back to a plainified Hugo summary only when needed.

## Related Reading

Related reading is driven by Hugo's related-content configuration in `config.toml`. Shared `lane` has the highest weight, followed by shared `tags`, then date proximity. Article pages show up to four related posts and exclude the current post.
