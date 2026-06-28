---
title: "Treating Context Like Code"
date: 2026-07-05T00:00:00-07:00
draft: false
---

The more I use coding agents and LLMs for real work, the less I think of prompts as throwaway text.

A useful prompt is not just a question. It is a small interface. It carries assumptions, constraints, examples, preferences, and failure modes. A project instruction file is even more explicit: it tells an agent how to navigate a codebase, what quality bar to hold, which tools to prefer, and which boundaries not to cross. A context pack does the same thing for a domain. It packages durable facts, active goals, source notes, open questions, stale claims, and sensitive exclusions so an agent can reason from the right starting point.

That makes context feel much closer to code than prose.

Code changes behavior. Context changes behavior too. If I change a project instruction, a coding agent may edit different files, choose different tests, or apply a different standard of evidence. If I change a domain context pack, the same user question can produce a better answer, a worse answer, or a confident answer based on stale assumptions. The context is part of the system.

Once I accepted that, the natural conclusion followed: context needs engineering discipline.

## Raw memory is not the same as useful context

One failure mode in personal AI systems is treating every past conversation as equally useful memory. That is tempting because LLMs make it easy to accumulate text. Chat transcripts, notes, project plans, documents, issue threads, and tool outputs all feel like they might be useful later.

But raw history is noisy. It contains abandoned ideas, temporary assumptions, duplicated facts, sensitive details, stale tool names, and decisions that were later reversed. Injecting that directly into an agent is like linking a production service against a random build artifact because it happened to exist on disk.

The better path is a pipeline:

```text
raw notes
  -> source summaries
  -> reviewed domain pages
  -> context packs
  -> agent instructions
  -> evaluated behavior
```

Each step loses some volume and gains some intent. The goal is not to remember everything. The goal is to preserve the parts that should change future behavior.

This is why I like a Git-backed markdown wiki as the core memory layer. Markdown keeps the content human-editable. Git gives me history, diffs, branches, review, and the ability to treat changes as deliberate. The wiki does not need to be the only interface. Notion can be a better human dashboard. ChatGPT Projects can be a better reasoning surface. But for agent-readable memory, plain files with version history are hard to beat.

## Context has failure modes

If context can change behavior, it can also fail.

Some failures are obvious. A context pack may omit a critical constraint. It may include an outdated hardware fact. It may blur public and private material. It may give the agent too much irrelevant history and bury the important instruction.

Other failures are subtler. The context may be technically accurate but not useful for the task. It may describe goals without defining decision rules. It may list tools without explaining when to use them. It may preserve a preference but not the reason behind it, making it harder to adapt when the situation changes.

The software analogy helps here. We already know how to reason about this kind of thing in code. We define intended behavior. We identify edge cases. We write tests. We review changes. We look for regressions. We make small edits and observe whether the system improved.

Context deserves the same treatment.

For my own wiki, I have been experimenting with an evaluation-driven loop:

```text
context pack
  -> rubric
  -> judge result
  -> targeted wiki edit
  -> rerun
```

The rubric asks concrete questions about the compiled context. Does it include the decision rule? Does it mention the privacy boundary? Does it distinguish verified facts from open questions? Does it capture the source hierarchy? The judge result is not magic, and it is not a substitute for human review. It is a feedback loop. It points at gaps that would otherwise remain invisible until an agent made a bad assumption during real work.

That loop changes the way I write context. I stop asking, "Did I document this topic?" and start asking, "Will this context cause the next agent session to behave correctly?"

## Prompts become maintainable artifacts

There is a big difference between a clever one-off prompt and a maintainable prompt.

A one-off prompt can be messy. It only has to work once, in one conversation, with one human watching closely. A maintainable prompt has a longer life. It needs a name, a purpose, a scope, and enough structure that it can be reused without reconstructing the original mental state.

The same applies to project instructions, agent preferences, model routing rules, workflow checklists, and eval rubrics. They should have owners. They should have version history. They should be easy to inspect. When they fail, the fix should land in the artifact, not only in the memory of the person who noticed the failure.

This is also where privacy matters. A durable context system should not casually mix everything together. Public biography material, professional notes, hobby planning, family logistics, financial records, and operational details do not belong in one undifferentiated memory pile. The artifact needs boundaries. Some context is safe to publish. Some is safe to use locally but not share. Some should be summarized into general lessons and then excluded from public outputs entirely.

Good context engineering includes those exclusions explicitly.

## The interesting part is behavioral drift

The hard part is not writing the first version of a prompt or context pack. The hard part is keeping it correct as the world changes.

Tools change. Model behavior changes. Project goals change. A preference that was useful six months ago can become noise. A fact that was once verified can become stale. A workflow that worked for one repository can be too heavy for another.

That is why I want context artifacts to carry open questions and stale-claim registers, not only facts. A strong context pack does not pretend everything is known. It tells the agent where to be careful. It says which claims need verification. It separates durable principles from temporary observations.

That small habit changes agent behavior in a practical way. Instead of confidently repeating an old assumption, the agent has permission to inspect, ask, or verify.

## The broader pattern

This feels familiar because it is the same engineering taste that shows up in infrastructure automation and reliability work.

Infrastructure as code worked because it turned operational knowledge into versioned, reviewable, testable artifacts. Runbooks improved incident response because they made tacit operational judgment explicit. Service catalogs, ownership maps, deployment pipelines, and postmortems all exist for the same reason: complex systems get safer when important behavior is written down, maintained, and tested against reality.

LLM context is another version of that problem.

The agent is not only responding to the user. It is responding to the operating environment we give it: files, instructions, memories, tools, examples, constraints, and feedback loops. If that environment is accidental, the behavior will be accidental. If that environment is engineered, the behavior has a chance to improve over time.

Treating context like code does not mean making everything heavyweight. It means taking the behavior seriously.

Write the context down. Keep it small enough to maintain. Version it. Review it. Test the important parts. Delete stale claims. Preserve privacy boundaries. Improve the artifact when the agent fails.

The prompt is not the product. The behavior is.
