# Distribution Strategy

Publication should start a conversation, not end the writing process. Each substantial essay gets a small distribution package that preserves the canonical article as the source of truth and adapts the idea for the places where practitioners already talk.

## Cadence

Starting operating model:

- one substantial canonical essay every two weeks;
- two LinkedIn posts per week;
- five to ten substantive comments per week on relevant practitioner discussions;
- one monthly digest after the subscription foundation exists.

Adjust the cadence using the scorecard in `docs/measurement-plan.md`. Do not rewrite the existing issue calendar #34-#42 silently; add distribution tasks around those dates and record any future calendar decision explicitly.

## Package Contents

Every substantial article should produce:

- canonical website article;
- LinkedIn launch post;
- native 6-8 slide PDF carousel;
- focused follow-up post;
- monthly digest entry;
- selective outreach note;
- measurement snapshots at 48 hours, 7 days, and 30 days.

Use the issue template in `.github/ISSUE_TEMPLATE/article-distribution.md` to keep the lifecycle visible.

## Privacy And Voice

- Review every derivative for privacy, not only the canonical article.
- Do not publish family logistics, school/health/custody details, exact home operations, confidential employer information, or private knowledge-graph content.
- Keep first-person copy specific, useful, and plainly written.
- Do not automate comments, DMs, connection requests, or engagement.
- Outreach must be selective and relevant enough that a human could explain why the recipient or community benefits.

## UTM Rules

Use `node scripts/campaign-url.mjs` for all external campaign URLs. Internal links stay clean.

Example:

```bash
node scripts/campaign-url.mjs \
  --path /posts/context-engineering-evaluation-and-infrastructure-testing-lessons/ \
  --source linkedin \
  --medium social \
  --campaign context-engineering-evals \
  --content launch
```

## Community Playbook

Maintain a small target list. Submission details should come from public pages and be rechecked before use.

| Surface | Fit | Method |
| --- | --- | --- |
| LinkedIn | Primary conversation surface for SRE, platform, AI, and open-source peers | Publish manually from copy-ready drafts |
| SRE Weekly | Strong fit for reliability, observability, incident, and systems essays | Submit only when the article has direct practitioner value |
| DevOps Weekly | Strong fit for infrastructure automation and platform engineering | Submit only canonical article links |
| Platform Weekly | Strong fit for platform engineering and internal developer platform essays | Submit only high-signal platform pieces |
| Relevant practitioner communities | Focused discussion when the essay directly answers a recurring problem | Share manually and participate in comments |
| Past Chef/SRE peers | Selective peer critique or context when the piece overlaps shared public work | One-to-one note only when clearly relevant |
| AI-engineering communities | Useful for agent evals, context engineering, and observability topics | Share as a concrete artifact, not a generic promotion |

## Feedback Loop

Capture feedback in the article distribution issue:

- direct corrections or stronger examples;
- disagreements worth answering in a follow-up;
- repeated questions that reveal unclear writing;
- communities where the piece did or did not fit;
- Search Console or social preview issues.

Useful feedback should become edits, follow-up posts, or future topic ideas. Do not copy private identities or private messages into the public repository.
