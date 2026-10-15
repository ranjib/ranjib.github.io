#!/bin/sh
set -eu

mode=${1:-}
hugo_cache=${HUGO_CACHEDIR:-${TMPDIR:-/tmp}/ranjib-hugo-cache}

build_site() {
  HUGO_CACHEDIR="$hugo_cache" hugo --gc --minify
}

case "$mode" in
  build)
    build_site
    ;;
  lint)
    # Render-dependent checks consume public/, so make this command
    # independently reproducible rather than relying on validator order.
    build_site
    node scripts/validate-metadata.mjs
    node scripts/validate-content-model.mjs
    node scripts/validate-rendered-posts.mjs
    node scripts/apply-approved-photos.mjs --check
    node scripts/validate-approved-photos.mjs
    node scripts/validate-rss.mjs
    node scripts/validate-crawl.mjs
    node scripts/validate-distribution.mjs
    node scripts/validate-brand.mjs
    node scripts/validate-domain.mjs
    ;;
  test)
    go test ./...
    go run ./cmd/validate-editorial-radar
    bash scripts/test_plan_provenance.sh
    ;;
  *)
    echo "usage: $0 {build|lint|test}" >&2
    exit 2
    ;;
esac
