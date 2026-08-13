# Systems in Practice Hub

Date: 2026-08-13

Status: Epic #53 completion map.

This document records the durable operating surface created by the Systems in
Practice epic. It is the handoff map for future website, profile, distribution,
and domain work after child issues #54 through #61.

## Canonical Website Surfaces

| Surface | Purpose | Source |
| --- | --- | --- |
| Homepage | First-screen identity, positioning, lanes, and recent work | `content/_index.md`, `layouts/index.html` |
| Start Here | Guided reading path for first-time visitors | `content/start-here.md` |
| Content lanes | Browseable audience-facing lanes | `content/lanes/**`, `content/posts/**` |
| Subscribe | Provider-neutral subscription destination | `content/subscribe.md` |
| About | Personal and public profile context | `content/about/**` |
| RSS | Durable feed identity and canonical item URLs | `layouts/_default/rss.xml` |
| Crawl metadata | Robots and sitemap discovery | `layouts/robots.txt`, Hugo sitemap output |

## Operating Assets

| Workstream | Durable Assets | Validator |
| --- | --- | --- |
| Metadata and social sharing | `layouts/partials/metadata.html`, `docs/social-metadata.md`, `static/images/social/**` | `scripts/validate-metadata.mjs` |
| Content model | `docs/content-model.md`, lane front matter, related-reading metadata | `scripts/validate-content-model.mjs` |
| RSS and subscription | `docs/newsletter-provider-adr.md`, `docs/subscription-operations.md`, monthly digest template | `scripts/validate-rss.mjs` |
| Search and measurement | `docs/search-discovery.md`, `docs/analytics-adr.md`, `docs/measurement-plan.md`, campaign URL helper | `scripts/validate-crawl.mjs` |
| Distribution | `docs/distribution/**`, article distribution issue template | `scripts/validate-distribution.mjs` |
| Brand and LinkedIn rollout | `docs/brand/**`, LinkedIn banner source and export | `scripts/validate-brand.mjs` |
| Domain ownership | `docs/domain/**` | `scripts/validate-domain.mjs` |

## Definition of Done Map

| Epic Requirement | Status | Evidence |
| --- | --- | --- |
| A first-time visitor can understand who Ranjib is, what he writes about, and where to start within one screen. | Done | Homepage and `/start-here/` |
| Every public page emits page-specific metadata and canonical URLs. | Done | Metadata partial and validator |
| The context-engineering article has a high-quality LinkedIn preview. | Done | Dedicated social card and golden distribution package |
| Readers can browse by lane, move to related writing, understand the author, and subscribe. | Done | Lane pages, post partials, author block, Subscribe CTA |
| RSS identifies the site correctly and validates. | Done | Custom RSS template and RSS validator |
| Search Console and attribution setup are documented and operationally defined. | Done | Search discovery, measurement plan, campaign URL helper |
| Substantial essays produce reusable launch, carousel, follow-up, outreach, and measurement assets. | Done | Distribution workflow, templates, and golden package |
| LinkedIn headline, About, Featured, and banner assets align with the website. | Done | Brand narrative and LinkedIn rollout pack |
| A canonical domain decision is recorded and gated before mutation. | Done | Domain ADR, inventory, snapshot, and runbook |
| Hugo build and relevant HTML/feed checks pass in CI. | Done | Build and deploy workflows run all validators |
| Design changes follow the local design system. | Done | Design strategy, tokens, styleguide, and templates |

## Remaining Owner Decisions

These are intentionally not automated by the epic:

- approve or revise the canonical-domain ADR before changing `baseURL`, `CNAME`,
  DNS, GitHub Pages settings, Search Console, or profile URLs;
- choose and configure a newsletter provider, or continue RSS-only subscription;
- add Search Console verification tokens through approved configuration;
- apply the LinkedIn rollout pack manually on LinkedIn;
- decide whether future blog issues #34 through #42 should each receive a
  distribution package before or after publication.

## Validation Gates

Run the same checks before changing any hub surface:

```bash
hugo --gc --minify
node scripts/validate-metadata.mjs
node scripts/validate-content-model.mjs
node scripts/validate-rss.mjs
node scripts/validate-crawl.mjs
node scripts/validate-distribution.mjs
node scripts/validate-brand.mjs
node scripts/validate-domain.mjs
git diff --check
```
