#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] || "public";
const siteOrigin = "https://ranjib.github.io";

const representativePages = [
  {
    path: "index.html",
    requiredJsonType: "WebSite",
  },
  {
    path: "posts/context-engineering-evaluation-and-infrastructure-testing-lessons/index.html",
    requiredJsonType: "BlogPosting",
  },
  {
    path: "about/personal/index.html",
    requiredJsonType: "ProfilePage",
  },
  {
    path: "start-here/index.html",
  },
];

const requiredOg = [
  "og:type",
  "og:title",
  "og:description",
  "og:url",
  "og:site_name",
  "og:image",
];

const failures = [];

function collectHtml(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      found.push(...collectHtml(fullPath));
    } else if (entry.endsWith(".html")) {
      found.push(relative(root, fullPath));
    }
  }
  return found.sort();
}

function fail(page, message) {
  failures.push(`${page}: ${message}`);
}

function readPage(path) {
  const fullPath = join(root, path);
  if (!existsSync(fullPath)) {
    fail(path, "generated HTML file is missing");
    return "";
  }
  return readFileSync(fullPath, "utf8");
}

function attr(html, selector, name = "content") {
  const match = html.match(new RegExp(`<meta\\s+${selector}\\s+${name}=(?:"([^"]*)"|([^\\s>]*))\\s*/?>`, "i"));
  if (match) return match[1] || match[2] || "";
  const reverse = html.match(new RegExp(`<meta\\s+${name}=(?:"([^"]*)"|([^\\s>]*))\\s+${selector}\\s*/?>`, "i"));
  if (reverse) return reverse[1] || reverse[2] || "";
  return "";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function metaByProperty(html, property) {
  return attr(html, `property=(?:"${escapeRegex(property)}"|${escapeRegex(property)})`);
}

function metaByName(html, name) {
  return attr(html, `name=(?:"${escapeRegex(name)}"|${escapeRegex(name)})`);
}

function imageLooksSupported(path) {
  if (!existsSync(path)) return false;
  const bytes = readFileSync(path);
  const isPng = bytes.length > 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return isPng || isJpeg;
}

const representativeByPath = new Map(representativePages.map((page) => [page.path, page]));

for (const path of collectHtml(root)) {
  const page = representativeByPath.get(path) || { path };
  const html = readPage(page.path);
  if (!html) continue;

  if (/file:|\/Users\/|\/private\/|localhost|127\.0\.0\.1/.test(html)) {
    fail(page.path, "contains private, local, or filesystem path");
  }

  const canonicalMatches = html.match(/<link\s+rel=(?:"canonical"|canonical)\s+href=(?:"[^"]+"|[^\s>]+)\s*\/?>/g) || [];
  if (canonicalMatches.length !== 1) {
    fail(page.path, `expected exactly one canonical URL, found ${canonicalMatches.length}`);
  } else if (!canonicalMatches[0].includes(siteOrigin)) {
    fail(page.path, "canonical URL is not absolute on the public site origin");
  }

  const description = metaByName(html, "description");
  if (!description) {
    fail(page.path, "meta description is missing");
  } else if (description.length < 40 || description.length > 160) {
    fail(page.path, `meta description length ${description.length} is outside 40-160 characters`);
  }

  for (const property of requiredOg) {
    if (!metaByProperty(html, property)) {
      fail(page.path, `${property} is missing`);
    }
  }

  const image = metaByProperty(html, "og:image");
  if (image) {
    let url;
    try {
      url = new URL(image);
    } catch {
      fail(page.path, "og:image is not a valid absolute URL");
    }
    if (url) {
      if (url.protocol !== "https:") {
        fail(page.path, "og:image is not https");
      }
      if (!/\.(png|jpe?g)$/i.test(url.pathname)) {
        fail(page.path, "og:image is not a PNG or JPEG path");
      }
      const localImage = join(root, url.pathname.replace(/^\//, ""));
      if (!imageLooksSupported(localImage)) {
        fail(page.path, `og:image does not map to a generated PNG/JPEG: ${url.pathname}`);
      }
    }
  }

  const twitterImage = metaByName(html, "twitter:image");
  if (!twitterImage || !/^https:\/\//.test(twitterImage)) {
    fail(page.path, "twitter:image is missing or not absolute https");
  }

  const jsonScripts = [...html.matchAll(/<script type=(?:"application\/ld\+json"|application\/ld\+json)>([\s\S]*?)<\/script>/g)];
  if (page.requiredJsonType) {
    if (jsonScripts.length === 0) {
      fail(page.path, "JSON-LD script is missing");
    }
    const parsed = jsonScripts.map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        fail(page.path, `JSON-LD is not parseable: ${error.message}`);
        return null;
      }
    }).filter(Boolean);
    if (!parsed.some((item) => item["@type"] === page.requiredJsonType)) {
      fail(page.path, `JSON-LD type ${page.requiredJsonType} is missing`);
    }
  }
}

if (failures.length > 0) {
  console.error("Metadata validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Metadata validation passed for ${collectHtml(root).length} generated HTML pages.`);
