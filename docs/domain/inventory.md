# Domain Inventory

Generated from repository search and public checks on 2026-08-13.

## Repository References

| Domain | Current Role |
| --- | --- |
| `ranjib.github.io` | active Hugo `baseURL`, generated canonical host, RSS/sitemap host, campaign URL host, profile links, distribution examples |
| `ranjib.com` | public profile blog field and recommended custom-domain candidate after owner approval; not configured as GitHub Pages custom domain |
| `ranjib.dev` | historical design-system/superpowers wording only; not configured as Hugo `baseURL` |

Files with canonical-host behavior:

- `config.toml`
- `layouts/partials/metadata.html`
- `layouts/robots.txt`
- `layouts/_default/rss.xml`
- `scripts/validate-metadata.mjs`
- `scripts/validate-rss.mjs`
- `scripts/validate-crawl.mjs`
- `scripts/campaign-url.mjs`
- `scripts/validate-distribution.mjs`
- `scripts/validate-brand.mjs`

Docs and prepared distribution/profile artifacts with host-specific URLs:

- `README.md`
- `CLAUDE.md`
- `docs/search-discovery.md`
- `docs/campaign-attribution.md`
- `docs/social-metadata.md`
- `docs/subscription-operations.md`
- `docs/blog-pipeline.md`
- `docs/distribution/**`
- `docs/brand/**`
- `design-system/**`

Historical planning notes under `docs/superpowers/**` may still mention `ranjib.dev` because they describe the older theme/design migration context, not the current canonical host.

## GitHub Pages

Observed through GitHub API on 2026-08-13:

- Pages source: `gh-pages` branch, `/`
- Current Pages URL: `https://ranjib.github.io/`
- Custom domain: none
- HTTPS enforced: true
- Build type: legacy

## Public DNS Observations

These are observations, not proof of ownership.

| Host | Observed Records |
| --- | --- |
| `ranjib.com` | A: `15.197.225.128`, `3.33.251.168`; no AAAA; no CNAME |
| `www.ranjib.com` | CNAME: `ranjib.github.com.` |
| `ranjib.dev` | no A, AAAA, or CNAME observed |
| `www.ranjib.dev` | no A or CNAME observed |

## Manual Ownership Inventory Needed

Before migration, record privately:

- registrar for `ranjib.com`;
- DNS provider for `ranjib.com`;
- renewal owner and renewal date;
- whether MX records exist and must be preserved;
- whether apex ALIAS/ANAME or GitHub Pages A records can be configured;
- whether `www` can redirect cleanly to apex;
- whether `ranjib.dev` is owned and should redirect, park, or stay unused.
