# ADR: Provider-Neutral Subscription Path

Date: 2026-08-12

Status: Proposed

## Context

The site needs an owned way for readers to follow new writing without relying on LinkedIn or any single discovery surface. RSS is available now and should remain the durable baseline. A monthly email digest, tentatively named **Field Notes on Reliable Systems**, can be added after the provider, consent, unsubscribe, export, archive, and privacy model is approved.

No third-party scripts, embedded forms, or email collection should be added before that approval.

## Options

| Provider | Double opt-in and unsubscribe | Export and portability | Custom domain support | Embed/API surface | Accessibility | Privacy/tracking posture | Cost/maintenance | Archive/RSS fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buttondown | Supports standard email newsletter compliance flows | CSV export is available | Supports custom sending domains on paid plans | Simple forms and API | Lightweight forms are easy to make accessible | Minimalist product, but tracking settings must be reviewed before launch | Low operational burden | Good fit for a monthly digest linking canonical posts |
| Ghost(Pro) | Supports subscriptions and unsubscribe flows | Member export is available | Strong custom-domain story | Full hosted publishing stack | Theme quality varies by configuration | More platform surface than this site needs | Higher cost and migration weight | Duplicates the canonical Hugo archive unless used carefully |
| ConvertKit | Mature creator-newsletter compliance tooling | Subscriber export is available | Supports custom domains/landing pages | Embeds and automations | Embeds must be checked carefully | Marketing automation defaults may exceed this site's privacy posture | More product than needed initially | Weak fit unless campaign automation becomes central |

## Decision

Keep RSS as the only live subscription mechanism for now. Do not collect email addresses until Ranjib approves a provider and the launch checklist in `docs/subscription-operations.md` is complete.

Buttondown is the leading candidate because it has the smallest integration surface for a monthly digest, but this ADR remains proposed until provider approval.

## Consequences

- `/subscribe/` links to the real RSS feed now and explains the planned digest without collecting addresses.
- Article CTAs point to `/subscribe/` instead of a placeholder form.
- A future provider integration must include a visible privacy statement, no hidden behavioral advertising, and a tested subscriber export path.
