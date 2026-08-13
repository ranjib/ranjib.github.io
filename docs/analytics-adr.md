# ADR: Privacy-Aware Measurement

Date: 2026-08-13

Status: Proposed

## Context

The site needs enough measurement to understand discovery and distribution quality. It should not become an invasive tracking surface.

## Options

### Option 1: Search Console + Provider-Side Analytics Only

Use Google Search Console for search discovery, LinkedIn native analytics for LinkedIn posts, and newsletter provider analytics after a provider is approved.

Benefits:

- no on-site analytics script;
- no cookies, fingerprinting, ad pixels, or extra client requests;
- enough signal for indexing, campaign-link use, and launch retrospectives.

Costs:

- limited path-level behavior on the website;
- campaign visits require downstream provider or server-side hosting data to quantify precisely;
- returning-reader signals remain qualitative unless a provider is later approved.

### Option 2: Minimal Privacy-First On-Site Analytics

Add a privacy-first provider only after approval and disclosure updates.

Requirements:

- no cookies;
- no fingerprinting;
- no behavioral advertising or cross-site tracking;
- aggregate reporting only;
- documented data retention;
- visible privacy statement before launch.

Benefits:

- clearer campaign and returning-reader data;
- easier 48-hour, 7-day, and 30-day scorecards.

Costs:

- adds third-party surface area;
- requires disclosure, provider review, and ongoing maintenance.

## Decision

Proceed with Option 1 for now. Do not add analytics code until this ADR is approved for a specific provider and the required disclosure work is complete.

## Consequences

- Search Console setup and campaign URL generation can ship now.
- `scripts/validate-crawl.mjs` fails if common analytics/tracking scripts appear in generated HTML.
- Future provider work must update this ADR, the privacy posture on `/subscribe/`, and the validation allowlist intentionally.
