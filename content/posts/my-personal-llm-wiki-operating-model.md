---
title: "My Personal LLM Wiki Operating Model"
date: 2026-08-02T00:00:00-07:00
draft: false
---

The useful part of a personal LLM wiki is not that it stores a lot of text.

Storage is the easy part. Chat transcripts, notes, exported documents, project plans, and issue threads accumulate quickly. The harder problem is deciding which parts of that history should influence future agent behavior, which parts are stale, and which parts should never leave a private boundary.

That is the operating model I have been building toward: raw notes become source notes, source notes become curated wiki pages, curated pages become context packs, and context packs become agent-readable memory.

The point is to stop treating memory as a pile of artifacts and start treating it as a maintained system.

## Raw notes are evidence, not memory

One mistake I want to avoid is turning every conversation into memory.

Raw history is useful because it contains evidence. It shows what I asked, what I tried, which assumptions were live at the time, and where the model helped or failed. But raw history is also messy. It contains abandoned plans, temporary constraints, obsolete model names, sensitive details, duplicated conclusions, and half-formed ideas that should not silently steer future work.

So the first boundary is between source and memory.

A raw source can be a ChatGPT export, a Notion page, a PDF, a GitHub issue, a project README, or a manually written note. I want those sources to be traceable, but not injected directly into every agent session.

That curation step asks a few practical questions:

- What durable facts are worth preserving?
- What decision was actually made?
- What constraints should future agents respect?
- What is current state and therefore likely to go stale?
- What open questions remain?
- What sensitive material should be excluded or generalized?

This is a familiar engineering move. Logs are not a database schema. Incident transcripts are not a runbook. Raw material matters, but it needs to be transformed before it becomes an operational interface.

## The wiki is the review surface

The middle layer is a Git-backed markdown wiki. That choice is intentionally boring. Markdown is easy to read, edit, diff, review, and move between tools. Git gives me history and branches. It also gives agents a filesystem they can inspect without needing a specialized knowledge-management API.

The wiki is where source notes become reviewed pages. A domain page should not try to remember everything. It should carry the stable shape of a subject: summary, active goals, durable facts, decisions, current tools, open questions, stale claims, prompts, and source links.

That structure matters because different kinds of memory should behave differently.

A stable fact can be reused with confidence. A current-state note should be treated as a snapshot. A constraint should change the agent's behavior. An open question should make the agent inspect or ask before assuming. A stale claim should trigger verification. A sensitive exclusion should prevent the agent from turning private context into public output.

A gardening pack, a reef-keeping pack, and a GenAI session bootstrap pack do not need the same facts, but they need the same discipline: preserve what should affect behavior, label what might drift, and leave private material behind the right boundary.

## Context packs are compiled views

A wiki page is still too broad for many tasks.

When an agent starts a session, it usually needs the smallest useful slice of memory for the work in front of it.

In my wiki, a context pack is a named snapshot built from selected sections of selected pages. The pack has a purpose, a privacy class, source pages, labels, and a maintenance path. It is a deliberate interface for a task.

The labels are the important part:

```text
stable_facts
current_state
constraints
open_questions
stale_claims
prompts
```

Those labels help the agent interpret the memory instead of flattening it. A section labeled `constraints` should affect what the agent is willing to suggest. A section labeled `open_questions` should lower confidence. A section labeled `stale_claims` should cause verification before reuse.

This is also where privacy becomes operational rather than aspirational. A public professional footprint pack can feed website copy. A sensitive life-operations pack should not. The pack boundary makes that distinction explicit before the model starts writing.

## Memory needs evals

Once a context pack can change agent behavior, it needs a feedback loop.

The failure mode is easy to imagine. A pack may omit a safety rule. It may contain a stale tool reference. It may describe a goal without the decision rule that matters.

This is why I have been experimenting with evaluation-driven context engineering. The loop is:

```text
pack
  -> rubric
  -> judge result
  -> targeted wiki edit
  -> rerun
```

The rubric asks concrete questions about the compiled pack. Does it include the required constraints? Does it separate stable facts from current state? Does it mention sensitive exclusions? Does it tell the agent when to verify?

The judge is not a source of truth. It is a review assistant. The value is making memory failures visible before they show up during real work.

That changes the maintenance posture. If an agent gives a weak answer because the pack was incomplete, the fix should land in the wiki or the rubric. If a stale claim causes confusion, move it out of stable facts. If the privacy boundary is implicit, make it explicit.

## Notion is a dashboard; Git is the agent interface

I still like Notion for human-facing organization. It is good for dashboards, databases, planning pages, and quick navigation. But I do not want it to be the only place canonical agent memory lives.

For the agent interface, Git-backed markdown has better properties. It is plain text. It can be branched, reviewed in a pull request, live beside code, and be consumed by coding agents, local LLM tooling, or a simple script.

That split keeps the roles clear:

```text
Notion: human dashboard and planning surface
Git wiki: canonical agent-readable memory
context packs: task-specific compiled views
evals: regression checks for memory quality
```

The boundary is operational. Different tools are good at different parts of the system.

## The operating model matters more than the tool

The specific repo layout will keep changing. The model names will change. The agent tools will change. Some packs will need stronger evals. That is normal.

The durable part is the operating model:

- keep raw sources separate from curated memory
- preserve provenance
- label facts by how they should be used
- compile task-specific context instead of dumping history
- make privacy boundaries explicit
- test important packs with rubrics
- update the memory artifact when agent behavior fails

This is the same lesson I keep rediscovering across infrastructure, reliability, and agentic AI. Important behavior should not depend on a person reconstructing context from memory in the moment. It should be written down, reviewed, versioned, and improved when reality exposes a gap.

A personal LLM wiki is not valuable because it remembers everything. It is valuable because it gives future work a better starting state.

The memory is not the product. The behavior is.

## Public sources

- [Treating Context Like Code](/posts/treating-context-like-code/)
- [The Through-Line From Chef to Agentic AI](/posts/through-line-from-chef-to-agentic-ai/)
