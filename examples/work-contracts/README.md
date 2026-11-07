# Synthetic execution-contract fixture

This independently invented Hugo example accompanies the draft essay
[From Natural-Language Plans to Executable Work Contracts](../../content/posts/from-natural-language-plans-to-executable-work-contracts.md).
It contains no private system data and makes no claim about actual coding-agent performance.

The `contract.json` is a **hand-authored representation of the output of a hypothetical
plan compiler**. It is not evidence that a production compiler generated that file.
The two slices are `write-draft` followed by `review-candidate`. The latter
requires explicit human approval, which this script never supplies.

Run:

```sh
node examples/work-contracts/verify.mjs
```

The verifier checks a synthetic, in-memory candidate change set. It does **not**
write files, execute a language model, validate a real Git diff, sandbox tools,
or grant merge/publish permissions. Its assertions cover the first slice only:

| Scenario | Expected fixture decision |
| --- | --- |
| Edit an allowed article and an unrelated `config.toml` | Reject: `scope` |
| Edit only the allowed article, but set `draft: false` | Reject: `hugo-metadata` |
| Present an edit against a different synthetic revision | Reject: `provenance` |
| Edit the allowed article with valid metadata | Accept at this **fixture gate only** |

The script exits non-zero if any of these expectations fail. A real execution
control plane must additionally authenticate the actual Git revision, hash
and verify spec/plan/capability artifacts, enforce permissions *before* tool
calls, inspect the actual diff, execute repository validators in isolation,
retain run evidence, and require human review for promotion. These fixtures
prove only the logic exercised here, not that a runtime or a model is safe.
