# Custom Domain Migration Runbook

This runbook should be executed only after the ADR in `docs/domain/adr-canonical-domain.md` is approved.

## Preflight

- [ ] Confirm canonical host decision.
- [ ] Confirm registrar and DNS provider access.
- [ ] Confirm no secrets, credentials, or private DNS account details will be committed.
- [ ] Capture current generated output with `hugo --gc --minify`.
- [ ] Run all validators.
- [ ] Capture Search Console baseline: sitemap status, indexed pages, and representative URL inspection.
- [ ] Capture current social previews for homepage, Start Here, Subscribe, About, and the latest essay.
- [ ] Confirm RSS feed subscribers should continue receiving the same article paths under the new host.

## Repository Migration

After approval:

1. Add `static/CNAME` containing the approved canonical domain, for example `ranjib.com`.
2. Update `baseURL` in `config.toml`.
3. Update host constants in validation and campaign scripts.
4. Update docs and prepared distribution/profile URLs.
5. Build with `hugo --gc --minify`.
6. Run:
   - `node scripts/validate-metadata.mjs`
   - `node scripts/validate-content-model.mjs`
   - `node scripts/validate-rss.mjs`
   - `node scripts/validate-crawl.mjs`
   - `node scripts/validate-distribution.mjs`
   - `node scripts/validate-brand.mjs`
   - `node scripts/validate-domain.mjs`
7. Open a PR and wait for deployment.

## External Manual Steps

Do not perform these from Codex without explicit owner control:

- registrar changes;
- DNS changes;
- GitHub Pages custom-domain setting;
- HTTPS enforcement toggle;
- Search Console properties and change-of-address steps;
- LinkedIn/profile URL changes;
- newsletter sender or domain authentication.

## Release Validation

Check:

- apex behavior;
- `www` behavior;
- HTTPS certificate state;
- homepage canonical URL;
- representative post canonical URL;
- About canonical URL;
- RSS channel and item links;
- sitemap host;
- robots sitemap line;
- GitHub Pages old URL behavior;
- 404 page behavior;
- social preview refresh;
- Search Console sitemap and indexing;
- mixed content;
- redirect loops.

## Rollback

If the custom domain fails:

1. Revert `static/CNAME`, `baseURL`, host constants, and docs/profile URL changes in a PR.
2. Remove or disable the custom domain in GitHub Pages settings.
3. Restore DNS to the pre-migration state or park the host according to registrar guidance.
4. Rebuild and verify `https://ranjib.github.io/`.
5. Resubmit `https://ranjib.github.io/sitemap.xml` if Search Console was changed.
6. Record the failure mode and retry plan in the tracking issue.

## Monitoring

- 24 hours: certificate state, redirects, canonical tags, RSS, sitemap, Search Console URL inspection.
- 7 days: indexed pages, crawl errors, old URL behavior, social previews.
- 30 days: search impressions/clicks, backlinks, feed behavior, profile links, and distribution templates.
