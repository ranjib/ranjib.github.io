#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const contentRoot = "content/posts";
const suggestionsRoot = "data/photo-suggestions";
const approvedIDPrefix = "photo-";
const generatorVersion = "photo-blog-publishing-v1";

const failures = [];

function fail(target, message) {
  failures.push(`${target}: ${message}`);
}

function collectFiles(dir, suffix) {
  if (!existsSync(dir)) return [];
  const found = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      found.push(...collectFiles(fullPath, suffix));
    } else if (entry.endsWith(suffix)) {
      found.push(fullPath);
    }
  }
  return found.sort();
}

function loadSuggestions() {
  const byImagePath = new Map();
  for (const file of collectFiles(suggestionsRoot, ".json")) {
    const target = relative(".", file);
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
      fail(target, `invalid JSON: ${error.message}`);
      continue;
    }

    const slug = basename(file, ".json");
    if (manifest.generator_version !== generatorVersion) {
      fail(target, `generator_version must be ${generatorVersion}`);
    }
    if (manifest.post_slug !== slug) {
      fail(target, `post_slug '${manifest.post_slug || ""}' must match filename slug '${slug}'`);
    }
    if (!existsSync(join(contentRoot, `${slug}.md`))) {
      fail(target, `target post '${slug}' does not exist`);
    }
    if (!Array.isArray(manifest.photos) || manifest.photos.length === 0) {
      fail(target, "photos must be a non-empty array");
      continue;
    }

    for (const [index, photo] of manifest.photos.entries()) {
      const item = `${target} photos[${index}]`;
      if (!photo.public_photo_id?.startsWith(approvedIDPrefix)) {
        fail(item, `public_photo_id must start with ${approvedIDPrefix}`);
      }
      if (photo.review_status && photo.review_status !== "approved") {
        fail(item, "review_status must be approved when present");
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
      if (!photo.image_path?.startsWith(`images/posts/${slug}/`)) {
        fail(item, `image_path must start with images/posts/${slug}/`);
        continue;
      }

      const assetPath = join("assets", photo.image_path);
      if (dirname(assetPath) !== join("assets", "images", "posts", slug)) {
        fail(item, "image_path must stay directly under the post image directory");
      }
      if (!existsSync(assetPath)) {
        fail(item, `referenced image does not exist: ${assetPath}`);
      }
      byImagePath.set(photo.image_path, { ...photo, slug, target: item });
    }
  }
  return byImagePath;
}

function parseShortcodeAttrs(raw) {
  const attrs = {};
  const pattern = /([A-Za-z_]+)="([^"]*)"/g;
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function validatePostShortcodes(suggestionsByImagePath) {
  const shortcodePattern = /\{\{<\s+img\s+([^>]*)>\}\}/g;
  for (const file of collectFiles(contentRoot, ".md")) {
    if (basename(file) === "_index.md") continue;
    const slug = basename(file, ".md");
    const markdown = readFileSync(file, "utf8");
    const target = relative(".", file);
    let match;
    while ((match = shortcodePattern.exec(markdown)) !== null) {
      const attrs = parseShortcodeAttrs(match[1]);
      const src = attrs.src || "";
      if (!src.startsWith(`images/posts/${slug}/`)) {
        continue;
      }
      const filename = basename(src);
      if (!filename.startsWith(approvedIDPrefix)) {
        continue;
      }

      const suggestion = suggestionsByImagePath.get(src);
      if (!suggestion) {
        fail(target, `approved photo shortcode ${src} has no matching data/photo-suggestions/${slug}.json entry`);
        continue;
      }
      if (attrs.alt !== suggestion.alt) {
        fail(target, `approved photo shortcode ${src} alt text does not match approved suggestion`);
      }
      if (attrs.caption !== suggestion.caption) {
        fail(target, `approved photo shortcode ${src} caption does not match approved suggestion`);
      }
    }
  }
}

const suggestionsByImagePath = loadSuggestions();
validatePostShortcodes(suggestionsByImagePath);

if (failures.length > 0) {
  console.error("Approved photo validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Approved photo validation passed.");
