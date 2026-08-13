#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] || "public";
const config = readFileSync("config.toml", "utf8");
const baseURLMatch = config.match(/^baseURL\s*=\s*['"]([^'"]+)['"]/m);
const failures = [];

function fail(message) {
  failures.push(message);
}

function collectFiles(dir, suffixes) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath, suffixes));
    } else if (suffixes.some((suffix) => entry.endsWith(suffix))) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

if (!baseURLMatch) {
  fail("config.toml is missing baseURL");
}

let canonicalOrigin = "";
if (baseURLMatch) {
  try {
    canonicalOrigin = new URL(baseURLMatch[1]).origin;
  } catch {
    fail(`config.toml baseURL is not a valid URL: ${baseURLMatch[1]}`);
  }
}

if (!existsSync(root)) {
  fail(`${root} is missing; run hugo before domain validation`);
} else if (canonicalOrigin) {
  const allowedLocalhost = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/;
  const urlPattern = /https?:\/\/[^"'<>\s)]+/g;
  const files = collectFiles(root, [".html", ".xml", ".txt"]);

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const target = relative(root, file);
    for (const match of text.matchAll(urlPattern)) {
      const value = match[0];
      if (allowedLocalhost.test(value)) {
        fail(`${target} contains local preview URL: ${value}`);
        continue;
      }
      let url;
      try {
        url = new URL(value);
      } catch {
        continue;
      }
      if (url.hostname.endsWith("ranjib.github.io") || url.hostname.endsWith("ranjib.com") || url.hostname.endsWith("ranjib.dev")) {
        if (url.origin !== canonicalOrigin) {
          fail(`${target} contains mixed canonical host ${url.origin}; expected ${canonicalOrigin}`);
        }
      }
    }
  }

  const robotsPath = join(root, "robots.txt");
  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, "utf8");
    if (!robots.includes(`${canonicalOrigin}/sitemap.xml`)) {
      fail(`robots.txt does not reference ${canonicalOrigin}/sitemap.xml`);
    }
  }

  const cnamePaths = ["CNAME", "static/CNAME"].filter((path) => existsSync(path));
  if (canonicalOrigin === "https://ranjib.github.io" && cnamePaths.length > 0) {
    fail(`custom-domain CNAME exists before approved baseURL migration: ${cnamePaths.join(", ")}`);
  }
}

if (existsSync("docs/domain/adr-canonical-domain.md")) {
  const adr = readFileSync("docs/domain/adr-canonical-domain.md", "utf8");
  for (const phrase of [
    "Status: Proposed - owner approval required",
    "Recommended target after approval: `https://ranjib.com/`",
    "It intentionally does not add a `CNAME` file.",
    "It intentionally does not change Hugo `baseURL`.",
  ]) {
    if (!adr.includes(phrase)) {
      fail(`domain ADR is missing required phrase: ${phrase}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Domain validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Domain validation passed.");
