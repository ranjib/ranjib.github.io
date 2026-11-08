---
title: "From Natural-Language Plans to Executable Work Contracts"
date: 2026-11-07T00:00:00-08:00
draft: false
description: "Why an AI implementation plan needs pinned context, bounded permissions, and independent validators before an agent can execute it safely."
summary: "A practical approach to compiling prose plans into bounded execution contracts, with a reproducible Hugo fixture that rejects out-of-scope and semantically invalid changes."
lane: "engineering-ai"
tags:
  - "agent orchestration"
  - "infrastructure automation"
  - "validation"
  - "context engineering"
---

A good implementation plan is not necessarily a safe instruction to execute.

That distinction became harder to ignore as I experimented with assigning coding work to different models, including smaller ones running locally. A capable planner can describe an elegant migration, while an executor still has to answer less elegant questions: Which revision is this for? Which files may I change? Which tools actually exist here? Who can decide that the result is acceptable?

My instinct was to make the plan more detailed. The better answer was to change its type. **A plan is a proposal; an execution contract is a bounded grant of work subject to independent policy.**

## Prose plans lose information at the execution boundary

Consider a perfectly reasonable request: "Add a draft Hugo post, update its metadata, and make sure the site still builds." As a human, I can infer that it does not authorize changing the site's deployment configuration, publishing the article, or weakening a validator to make the build green. An agent may not share those assumptions.

The problem gets worse when planning and execution are separated. The planner may have inspected one repository revision, while the executor receives a newer checkout. The planner may assume a tool supports a feature that the selected runtime cannot provide. A generated checklist can also confuse intent with authority: "I need to edit this file" is not evidence that the file is permitted.

This is familiar from infrastructure work. A runbook can explain what an operator wants to accomplish without being a credentials system. The production change path still needs an identity, scope, preconditions, and a separate way to detect failure.

Modern tool interfaces make part of the boundary visible, but do not eliminate it. The [Model Context Protocol tools specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) defines discoverable tools and capability declarations; its guidance also calls for human oversight of tool invocation. Declaring that a tool exists is useful negotiation, not authorization to invoke it on every resource. Similarly, [GitHub's workflow security guidance](https://docs.github.com/en/actions/reference/security/secure-use) recommends least-privilege tokens and treating untrusted inputs carefully. Those are execution-system decisions, not sentences for a planner to waive.

A more detailed prompt helps the model understand expectations. It does not make the prompt an enforcement boundary.

## Compile intent into a contract that the runner can enforce

The useful compiler analogy is not that prose becomes code automatically. It is that ambiguous source material is normalized into a smaller, typed representation that can be checked *before* execution.

I would start with a source specification: the goal, domain invariants, acceptance criteria, evidence and unresolved questions. A planner can then propose a dependency graph of work slices. The compiler resolves those slices against an **immutable capability snapshot** and a pinned repository revision. The snapshot records the available tools and constrained execution modes at admission time; if the actual runner disagrees, work is rejected or recompiled rather than silently rerouted.

Each admitted slice needs a stable identity, explicit predecessors, allowed paths, required capabilities, retry or resource budgets, and named validators owned by the repository or operator. Provenance binds the spec, plan, snapshot, base revision, candidate and final gate results so a reviewer can answer which inputs authorized which change. Hashes are useful for identity and tamper detection, but a hash does not establish that a policy was correct.

For a synthetic Hugo task:

```text
spec: create a draft article; keep it unpublished
pinned context: repository revision + tool/capability snapshot
slice A: edit only content/posts/example-hugo.md
         validators: changed-path scope, Hugo metadata
slice B: review A's result; no file edits
         validators: completion evidence, human approval
promotion: never inferred from a green build
```

The planner can suggest a local or frontier executor, but the trusted compiler determines whether the actual route can satisfy the contract. A missing tool is a typed rejection, not a reason to let an executor invent a substitute. Dependencies must be complete before a downstream slice becomes eligible. Untrusted issue text or repository content may describe the task; it cannot enlarge the runner's permissions.

Validation must have two enforcement moments. At admission, check the revision, graph, tool capabilities and authority ceiling *before any side effect*. After a candidate exists, inspect the actual changed paths and run semantic validators against the candidate, not the model's description of it. The runner must use enforceable filesystem and credential boundaries; an allowlist printed in a prompt is not a sandbox.

## A green candidate can still be the wrong change

I made a [small public fixture](https://github.com/ranjib/ranjib.github.io/tree/master/examples/work-contracts) for this essay, with its source included in the accompanying pull request. The contract is hand-authored to resemble a compiler output; it is **not** evidence that a production compiler emitted it. A Node script validates in-memory candidate changes for the first work slice. It neither runs a model nor edits a real Git worktree.

Running `node examples/work-contracts/verify.mjs` gives four deterministic outcomes:

| Candidate | Fixture verdict | Why |
| --- | --- | --- |
| Valid article plus an edit to `config.toml` | Rejected | Outside allowed paths |
| Only the allowed article, but `draft: false` | Rejected | Violates the domain invariant |
| Valid metadata against a different source revision | Rejected | Stale provenance |
| Allowed article with valid metadata | Accepted **at the fixture gate** | No fixture rule was violated |

The second case matters most. A file can be in scope, parse correctly, and still be semantically unacceptable. A generic build can remain green when an article is accidentally made publishable. The compiler therefore has to carry *meaningful acceptance rules* through to independently enforced validators. An explicit negative result is more valuable than a reassuring success message that never tested the invariant.

The fixture's passing reference case is deliberately narrow. It does not demonstrate a working compiler, live model reliability, secure sandboxing, end-to-end repository acceptance, or a reviewed publication decision. A real pilot would pin executable and environment identities, validate real diffs, preserve rejected attempts, test baseline-red and reference-green oracles, record human corrections, and report missing runs instead of dropping them. For subjective editorial quality or scientific claims, passing software checks is not a substitute for domain expertise.

Observability matters too, but telemetry is not authority. The developing [OpenTelemetry GenAI agent conventions](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md) provide vocabulary for agent, plan and tool operations. I would correlate those traces with contract, candidate and validator identities, while keeping sensitive content out of spans. A trace can explain *what happened*; it cannot declare that an unauthorized edit was acceptable.

There is a cost to this structure: contracts are less flexible than prose, validators need maintenance, and no finite oracle captures every failure. For a one-off, low-risk manual edit, a heavyweight compiler may be unnecessary. For unattended or delegated execution, however, I would rather see a clear "cannot execute under current policy" than an agent improvising around a missing capability. Failure and no-change are valid outcomes.

The lesson I keep taking from reliability engineering is that a boundary is real only when something independent enforces it. **The planner describes intent; trusted execution policy determines authority.** Everything after that—local versus frontier models, retries, review, and eventual publication—should operate inside that decision, not redefine it.
