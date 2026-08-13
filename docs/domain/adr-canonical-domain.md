# ADR: Canonical Custom Domain

Date: 2026-08-13

Status: Proposed - owner approval required before repository or DNS migration.

## Context

The site currently publishes from GitHub Pages at `https://ranjib.github.io/`. The repository has conflicting domain references:

- `config.toml`: `https://ranjib.github.io`
- `README.md`: `ranjib.com` / `ranjib.github.io`
- `CLAUDE.md` and design-system docs: `ranjib.dev`

Issue #61 requires a durable canonical domain, but explicitly says not to guess and not to mutate DNS, GitHub Pages custom-domain settings, or `baseURL` without owner control.

## Observed State

Observed on 2026-08-13:

| Surface | Observation |
| --- | --- |
| GitHub Pages API | repository Pages URL is `https://ranjib.github.io/`; custom domain is not configured; HTTPS is enforced |
| `ranjib.com` apex DNS | A records observed: `15.197.225.128`, `3.33.251.168` |
| `www.ranjib.com` DNS | CNAME observed: `ranjib.github.com.` |
| `www.ranjib.com` HTTPS | `curl -I https://www.ranjib.com/` did not resolve in this environment |
| `ranjib.dev` DNS | no A, AAAA, or CNAME records observed |
| `www.ranjib.dev` DNS | no A or CNAME records observed |

Ownership, registrar, renewal status, DNS provider, redirect capability, and email implications are not verifiable from the repository. Ranjib must confirm them before migration.

## Decision

Keep `https://ranjib.github.io/` as the active canonical host until owner approval.

Recommended target after approval: `https://ranjib.com/`.

Reasons:

- `ranjib.com` is the clearest personal master identity and fits career plus hobbies.
- It is already referenced by `README.md` and the public GitHub profile blog field.
- It is more verbally durable than a platform-shaped `github.io` URL.
- It is broader than `ranjib.dev`, which may over-index on software and currently has no observed DNS records.

Recommended secondary role:

- `www.ranjib.com`: redirect or alias to `https://ranjib.com/` after DNS and GitHub Pages behavior are verified.
- `ranjib.dev`: park or redirect only if ownership and DNS control are confirmed.
- `ranjib.github.io`: preserve through GitHub Pages' supported behavior and verify old article paths after migration.

## Required Approval Gate

Before any `CNAME`, `baseURL`, Search Console, profile, or DNS change:

- Ranjib confirms ownership/control of `ranjib.com`.
- Ranjib confirms registrar and DNS provider constraints.
- Ranjib confirms whether apex, `www`, or both can be configured for GitHub Pages.
- Ranjib approves `ranjib.com` as canonical and decides whether `www` redirects to apex or apex redirects to `www`.
- Ranjib confirms email implications, including whether MX records must remain untouched.

## Consequences

- This PR documents the decision path and adds tests for current canonical-host consistency.
- It intentionally does not add a `CNAME` file.
- It intentionally does not change Hugo `baseURL`.
- A follow-up PR should perform the repository migration after approval.
