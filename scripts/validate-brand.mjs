#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const failures = [];
const requiredFiles = [
  "docs/brand/narrative.md",
  "docs/brand/linkedin-rollout.md",
  "docs/brand/visual-kit.md",
  "docs/brand/source-map.md",
  "docs/brand/assets/linkedin-banner.svg",
  "docs/brand/assets/linkedin-banner.png",
];

function fail(message) {
  failures.push(message);
}

function read(path) {
  return readFileSync(path, "utf8");
}

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`${file} is missing`);
}

if (existsSync("docs/brand/narrative.md")) {
  const narrative = read("docs/brand/narrative.md");
  for (const phrase of [
    "Systems in Practice",
    "content/about/public-profile.md",
    "Engineering & AI",
    "Open Source & Making",
    "Field Notes",
    "Learning & Life",
    "Views are my own",
    "Do not disclose confidential Uber systems",
  ]) {
    if (!narrative.includes(phrase)) fail(`brand narrative is missing ${phrase}`);
  }
}

if (existsSync("docs/brand/linkedin-rollout.md")) {
  const rollout = read("docs/brand/linkedin-rollout.md");
  for (const phrase of [
    "Senior Staff Engineer @ Uber",
    "Views are my own and do not represent my employer.",
    "https://ranjib.github.io/start-here/",
    "https://reef-pi.github.io/",
    "Follow",
    "No LinkedIn profile mutation should be automated",
    "30 days",
  ]) {
    if (!rollout.includes(phrase)) fail(`LinkedIn rollout pack is missing ${phrase}`);
  }
}

if (existsSync("docs/brand/visual-kit.md")) {
  const visual = read("docs/brand/visual-kit.md");
  for (const phrase of [
    "1584 x 396",
    "Alt text",
    "docs/brand/assets/linkedin-banner.png",
  ]) {
    if (!visual.includes(phrase)) fail(`visual kit is missing ${phrase}`);
  }
  if (!visual.toLowerCase().includes("bottom-left")) {
    fail("visual kit is missing bottom-left safe-area guidance");
  }
}

if (existsSync("docs/brand/assets/linkedin-banner.svg")) {
  const svg = read("docs/brand/assets/linkedin-banner.svg");
  if (!/width="1584"\s+height="396"/.test(svg)) {
    fail("LinkedIn banner SVG is not 1584x396");
  }
  if (!svg.includes("Systems in Practice")) {
    fail("LinkedIn banner SVG is missing Systems in Practice");
  }
}

if (existsSync("docs/brand/assets/linkedin-banner.png")) {
  const png = readFileSync("docs/brand/assets/linkedin-banner.png");
  const signature = png.subarray(0, 8);
  const expected = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!signature.equals(expected)) {
    fail("LinkedIn banner export is not a PNG");
  } else {
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    if (width !== 1584 || height !== 396) {
      fail(`LinkedIn banner export is ${width}x${height}, expected 1584x396`);
    }
  }
}

if (failures.length > 0) {
  console.error("Brand validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Brand validation passed.");
