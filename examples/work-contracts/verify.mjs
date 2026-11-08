#!/usr/bin/env node
// A deliberately small fixture oracle, not a production compiler or sandbox.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const contract = JSON.parse(readFileSync(join(here, 'contract.json'), 'utf8'));
const path = 'content/posts/example-hugo.md';
const validArticle = `---
title: "A Small Example"
draft: true
description: "A concrete demonstration of bounded edits and independent acceptance checks."
summary: "A synthetic example showing how a work contract rejects invalid edits."
lane: "engineering-ai"
---

A public fixture, not a published article.
`;

function metadataViolations(content) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) return ['hugo-metadata: missing frontmatter'];
  const fields = Object.fromEntries(frontmatter[1].split('\n')
    .map(line => line.match(/^([a-z_]+):\s*(.*)$/))
    .filter(Boolean).map(match => [match[1], match[2].replace(/^"|"$/g, '')]));
  const errors = [];
  if (fields.draft !== 'true') errors.push('hugo-metadata: draft must remain true');
  if ((fields.description || '').length < 40 || fields.description.length > 160) {
    errors.push('hugo-metadata: description must contain 40-160 characters');
  }
  if (!(fields.summary || '').trim()) errors.push('hugo-metadata: summary must be nonempty');
  if (fields.lane !== 'engineering-ai') errors.push('hugo-metadata: unexpected lane');
  return errors;
}

function validate(candidate) {
  const failures = [];
  const slice = contract.slices.find(s => s.id === candidate.sliceId);
  if (!slice) return ['contract: unknown slice'];
  if (candidate.revision !== contract.pinnedContext.revision) {
    failures.push('provenance: source revision changed');
  }
  const capabilities = contract.pinnedContext.capabilitySnapshot;
  if (slice.requiredTool && !capabilities.tools.includes(slice.requiredTool)) {
    failures.push('capability: required tool unavailable');
  }
  if (slice.dependsOn.some(id => !candidate.completedSlices?.includes(id))) {
    failures.push('dependency: prerequisite not complete');
  }

  // These handlers are trusted fixture code, not code or commands supplied by a plan.
  const gateHandlers = {
    scope: () => {
      const errors = candidate.changes
        .filter(file => !slice.allowedPaths.includes(file.path))
        .map(file => `scope: disallowed change to ${file.path}`);
      if (candidate.changes.length === 0 && slice.id === 'write-draft') {
        errors.push('scope: required edit is absent');
      }
      return errors;
    },
    'hugo-metadata': () => candidate.changes
      .filter(file => slice.allowedPaths.includes(file.path))
      .flatMap(file => metadataViolations(file.content)),
    'human-review': () => ['human-review: human approval required']
  };
  const required = slice.id === 'write-draft'
    ? ['scope', 'hugo-metadata']
    : ['scope', 'hugo-metadata', 'human-review'];
  for (const name of required) {
    if (!slice.validators.includes(name)) failures.push(`contract: missing required gate ${name}`);
  }
  for (const name of slice.validators) {
    if (!Object.hasOwn(gateHandlers, name)) {
      failures.push(`contract: unknown gate ${name}`);
    } else {
      failures.push(...gateHandlers[name]());
    }
  }
  return failures;
}

const base = { sliceId: 'write-draft', revision: 'synthetic-base-revision-v1', completedSlices: [] };
const scenarios = [
  { name: 'out-of-scope', expected: 'scope:', candidate: {
      ...base, changes: [{ path, content: validArticle }, { path: 'config.toml', content: 'unsafe change' }]
    } },
  { name: 'in-scope-semantically-invalid', expected: 'hugo-metadata:', candidate: {
      ...base, changes: [{ path, content: validArticle.replace('draft: true', 'draft: false') }]
    } },
  { name: 'stale-provenance', expected: 'provenance:', candidate: {
      ...base, revision: 'different-revision', changes: [{ path, content: validArticle }]
    } },
  { name: 'reference-valid', expected: null, candidate: {
      ...base, changes: [{ path, content: validArticle }]
    } }
];

let unexpected = 0;
for (const { name, candidate, expected } of scenarios) {
  const failures = validate(candidate);
  const passed = expected === null ? failures.length === 0 : failures.some(f => f.startsWith(expected));
  if (!passed) unexpected++;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}: ${failures.length ? failures.join('; ') : 'accepted by fixture gate'}`);
}
if (unexpected) process.exitCode = 1;
