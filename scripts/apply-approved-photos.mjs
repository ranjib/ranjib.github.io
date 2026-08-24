#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const checkOnly = args.has("--check");
const postArg = valueAfter("--post");
const contentRoot = valueAfter("--content-root") || "content/posts";
const suggestionsRoot = valueAfter("--suggestions-root") || "data/photo-suggestions";
const assetsRoot = valueAfter("--assets-root") || "assets";

const failures = [];
const changes = [];

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function fail(target, message) {
  failures.push(`${target}: ${message}`);
}

function collectJson(dir) {
  if (!existsSync(dir)) return [];
  const found = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      found.push(...collectJson(fullPath));
    } else if (entry.endsWith(".json")) {
      found.push(fullPath);
    }
  }
  return found.sort();
}

function parseArgs(raw) {
  const attrs = {};
  const pattern = /([A-Za-z_]+)="([^"]*)"/g;
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function escapeShortcode(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function shortcode(photo) {
  return `{{< img src="${escapeShortcode(photo.image_path)}" alt="${escapeShortcode(photo.alt)}" caption="${escapeShortcode(photo.caption)}" >}}`;
}

function validatePhoto(slug, photo, target, index) {
  const item = `${target} photos[${index}]`;
  if (!photo.public_photo_id?.startsWith("photo-")) {
    fail(item, "public_photo_id must start with photo-");
  }
  if (photo.review_status && photo.review_status !== "approved") {
    fail(item, "review_status must be approved when present");
  }
  if (!photo.image_path?.startsWith(`images/posts/${slug}/`)) {
    fail(item, `image_path must start with images/posts/${slug}/`);
  }
  if (!photo.alt) {
    fail(item, "missing alt text");
  }
  if (!photo.caption) {
    fail(item, "missing caption");
  }
  if (!photo.kg_source?.startsWith("llm-wiki-ranjib:")) {
    fail(item, "kg_source must start with llm-wiki-ranjib:");
  }
  if (photo.image_path && !existsSync(join(assetsRoot, photo.image_path))) {
    fail(item, `referenced image does not exist: ${join(assetsRoot, photo.image_path)}`);
  }
}

function insertionPoint(markdown) {
  const frontmatter = markdown.match(/^---\n[\s\S]*?\n---\n*/);
  const start = frontmatter ? frontmatter[0].length : 0;
  const body = markdown.slice(start);
  const paragraph = body.match(/\n{2,}/);
  if (!paragraph) return markdown.length;
  return start + paragraph.index + paragraph[0].length;
}

function applyPhotos(markdown, photos) {
  const missing = photos.filter((photo) => !markdown.includes(`src="${photo.image_path}"`));
  if (missing.length === 0) {
    return { markdown, inserted: [] };
  }
  const block = missing.map(shortcode).join("\n\n") + "\n\n";
  const index = insertionPoint(markdown);
  return {
    markdown: markdown.slice(0, index) + block + markdown.slice(index),
    inserted: missing,
  };
}

for (const file of collectJson(suggestionsRoot)) {
  const target = relative(".", file);
  const slug = basename(file, ".json");
  if (postArg && slug !== postArg) continue;

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(target, `invalid JSON: ${error.message}`);
    continue;
  }
  if (manifest.post_slug !== slug) {
    fail(target, `post_slug '${manifest.post_slug || ""}' must match filename slug '${slug}'`);
  }
  if (!Array.isArray(manifest.photos) || manifest.photos.length === 0) {
    fail(target, "photos must be a non-empty array");
    continue;
  }
  manifest.photos.forEach((photo, index) => validatePhoto(slug, photo, target, index));
  if (failures.length > 0) continue;

  const postPath = join(contentRoot, `${slug}.md`);
  if (!existsSync(postPath)) {
    fail(target, `target post does not exist: ${postPath}`);
    continue;
  }

  const before = readFileSync(postPath, "utf8");
  const { markdown, inserted } = applyPhotos(before, manifest.photos);
  if (inserted.length === 0) continue;

  changes.push({ postPath, inserted });
  if (!dryRun && !checkOnly) {
    writeFileSync(postPath, markdown);
  }
}

if (failures.length > 0) {
  console.error("Approved photo apply failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (checkOnly && changes.length > 0) {
  console.error("Approved photo apply check failed:");
  for (const change of changes) {
    console.error(`- ${change.postPath}: ${change.inserted.length} approved photo(s) not inserted`);
  }
  process.exit(1);
}

for (const change of changes) {
  const action = dryRun || checkOnly ? "would insert" : "inserted";
  console.log(`${action} ${change.inserted.length} approved photo(s): ${change.postPath}`);
}
if (changes.length === 0) {
  console.log("No approved photos to apply.");
}
