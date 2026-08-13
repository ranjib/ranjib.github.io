#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || "public";
const siteOrigin = "https://ranjib.github.io";
const feedPath = join(root, "index.xml");
const failures = [];

function fail(message) {
  failures.push(message);
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1].trim() : "";
}

function collectItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
}

function ensureAbsoluteHttps(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    fail(`${label} is not a valid URL: ${value}`);
    return;
  }
  if (url.protocol !== "https:") {
    fail(`${label} is not https: ${value}`);
  }
  if (url.origin !== siteOrigin) {
    fail(`${label} is not on ${siteOrigin}: ${value}`);
  }
}

if (!existsSync(feedPath)) {
  fail("public/index.xml is missing; run hugo before RSS validation");
} else {
  const xml = readFileSync(feedPath, "utf8");

  if (!/^<\?xml version="1\.0"/.test(xml)) {
    fail("feed is missing an XML declaration");
  }
  if (!/<rss\b[^>]*version="2\.0"/.test(xml)) {
    fail("feed is not RSS 2.0");
  }
  if (!/<atom:link\b[^>]*rel="self"[^>]*type="application\/rss\+xml"/.test(xml)) {
    fail("feed is missing atom self-discovery link");
  }

  const channelMatch = xml.match(/<channel>([\s\S]*?)<\/channel>/);
  if (!channelMatch) {
    fail("feed channel is missing");
  } else {
    const channel = channelMatch[1];
    const title = tag(channel, "title");
    const description = tag(channel, "description");
    const link = tag(channel, "link");
    const language = tag(channel, "language");
    const copyright = tag(channel, "copyright");
    const managingEditor = tag(channel, "managingEditor");

    if (title !== "Ranjib Dey - Systems in Practice") {
      fail(`unexpected channel title: ${title || "(empty)"}`);
    }
    if (description.length < 60 || !description.includes("reliable systems")) {
      fail("channel description is missing or not useful");
    }
    if (link !== `${siteOrigin}/`) {
      fail(`unexpected channel link: ${link || "(empty)"}`);
    }
    if (language !== "en-us") {
      fail(`unexpected feed language: ${language || "(empty)"}`);
    }
    if (!copyright.includes("Ranjib Dey")) {
      fail("copyright does not identify Ranjib Dey");
    }
    if (!managingEditor.includes("Ranjib Dey")) {
      fail("managingEditor does not identify Ranjib Dey");
    }

    const items = collectItems(channel);
    if (items.length === 0) {
      fail("feed has no items");
    }

    for (const [index, item] of items.entries()) {
      const itemLabel = `item ${index + 1}`;
      const itemTitle = tag(item, "title");
      const itemLink = tag(item, "link");
      const guid = tag(item, "guid");
      const pubDate = tag(item, "pubDate");
      const itemDescription = tag(item, "description");
      const author = tag(item, "author");

      if (!itemTitle) fail(`${itemLabel} title is empty`);
      if (["Subscribe", "Start Here"].includes(itemTitle)) {
        fail(`${itemLabel} should contain writing posts, not utility page: ${itemTitle}`);
      }
      if (!itemLink) {
        fail(`${itemLabel} link is empty`);
      } else {
        ensureAbsoluteHttps(itemLink, `${itemLabel} link`);
      }
      if (!guid) {
        fail(`${itemLabel} guid is empty`);
      } else {
        ensureAbsoluteHttps(guid, `${itemLabel} guid`);
        if (itemLink && guid !== itemLink) {
          fail(`${itemLabel} guid does not match canonical link`);
        }
      }
      if (!pubDate || Number.isNaN(Date.parse(pubDate))) {
        fail(`${itemLabel} pubDate is missing or invalid`);
      }
      if (itemDescription.length < 40) {
        fail(`${itemLabel} description is too short`);
      }
      if (!author.includes("Ranjib Dey")) {
        fail(`${itemLabel} author does not identify Ranjib Dey`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("RSS validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("RSS validation passed.");
