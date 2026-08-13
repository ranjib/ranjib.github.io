# Campaign Attribution

Campaign URLs should identify where a reader discovered a canonical page without changing the canonical URL itself. Use UTM links only in off-site distribution surfaces such as LinkedIn posts, newsletters, and community submissions.

## Convention

Allowed `utm_source` values:

- `linkedin`
- `newsletter`
- `sreweekly`
- `devopsweekly`
- `platformweekly`
- `community`

Allowed `utm_medium` values:

- `social`
- `email`
- `referral`

Allowed `utm_content` values:

- `launch`
- `carousel`
- `followup`
- `profile`
- `digest`

`utm_campaign` should be lowercase words and numbers joined by hyphens, usually the essay or monthly digest slug.

## Command

```bash
node scripts/campaign-url.mjs \
  --path /posts/context-engineering-evaluation-and-infrastructure-testing-lessons/ \
  --source linkedin \
  --medium social \
  --campaign context-engineering-evals \
  --content launch
```

The script removes existing query strings and fragments, validates the destination stays on `https://ranjib.github.io`, and prints a shareable campaign URL.

## Rules

- Keep the page canonical tag clean; do not include UTM parameters in canonical URLs.
- Do not use UTM links for internal navigation.
- Do not encode private audience notes, employer names, family details, or recipient identifiers in campaign parameters.
- Prefer one launch URL, one carousel URL, and one follow-up URL per substantial essay.
