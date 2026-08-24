#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const root = process.argv[2] || "public";
const contentRoot = "content/posts";
const photoSuggestionsRoot = "data/photo-suggestions";
const validLanes = new Set([
  "engineering-ai",
  "open-source-making",
  "field-notes",
  "learning-life",
]);

const failures = [];

function fail(target, message) {
  failures.push(`${target}: ${message}`);
}

function collectMarkdown(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      found.push(...collectMarkdown(fullPath));
    } else if (entry.endsWith(".md") && entry !== "_index.md") {
      found.push(fullPath);
    }
  }
  return found.sort();
}

function collectHtml(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      found.push(...collectHtml(fullPath));
    } else if (entry.endsWith(".html")) {
      found.push(fullPath);
    }
  }
  return found.sort();
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

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  const lines = match[1].split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const simple = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!simple) continue;
    const [, key, rawValue] = simple;
    if (rawValue === "") {
      const values = [];
      while (lines[index + 1]?.startsWith("  - ")) {
        index += 1;
        values.push(lines[index].replace(/^  - /, "").replace(/^"|"$/g, ""));
      }
      data[key] = values;
    } else {
      data[key] = rawValue.replace(/^"|"$/g, "");
    }
  }
  return data;
}

for (const file of collectMarkdown(contentRoot)) {
  const markdown = readFileSync(file, "utf8");
  const frontmatter = parseFrontmatter(markdown);
  const target = relative(".", file);

  if (frontmatter.draft === "true") continue;

  if (!frontmatter.description || frontmatter.description.length > 160) {
    fail(target, "published post needs a description under 160 characters");
  }
  if (!frontmatter.summary) {
    fail(target, "published post needs explicit summary card copy");
  }
  if (!validLanes.has(frontmatter.lane)) {
    fail(target, `published post has invalid lane '${frontmatter.lane || ""}'`);
  }
  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
    fail(target, "published post needs at least one focused tag");
  }
}

for (const file of collectJson(photoSuggestionsRoot)) {
  const target = relative(".", file);
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(target, `invalid JSON: ${error.message}`);
    continue;
  }

  const slug = basename(file, ".json");
  if (manifest.post_slug !== slug) {
    fail(target, `post_slug '${manifest.post_slug || ""}' must match filename slug '${slug}'`);
  }
  if (!existsSync(join(contentRoot, `${slug}.md`))) {
    fail(target, `target post '${slug}' does not exist`);
  }
  if (manifest.generator_version !== "photo-blog-publishing-v1") {
    fail(target, "generator_version must be photo-blog-publishing-v1");
  }
  if (!Array.isArray(manifest.photos) || manifest.photos.length === 0) {
    fail(target, "photos must be a non-empty array");
    continue;
  }

  for (const [index, photo] of manifest.photos.entries()) {
    const item = `${target} photos[${index}]`;
    if (!photo.public_photo_id) {
      fail(item, "missing public_photo_id");
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
  }
}

if (!existsSync(root)) {
  fail(root, "generated site directory does not exist; run hugo first");
} else {
  for (const file of collectHtml(root)) {
    const html = readFileSync(file, "utf8");
    const target = relative(root, file);
    if (/<p class=post-card-summary><p>|<p class="post-card-summary"><p>/.test(html)) {
      fail(target, "post-card summary contains nested paragraph markup");
    }

    const slug = basename(join(file, ".."));
    if (target.startsWith("posts/") && target.endsWith("/index.html")) {
      const relatedSection = html.match(/<section class=post-followup[\s\S]*?<\/section>/);
      if (relatedSection?.[0]?.includes(`/posts/${slug}/`)) {
        fail(target, "related reading includes the current post");
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Content model validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Content model validation passed.");
