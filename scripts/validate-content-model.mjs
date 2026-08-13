#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";

const root = process.argv[2] || "public";
const contentRoot = "content/posts";
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
