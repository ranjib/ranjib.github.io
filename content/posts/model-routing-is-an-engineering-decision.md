---
title: "Model Routing Is an Engineering Decision"
date: 2026-08-30T00:00:00-07:00
draft: false
description: "Routing work across local and hosted models is a systems decision: quality shifts with context, and memory, latency, and privacy are hard constraints."
summary: "Why choosing a model per workload belongs in configuration rather than in the moment, and why context design decides quality more than the model name does."
lane: "engineering-ai"
tags:
  - "model routing"
  - "context engineering"
  - "local LLM"
  - "agentic AI"
---

The routing decision in my home lab is a label on a GitHub issue.

An issue tagged for the large general model runs on one thing. An issue with no model label runs on that host's default. An issue tagged for a model class this particular machine has never mapped does not run at all.

That last case took me the longest to get right, and it is the one I would defend hardest now.

## Routing belongs in configuration, not in the moment

For a long time my model selection was a dropdown. I picked whatever felt appropriate, which usually meant whatever I had picked last time, which usually meant the largest thing available.

That works until the work becomes unattended. The moment a job runs while I am asleep, "which model should this use" stops being a preference and becomes a configuration value somebody has to be able to read, review, and change.

So the alias moved into the repository, and the mapping from alias to a concrete model tag moved into per-host configuration. The issue says *what class of model this work needs*. The machine says *what that class means here*. A workstation with a 24 GB card resolves the large general alias to something that fits in 24 GB. A laptop resolves it to something smaller, or declines to resolve it at all.

These are two decisions with two different owners. Whoever files the work does not need to know which machine will pick it up, and the machine never has to reinterpret the intent of the task.

## Quality is not a property of the model

The axis everyone argues about is quality, and it is the one that behaves least like a constant.

Chroma's context rot report is the clearest public evidence I have seen for this. They evaluated 18 models across Anthropic, OpenAI, Google, and Alibaba families, on tasks deliberately simplified so that input length was the only real variable. Performance degraded as input grew, and it degraded unevenly — not as a graceful slope, but in ways that differed by model and by how the context was built.

Three of their findings changed how I think about routing.

Lower semantic similarity between the question and the relevant fact made performance fall off faster as context grew. Adding a single distractor measurably hurt accuracy, and the damage from distractors got worse at longer inputs rather than staying constant. And the one I still find genuinely strange: models often did *better* when the surrounding text was shuffled into incoherence than when it preserved a logical flow of ideas.

Anthropic's context engineering guidance frames the same constraint from the architecture side. Every token attends to every other token, so attention is a budget that gets thinner as the window fills, regardless of what the advertised window size says.

Put those together and the practical conclusion is uncomfortable. A benchmark number describes a model under one context construction. My workload is a different context construction. The number does not transfer, and a larger context window is not a fix — it is more room to make the problem worse.

This is why I no longer treat "pick the model" and "design the context" as two tasks. Routing a job to a stronger model while handing it a bloated, incoherent context is not an upgrade. It is a more expensive way to get the same bad answer.

## The other three axes are hard constraints, not preferences

Cost, speed, and privacy are easier to reason about, mostly because they fail loudly.

On local hardware, cost mostly reappears as memory. A 24 GB card is not a budget I can negotiate with. A model either fits alongside its context or it spills into system memory and the throughput falls off a cliff. That single number eliminates most of the candidate list before quality is even discussed, which is clarifying: on that machine, routing starts as an arithmetic problem.

Speed matters in proportion to how much a human is waiting. For interactive work, a faster model that needs a second pass often beats a slower model that gets there in one, because the human stays engaged. For unattended overnight work, latency barely matters and I would rather spend the wall clock on a better answer.

Privacy is the axis where I want the least cleverness. Some material should not leave the house, and the way to guarantee that is not a policy document but a route with no hosted model in its resolution path at all. "Local only" should be a property of the route, not a habit of the operator.

## The routing was right and the run still did nothing

The most useful failure I have hit was not a bad model choice.

I pointed the system at a task that had already been completed on another branch. The model dutifully investigated the repository, found the finished work, concluded there was nothing to do, and stopped. Every gate passed. The run was recorded as a success. It produced nothing.

The next task in the queue — same model, same machine, same prompt scaffolding — produced a publishable draft on the first attempt.

Nothing in a routing table catches that. A routing table assumes the task is well-posed and the answer is unwritten. Both of those are assumptions about the *work*, not about the model, and both were things I could have checked before spending the GPU time.

The lesson I took is that routing sits downstream of task selection, and most of my early "the model was not good enough" conclusions were really "the task was not worth running."

## Fail closed

The behavior I am most glad I built is refusal.

If a task names a model class this host has not mapped, the host skips it and records why. It does not quietly substitute the default. If two conflicting model labels are present, that is ambiguity, and ambiguity skips too.

The temptation to add a fallback is real, because a skipped task looks like a bug and a fallback always produces output. But a silent substitution makes the record of what ran wrong, and a wrong record is worse than no run. When I later ask why a result was poor, I need "this ran on the model you asked for" to be true without checking.

Refusing is cheap. Explaining a result produced by a model nobody chose is not.

## The practical shape

What I have converged on is unremarkable, which I take as a good sign.

A small number of model classes, named by role rather than by vendor or version. A per-host mapping from class to concrete tag, so the same task description works on different hardware. Context budgets attached to the class, because quality travels with context. An explicit local-only route for anything sensitive. And a hard skip whenever the routing cannot be resolved unambiguously.

Model names in that system are the most disposable part. They change every few months. The classes, the boundaries, and the refusal behavior have not changed in a while, and those are the parts that were actually engineering.

Pick the constraint before you pick the model.

## Public sources

- [Chroma: Context Rot — how increasing input tokens impacts LLM performance](https://www.trychroma.com/research/context-rot)
- [Chroma context rot replication toolkit](https://github.com/chroma-core/context-rot)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Ollama: structured outputs](https://docs.ollama.com/capabilities/structured-outputs)

## Related reading

- [Treating Context Like Code](/posts/treating-context-like-code/)
- [My Personal LLM Wiki Operating Model](/posts/my-personal-llm-wiki-operating-model/)
