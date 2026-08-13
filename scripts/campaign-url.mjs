#!/usr/bin/env node

const siteOrigin = "https://ranjib.github.io";
const allowedSources = new Set([
  "linkedin",
  "newsletter",
  "sreweekly",
  "devopsweekly",
  "platformweekly",
  "community",
]);
const allowedMediums = new Set(["social", "email", "referral"]);
const allowedContent = new Set(["launch", "carousel", "followup", "profile", "digest"]);

function usage() {
  console.error(`Usage:
  node scripts/campaign-url.mjs --path /posts/example/ --source linkedin --medium social --campaign example-launch [--content launch]
  node scripts/campaign-url.mjs --url https://ranjib.github.io/posts/example/ --source newsletter --medium email --campaign monthly-digest --content digest`);
}

function readArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) {
      throw new Error(`unexpected positional argument: ${key}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`missing value for ${key}`);
    }
    args[key.slice(2)] = value;
    index += 1;
  }
  return args;
}

function assertSlug(value, field) {
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(value)) {
    throw new Error(`${field} must be lowercase letters, numbers, and hyphens`);
  }
}

function canonicalURL(args) {
  if (args.path && args.url) {
    throw new Error("use either --path or --url, not both");
  }
  if (!args.path && !args.url) {
    throw new Error("provide --path or --url");
  }

  const url = args.url ? new URL(args.url) : new URL(args.path, siteOrigin);
  if (url.origin !== siteOrigin) {
    throw new Error(`destination must stay on ${siteOrigin}`);
  }
  url.search = "";
  url.hash = "";
  return url;
}

try {
  const args = readArgs(process.argv.slice(2));
  const source = args.source;
  const medium = args.medium;
  const campaign = args.campaign;
  const content = args.content;

  if (!allowedSources.has(source)) {
    throw new Error(`utm_source must be one of: ${[...allowedSources].join(", ")}`);
  }
  if (!allowedMediums.has(medium)) {
    throw new Error(`utm_medium must be one of: ${[...allowedMediums].join(", ")}`);
  }
  if (!campaign) {
    throw new Error("utm_campaign is required");
  }
  assertSlug(campaign, "utm_campaign");
  if (content) {
    if (!allowedContent.has(content)) {
      throw new Error(`utm_content must be one of: ${[...allowedContent].join(", ")}`);
    }
    assertSlug(content, "utm_content");
  }

  const url = canonicalURL(args);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  if (content) url.searchParams.set("utm_content", content);
  console.log(url.toString());
} catch (error) {
  console.error(`Campaign URL validation failed: ${error.message}`);
  usage();
  process.exit(1);
}
