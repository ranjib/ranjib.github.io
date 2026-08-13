#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] || "public";
const siteOrigin = "https://ranjib.github.io";
const failures = [];
const forbiddenPublicPath = /\/(?:drafts?|private|resources|node_modules|\.git|\.github)\b/i;
const trackerPattern = /googletagmanager|google-analytics|gtag\(|plausible\.io|umami\.is|fathom\.video|static\.cloudflareinsights\.com|facebook\.net\/.*tr|doubleclick\.net/i;

function fail(message) {
  failures.push(message);
}

function collectFiles(dir, suffix) {
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

function assertPublicURL(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    fail(`${label} is not a valid URL: ${value}`);
    return;
  }
  if (url.origin !== siteOrigin) {
    fail(`${label} is not on ${siteOrigin}: ${value}`);
  }
  if (url.protocol !== "https:") {
    fail(`${label} is not https: ${value}`);
  }
  if (forbiddenPublicPath.test(url.pathname)) {
    fail(`${label} exposes a forbidden path: ${value}`);
  }
}

if (!existsSync(root)) {
  fail(`${root} is missing; run hugo before crawl validation`);
} else {
  const robotsPath = join(root, "robots.txt");
  if (!existsSync(robotsPath)) {
    fail("robots.txt is missing");
  } else {
    const robots = readFileSync(robotsPath, "utf8");
    if (!/^User-agent:\s*\*/mi.test(robots)) {
      fail("robots.txt does not define the default user agent");
    }
    if (!/^Allow:\s*\/\s*$/mi.test(robots)) {
      fail("robots.txt does not allow normal public crawling");
    }
    if (/^Disallow:\s*\/\s*$/mi.test(robots)) {
      fail("robots.txt blocks the whole site");
    }
    const sitemapMatch = robots.match(/^Sitemap:\s*(\S+)\s*$/mi);
    if (!sitemapMatch) {
      fail("robots.txt does not reference sitemap.xml");
    } else {
      assertPublicURL(sitemapMatch[1], "robots sitemap");
      if (sitemapMatch[1] !== `${siteOrigin}/sitemap.xml`) {
        fail(`robots sitemap should be ${siteOrigin}/sitemap.xml`);
      }
    }
  }

  const sitemapPath = join(root, "sitemap.xml");
  if (!existsSync(sitemapPath)) {
    fail("sitemap.xml is missing");
  } else {
    const sitemap = readFileSync(sitemapPath, "utf8");
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    if (locs.length === 0) {
      fail("sitemap.xml has no URLs");
    }
    for (const loc of locs) {
      assertPublicURL(loc, "sitemap loc");
    }
    for (const required of ["/", "/start-here/", "/subscribe/", "/posts/"]) {
      if (!locs.includes(`${siteOrigin}${required}`)) {
        fail(`sitemap.xml is missing ${siteOrigin}${required}`);
      }
    }
  }

  for (const file of collectFiles(root, ".html")) {
    const html = readFileSync(file, "utf8");
    const target = relative(root, file);
    if (/<meta\s+[^>]*name=(?:"robots"|robots)[^>]*content=(?:"[^"]*noindex|[^>\s]*noindex)/i.test(html)) {
      fail(`${target} contains noindex`);
    }
    if (trackerPattern.test(html)) {
      fail(`${target} appears to include analytics or tracking code before ADR approval`);
    }
    const verificationMatch = html.match(/<meta\s+[^>]*name=(?:"google-site-verification"|google-site-verification)[^>]*content=(?:"([^"]+)"|([^>\s]+))/i);
    if (verificationMatch) {
      const value = verificationMatch[1] || verificationMatch[2];
      if (!value || /changeme|placeholder|example/i.test(value)) {
        fail(`${target} contains a placeholder Search Console verification token`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Crawl validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Crawl validation passed.");
