# Subscription Operations

## Monthly Digest Template

Working name: **Field Notes on Reliable Systems**

Cadence: monthly, only when there is enough useful material to send.

Template:

```markdown
Subject: Field Notes on Reliable Systems: <primary topic>

Opening:
One short paragraph explaining the practical theme of the month.

Latest essay:
- <Title>
- <Canonical URL>
- <One-sentence reason to read>

Related from the archive:
- <Title>
- <Canonical URL>
- <Why it connects>

Maker or field note:
- <Title or short note>
- <Canonical URL if published>
- <Operational lesson>

What I am learning:
One short note about a tool, habit, book, or system being explored.

Footer:
Unsubscribe link, sender identity, and a reminder that canonical writing lives at ranjib.github.io.
```

## Launch Checklist

- Provider is approved in `docs/newsletter-provider-adr.md`.
- Double opt-in behavior is enabled or explicitly waived with a documented reason.
- Unsubscribe is visible in every email and works without account creation.
- Subscriber export has been tested and documented with screenshots or provider docs.
- Tracking pixels and click tracking are disabled unless explicitly approved.
- The subscribe form has accessible labels, works without layout shift, and has a visible privacy statement.
- No full canonical article is duplicated into the provider by default.

## Export Procedure

1. Export all subscribers as CSV from the provider dashboard.
2. Save the export outside the repository in private storage.
3. Verify the CSV includes email address, subscription status, consent timestamp if available, and unsubscribe status.
4. Delete any local temporary copies after verification.

## Provider Removal Procedure

1. Remove the provider embed, script, API call, or hosted-form link from the site.
2. Replace the form with the RSS-only Subscribe CTA.
3. Export subscribers before closing the provider account.
4. Confirm `/subscribe/` still builds and links to `/index.xml`.
5. Run `hugo --gc --minify` and `node scripts/validate-rss.mjs`.
