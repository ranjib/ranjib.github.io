#!/usr/bin/env node

import assert from "node:assert/strict";

import { findPublicBoundaryViolations } from "./public-boundary-patterns.mjs";

const joined = (...parts) => parts.join("");

const rejected = [
  ["file-uri", "file" + ":///srv/private/note.md"],
  ["user-home-path", "/Users/alice/private/note.md"],
  ["user-home-path", "/home/alice/private/note.md"],
  ["user-home-path", "C:" + "\\Users\\alice\\private\\note.md"],
  ["private-source-marker", "llm-wiki-" + "ranjib:private-note"],
  ["github-token", joined("gh", "p_", "A".repeat(36))],
  ["github-token", joined("github", "_pat_", "A".repeat(24))],
  ["openai-token", joined("sk", "-", "A".repeat(24))],
  ["aws-access-key-id", joined("AK", "IA", "A".repeat(16))],
];

for (const [expectedRule, input] of rejected) {
  const findings = findPublicBoundaryViolations(`safe first line\n${input}`);
  assert.ok(
    findings.some(({ rule, line }) => rule === expectedRule && line === 2),
    `expected ${expectedRule} on line 2`,
  );
  for (const finding of findings) {
    assert.deepEqual(Object.keys(finding).sort(), ["line", "rule"]);
  }
  assert.ok(!JSON.stringify(findings).includes(input), `${expectedRule} diagnostic leaked input`);
}

const safeNearMisses = [
  "file:// is a URI scheme",
  "/home/ is a conventional parent directory",
  "/Users/ is a conventional parent directory",
  "C:" + "\\Users\\ is a conventional parent directory",
  "llm-wiki-ranjib is a project name",
  "ghp_ is a token prefix",
  "github_pat_ is a token prefix",
  "sk- is a token prefix",
  "AKIA is an access-key prefix",
];

for (const input of safeNearMisses) {
  assert.deepEqual(findPublicBoundaryViolations(input), [], `unexpected finding for ${input}`);
}

console.log("Public-boundary detector tests passed.");
