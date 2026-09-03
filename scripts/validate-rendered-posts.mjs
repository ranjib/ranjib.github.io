#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";

const publicRoot = process.argv[2] || "public";
const contentRoot = process.argv[3] || "content/posts";
const siteOrigin = "https://ranjib.github.io";
const publishTimezone = "America/Los_Angeles";
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

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const simple = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!simple) continue;
    const [, key, rawValue] = simple;
    data[key] = rawValue.replace(/^"|"$/g, "");
  }
  return data;
}

function currentPublishDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: publishTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function postSlug(file) {
  const relativePath = relative(contentRoot, file).replace(/\.md$/, "");
  if (basename(relativePath) === "index") {
    return relativePath.split("/").slice(0, -1).join("/");
  }
  return relativePath;
}

function hasUrl(filePath, url) {
  return existsSync(filePath) && readFileSync(filePath, "utf8").includes(url);
}

const today = currentPublishDate();
const rssPath = join(publicRoot, "index.xml");
const sitemapPath = join(publicRoot, "sitemap.xml");

if (!existsSync(contentRoot)) {
  fail(contentRoot, "content posts directory is missing");
} else {
  for (const file of collectMarkdown(contentRoot)) {
    const markdown = readFileSync(file, "utf8");
    const frontmatter = parseFrontmatter(markdown);
    const target = relative(".", file);

    if (frontmatter.draft === "true") continue;

    const date = String(frontmatter.date || "").slice(0, 10);
    if (!date) {
      fail(target, "published post needs a date");
      continue;
    }
    if (date > today) {
      fail(target, `published post date ${date} is after today (${today}); set draft: true until publish day`);
    }

    const slug = postSlug(file);
    const canonicalUrl = `${siteOrigin}/posts/${slug}/`;
    const renderedPath = join(publicRoot, "posts", slug, "index.html");

    if (!existsSync(renderedPath)) {
      fail(target, `rendered page is missing: ${relative(".", renderedPath)}`);
    }
    if (!hasUrl(rssPath, canonicalUrl)) {
      fail(target, `canonical URL is missing from public/index.xml: ${canonicalUrl}`);
    }
    if (!hasUrl(sitemapPath, canonicalUrl)) {
      fail(target, `canonical URL is missing from public/sitemap.xml: ${canonicalUrl}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Rendered post validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Rendered post validation passed.");
