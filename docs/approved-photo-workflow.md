# Approved Photo Workflow

Use this workflow when adding KG-exported photos to public posts.

## Boundary

Agents may use only approved website-side artifacts:

- `data/photo-suggestions/<post-slug>.json`
- `assets/images/posts/<post-slug>/<public-photo-id>.jpg`

Do not read private KG photo inventories, raw cluster manifests, face labels,
local Photos library exports, or unapproved candidate files from this repo. The
private KG approval/export workflow is responsible for turning private photo
metadata into public-safe website artifacts.

## Agent Steps

1. Read `content/posts/<post-slug>.md`.
2. Read `data/photo-suggestions/<post-slug>.json` when it exists.
3. Use only photos already present in that approved suggestion manifest.
4. Insert the existing Hugo shortcode near relevant prose:

   ```go-html-template
   {{< img src="images/posts/<post-slug>/<public-photo-id>.jpg" alt="Approved alt text" caption="Approved caption." >}}
   ```

5. Use the approved `alt` and `caption` values exactly unless Ranjib explicitly
   asks for a new KG approval pass.
6. Preserve the post's editorial voice. The photo should support existing prose;
   do not add private context to justify it.
7. Run:

   ```bash
   node scripts/validate-approved-photos.mjs
   hugo --minify
   node scripts/validate-content-model.mjs public
   ```

## Validation Rules

`scripts/validate-approved-photos.mjs` checks approved KG photo usage:

- suggestion manifests are valid JSON
- `generator_version` is `photo-blog-publishing-v1`
- filename slug, manifest `post_slug`, and content post slug match
- optional `review_status` is `approved`
- image paths stay under `assets/images/posts/<post-slug>/`
- referenced images exist
- alt text, caption, KG provenance, and public photo IDs are present
- inserted `photo-*` shortcodes match the approved manifest alt and caption

Existing non-KG images are not forced into this workflow. The strict matching
rules apply to KG-approved `photo-*` assets.
