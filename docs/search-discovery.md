# Search Discovery Setup

## Crawl Policy

The site publishes `robots.txt` from Hugo and allows normal crawling of public pages:

- `User-agent: *`
- `Allow: /`
- `Sitemap: https://ranjib.github.io/sitemap.xml`

Draft, private, repository, and generated working paths must not be linked from public pages or included in the sitemap. `scripts/validate-crawl.mjs` checks the generated `robots.txt`, sitemap URLs, accidental `noindex`, and accidental tracker scripts.

## Google Search Console

Verification is configurable through `params.search.googleSiteVerification` in `config.toml`. Leave it empty until the Search Console property gives an actual token. Do not commit private account notes or unrelated credentials.

Setup:

1. Create a URL-prefix property for `https://ranjib.github.io/`.
2. Choose the HTML tag verification method.
3. Copy only the token value into `params.search.googleSiteVerification`.
4. Build locally with `hugo --gc --minify`.
5. Confirm the generated homepage contains one `google-site-verification` meta tag.
6. Verify ownership in Search Console.
7. Submit `https://ranjib.github.io/sitemap.xml`.

Post-release checks:

- Inspect the homepage, `/start-here/`, `/subscribe/`, and the latest essay URL.
- Confirm the submitted sitemap is discovered and readable.
- Check Coverage/Indexing for excluded URLs that should be public.
- Check Enhancements for structured-data errors on representative posts.

## Canonical Domain Coordination

`docs/domain/adr-canonical-domain.md` owns the final canonical-domain decision. Until that ADR is approved and migrated, Search Console should use `https://ranjib.github.io/`, and campaign tooling should generate URLs on the same origin. If the canonical host changes, update:

- `baseURL` in `config.toml`;
- Search Console property and sitemap submission;
- `siteOrigin` in `scripts/campaign-url.mjs`, `scripts/validate-crawl.mjs`, `scripts/validate-metadata.mjs`, and `scripts/validate-rss.mjs`;
- distribution templates that paste canonical URLs.
