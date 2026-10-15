const rules = [
  {
    rule: "file-uri",
    pattern: /\bfile:\/\/[^\s<>"']+/giu,
  },
  {
    rule: "user-home-path",
    pattern: /\/(?:Users|home)\/[A-Za-z0-9._-]+(?:\/[^\s<>"']*)?/gu,
  },
  {
    rule: "user-home-path",
    pattern: /\b[A-Za-z]:\\Users\\[A-Za-z0-9._-]+(?:\\[^\s<>"']*)?/gu,
  },
  {
    rule: "private-source-marker",
    pattern: /\bllm-wiki-ranjib:/giu,
  },
  {
    rule: "github-token",
    pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{20,255})\b/gu,
  },
  {
    rule: "openai-token",
    pattern: /\bsk-[A-Za-z0-9_-]{20,255}\b/gu,
  },
  {
    rule: "aws-access-key-id",
    pattern: /\bAKIA[0-9A-Z]{16}\b/gu,
  },
];

export function findPublicBoundaryViolations(text) {
  const findings = [];
  const lines = String(text).split(/\r?\n/u);

  for (const [index, line] of lines.entries()) {
    for (const { rule, pattern } of rules) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({ rule, line: index + 1 });
      }
    }
  }

  return findings;
}
