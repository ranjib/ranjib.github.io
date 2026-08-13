# Social Metadata Checks

This site emits canonical URLs, page descriptions, Open Graph tags, Twitter/X card tags, and JSON-LD from `layouts/partials/metadata.html`.

Run the local validation flow before publishing metadata changes:

```sh
hugo --gc --minify
node scripts/validate-metadata.mjs
```

The validator checks representative generated pages for one canonical URL, bounded descriptions, required Open Graph fields, absolute raster share images, parseable JSON-LD, and local/private path leaks.

After deployment, refresh LinkedIn's cached preview for the current context-engineering article with LinkedIn Post Inspector:

```text
https://www.linkedin.com/post-inspector/
```

Inspect this URL:

```text
https://ranjib.github.io/posts/context-engineering-evaluation-and-infrastructure-testing-lessons/
```

The expected preview uses `https://ranjib.github.io/images/social/context-engineering-evals-card.png` as a large image card.
