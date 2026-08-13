#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const requiredFiles = [
  "docs/distribution/strategy.md",
  "docs/distribution/templates/linkedin-launch.md",
  "docs/distribution/templates/linkedin-carousel.md",
  "docs/distribution/templates/outreach-note.md",
  "docs/distribution/templates/follow-up-post.md",
  "docs/distribution/templates/monthly-digest-entry.md",
  "docs/distribution/metrics.md",
  "docs/distribution/golden/context-engineering-evals-package.md",
  "docs/distribution/golden/context-engineering-evals-carousel.md",
  "docs/distribution/golden/context-engineering-evals-carousel.pdf",
  ".github/ISSUE_TEMPLATE/article-distribution.md",
];

const failures = [];
const siteOrigin = "https://ranjib.github.io";
const campaignPattern = /^https:\/\/ranjib\.github\.io\/posts\/context-engineering-evaluation-and-infrastructure-testing-lessons\/\?utm_source=(linkedin|newsletter|community)&utm_medium=(social|email|referral)&utm_campaign=context-engineering-evals&utm_content=(launch|carousel|followup|digest)$/;

function fail(message) {
  failures.push(message);
}

function read(path) {
  return readFileSync(path, "utf8");
}

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`${file} is missing`);
  }
}

if (existsSync("docs/blog-pipeline.md")) {
  const blogPipeline = read("docs/blog-pipeline.md");
  if (!blogPipeline.includes("docs/distribution/strategy.md")) {
    fail("docs/blog-pipeline.md does not link to distribution strategy");
  }
  if (!blogPipeline.includes("one substantial canonical essay every two weeks")) {
    fail("docs/blog-pipeline.md does not record the reconciled cadence");
  }
}

const packagePath = "docs/distribution/golden/context-engineering-evals-package.md";
if (existsSync(packagePath)) {
  const pkg = read(packagePath);
  const urls = [...pkg.matchAll(/https:\/\/ranjib\.github\.io\/[^\s`)]+/g)].map((match) => match[0]);
  const campaignUrls = urls.filter((url) => url.includes("utm_"));
  if (campaignUrls.length < 4) {
    fail("golden package needs launch, carousel, follow-up, and digest campaign URLs");
  }
  for (const url of campaignUrls) {
    if (!campaignPattern.test(url)) {
      fail(`golden package has invalid campaign URL: ${url}`);
    }
  }
  for (const required of [
    "2014",
    "2026",
    "hidden state",
    "unit tests",
    "smoke tests",
    "integration tests",
    "production traces",
    "comforting mock of reality",
    "Where have you seen agent evals catch something",
  ]) {
    if (!pkg.includes(required)) {
      fail(`golden package is missing required angle: ${required}`);
    }
  }
}

const carouselPath = "docs/distribution/golden/context-engineering-evals-carousel.md";
if (existsSync(carouselPath)) {
  const carousel = read(carouselPath);
  const slides = [...carousel.matchAll(/^## Slide \d+$/gm)];
  if (slides.length !== 7) {
    fail(`carousel source should have 7 slides, found ${slides.length}`);
  }
  if (!carousel.includes("LLM judge can become a comforting mock of reality")) {
    fail("carousel does not include the model-judge warning");
  }
  if (!carousel.includes(`${siteOrigin}/posts/context-engineering-evaluation-and-infrastructure-testing-lessons/?utm_source=linkedin&utm_medium=social&utm_campaign=context-engineering-evals&utm_content=carousel`)) {
    fail("carousel source does not include the carousel campaign URL");
  }
}

const issueTemplatePath = ".github/ISSUE_TEMPLATE/article-distribution.md";
if (existsSync(issueTemplatePath)) {
  const template = read(issueTemplatePath);
  for (const required of [
    "Privacy Review",
    "Campaign URLs",
    "Distribution Package",
    "Community Review",
    "Measurement",
    "No automated comments",
  ]) {
    if (!template.includes(required)) {
      fail(`issue template is missing ${required}`);
    }
  }
}

const pdfPath = "docs/distribution/golden/context-engineering-evals-carousel.pdf";
if (existsSync(pdfPath)) {
  const pdf = readFileSync(pdfPath);
  if (pdf.subarray(0, 5).toString("ascii") !== "%PDF-") {
    fail("carousel export is not a PDF");
  }
}

if (failures.length > 0) {
  console.error("Distribution validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Distribution validation passed.");
