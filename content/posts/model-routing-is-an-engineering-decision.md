---
title: "Model Routing Is an Engineering Decision"
date: 2026-08-30T00:00:00-07:00
draft: false
description: "Model routing is built from workload-specific, harness-aware benchmarking, kept fresh by periodic re-benchmarking and a standing research feed."
summary: "Why choosing a model per workload belongs in configuration, why the routing table has to be benchmarked through the full harness rather than guessed, and why it needs to be rebuilt on a cadence rather than trusted forever."
lane: "engineering-ai"
tags:
  - "model routing"
  - "context engineering"
  - "local LLM"
  - "agentic AI"
  - "benchmarking"
---

The routing decision in my home lab is a label on a GitHub issue.

An issue tagged for the large general model runs on one thing. An issue with no model label runs on that host's default. An issue tagged for a model class this particular machine has never mapped does not run at all.

That last case took me the longest to get right, and it is the one I would defend hardest now.

## Routing belongs in configuration, not in the moment

For a long time my model selection was a dropdown. I picked whatever felt appropriate, which usually meant whatever I had picked last time, which usually meant the largest thing available.

That works until the work becomes unattended. The moment a job runs while I am asleep, "which model should this use" stops being a preference and becomes a configuration value somebody has to be able to read, review, and change.

So the alias moved into the repository, and the mapping from alias to a concrete model tag moved into per-host configuration. The issue says *what class of model this work needs*. The machine says *what that class means here*. My Linux workstation — a Ryzen 9 5900X on an X570 board, 128 GB of DDR4, and an RTX 3090 with 24 GB of dedicated VRAM — resolves the large general alias to whatever fits under that VRAM ceiling once weights, context, and runtime buffers are all loaded. My MacBook Pro, an M5 Max with 36 GB of unified memory and no discrete VRAM at all, resolves the same alias to something smaller, or declines to resolve it, because that 36 GB is shared with the operating system and every other running process rather than reserved for one model the way the 3090's 24 GB is.

These are two decisions with two different owners. Whoever files the work does not need to know which machine will pick it up, and the machine never has to reinterpret the intent of the task.

## Building the table: benchmark workloads, not vendor claims

The label-to-model mapping did not come from a leaderboard or a vendor comparison page. It came from running my own sample workloads — a research and summarization task, a multi-file coding task, an image-generation task — against every model class I was considering, and recording what actually happened on my hardware, in my harness.

The a priori behind that effort is easy to state and constantly overlooked: a model that is strong on one workload is not a safe bet on another. Stanford's HELM project was built around exactly this finding at scale — evaluated across dozens of scenarios, no single model wins across the board, because architecture and training recipe trade off differently against different task shapes. HEIM, HELM's sibling project for text-to-image models, reaches the identical conclusion one modality over: across 26 models scored on 12 dimensions, no single model excels in all of them. A model tuned for photorealism is not automatically the model I want for a diagram, any more than a model tuned for chat is automatically the model I want for a long refactor.

Academic work on routing formalizes what I arrived at by trial and error. Shnitzer et al. show that benchmark datasets, repurposed as training signal, can teach a router which model to prefer per task, and that this beats using any single model for everything. FrugalGPT and RouteLLM push the same idea toward cost — cascade or route between a cheap and an expensive model per query, instead of paying frontier prices for work that never needed a frontier model.

The part I got wrong the first few times was benchmarking the model in isolation. My actual unit of comparison is never "the model" — it is the model behind the harness: the tool-calling scaffold, the retrieval step, the prompt template, and the parsing of output back into the pipeline. Swap the harness and the same model's score moves, sometimes by more than swapping the model would. OpenAI's writeup on SWE-bench Verified is the clearest public example: the original SWE-bench environments were unreliable enough that valid solutions were sometimes graded as failures, and the fix was a new containerized evaluation harness, not a different model. Recent work quantifies how large that effect can get: one study found prompt-wrapper choice alone produced an accuracy swing of over 30x in how much it moved scores across models on the same tasks, a second found that up to 96 percent of the score gaps separating models on a leaderboard came from configuration-fragile test items rather than real capability differences, and a third found that adding more structured guidance to an agent harness helps some model tiers and actively hurts others — the effect is not even monotone in model capability.

So the sample workloads I benchmark against are never bare prompts. They are the full pipeline — harness, tool definitions, retrieval, and output parsing — run end to end, on hardware that matches what will actually run the job. A model that wins a public leaderboard and loses inside my harness is, for routing purposes, the losing model.

For the research workload specifically, that harness is a fixed sequence, not a single call: discover candidate sources and log the query and URL before treating anything as evidence, fetch every nominated URL through a retriever the system controls rather than trusting the model's own account of having read it, verify the retrieval before any claim depends on it, extract quotations bound to the fetched content instead of the model's paraphrase of its own memory, and only then synthesize an answer, gated on citation coverage and freshness before a draft reaches me. Benchmarking a model against that harness and benchmarking the same model against a bare "summarize this topic" prompt are two different experiments. The first measures whether the model can do the job I actually have. The second measures whether it can sound like it did.

## What has to fit before quality is even a question

Before I benchmark anything, I do arithmetic. Parameter count times bits-per-weight, divided by eight and by 2^30, gives a rough size in GiB for the raw weights alone — and "rough" is the operative word, because quantization scales and codebooks, tensor alignment, tokenizer state, and whatever layers get kept at higher precision all add overhead on top of that number. A convenient rule of thumb for 4-bit quantization: roughly half a gigabyte per billion parameters before overhead. A 32-billion-parameter model at Q4 lands near 16 GB before overhead, and the overhead is not optional — it is what turns a spreadsheet estimate into the number that either loads or doesn't.

That number alone does not answer whether a model runs. Loaded weights, KV cache, activations, and runtime buffers all have to fit together, with headroom left for the operating system and whatever else is running. On the 3090's 24 GB, that headroom requirement is why a dense model in the 7B–14B range is a comfortable default, 20B–24B is usually fine, 27B–32B is workable but needs its target context tested explicitly, 35B–40B is a real tradeoff between quantization and context length, and a dense 70B does not fit at ordinary 4-bit quantization at all — it needs a CPU/GPU split, at a steep bandwidth cost, or it simply does not run on that machine.

The KV cache is the part of that budget that is easy to forget, because it never shows up in the model's file size. It grows with populated context — roughly linearly in the number of tokens actually cached, scaled by the number of layers, the number of key/value heads, and the head dimension — not with the advertised context window. Two models with identical weight sizes can carry very different cache footprints depending on their attention architecture, so a model reporting a 128K context window is reporting a ceiling the runtime will let me approach, not a memory budget I already have. I have gotten this wrong once: a model that loaded comfortably at a short context ran out of room the moment I gave it the context length the actual task needed.

Mixture-of-experts architectures add a second number I have to track separately from the first. A 200B-total, 20B-active MoE model needs storage for all 200B parameters somewhere, but only the routed 20B participate in computing any given token — so its memory problem looks like the larger number and its compute problem looks like the smaller one. Recording only one of those two numbers is enough to route a model onto hardware that can store it but not run it fast, or hardware that could run it fast if only it had somewhere to keep it.

None of this arithmetic is specific to the 3090. My MacBook Pro's M5 Max has 36 GB of unified memory and no discrete VRAM to reason about at all — capacity and bandwidth are shared with the operating system, the display, and everything else running, rather than reserved the way the 3090's 24 GB is. A model that clears the weight-and-cache arithmetic on both machines can still behave differently on each, because the comparison that matters past that point is not memory capacity — it is measured prompt-processing tokens per second, generation tokens per second, and time to first token, on each machine, for that model. Fit is a screening question. It answers whether a model can be loaded, not whether it is a good route.

## The sample workloads are a portfolio, not a benchmark suite

HELM and HEIM prove the general case at industrial scale: run enough models across enough scenarios and no single model wins everywhere. That does not tell me which few workloads are worth spending my own benchmarking time on, because that answer is not a property of the field — it is a property of what I actually spend hours doing.

So the sample workloads stay bounded to four shapes of work I actually run, not a canonical benchmark category list: deep research (building the sourcing for a post like this one), multi-file coding (this site's own Hugo and Go pipeline, or reef-pi's controller code), long-form writing (drafting the post itself, start to citation-checked finish), and image or multimodal work (a social card, a diagram, a photo pass). Each gets its own harness, because a research harness and a coding harness disagree about what counts as a good answer.

The scope stays bounded further, to the actual portfolio behind this site: career-adjacent production and reliability writing, the hobby systems that are already public here — reef-pi, the garden, overlanding trips — and the home-operations backlog that never makes it into a post at all. A firmware change, a seasonal irrigation adjustment, a trip risk review, and a chore-tracking automation are as legitimate a benchmark workload as anything on a public leaderboard, because they are the work the routing table actually has to serve. A table sized to the universe of possible tasks is a research program. One sized to an actual personal portfolio — career, hobbies, and home responsibilities — is something one person can keep current on a cadence.

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

On local hardware, cost mostly reappears as the memory arithmetic above. The 3090's 24 GB VRAM ceiling and the M5 Max's 36 GB of shared unified memory each eliminate most of the candidate list before quality is even discussed, which is clarifying: on either machine, routing starts as an arithmetic problem, not a preference.

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

## Nothing here stays true on its own

Every input to that routing table has a shelf life. New model versions ship every few months, each with a different profile against the same sample workloads. The harness changes too — a new tool-calling format, a new retrieval library, a new local runtime — and the harness is half of what actually gets benchmarked. Hardware moves on a slower clock, but it moves: a new card changes which models fit in memory at all, which quietly changes which routes are even legal.

Treating the routing table as something computed once and then trusted is the same mistake as treating a leaderboard as a fixed ranking. Chatbot Arena's answer to that problem is architectural: instead of a static leaderboard, it runs as a continuously updated, crowdsourced comparison, because a live ranking degrades more gracefully than a stale one. HELM makes the same choice explicit, describing itself as a living benchmark rather than a fixed release. There is a second, quieter reason static benchmarks decay: contamination. As training corpora grow, benchmark questions and their answers increasingly leak into pretraining data, and a growing survey literature documents scores that improve for reasons that have nothing to do with capability. A benchmark score, like any measure pressed into service as a target, tends to stop measuring what it was built to measure once enough optimization pressure lands on it — the general version of that problem was named in economics decades before language models existed.

What I have converged on is periodic re-benchmarking on the same sample workloads, on a cadence, rather than a one-time calibration. That alone is not enough, because periodic benchmarking without new candidates just re-confirms an aging table more often. The other half is deliberately feeding that cycle with outside signal: a standing research pass — the same discipline I use to keep this blog's own editorial backlog current — that surfaces new model releases, harness changes, and evaluation methodology worth trying before the next re-benchmarking round, instead of waiting to notice a route is stale by watching it lose. Evidence-based medicine has a name for this discipline applied to literature review: a living systematic review, continuously updated as new evidence appears rather than republished from scratch every few years. A routing table kept current by periodic benchmarking plus a standing research feed is the same idea, applied to infrastructure that ages exactly as fast as its inputs do.

## The standing research feed is a radar, not a metaphor

The "standing research pass" above is not a turn of phrase. It is the same editorial research radar this site runs to keep its own backlog current: a bounded, on-demand pass — not a cron job left unattended — that reads primary sources first (model-vendor release notes and docs, engineering blogs, arXiv preprints) over a configurable lookback window, scores each finding for impact, relevance, novelty, and evidence quality, and turns anything that clears the bar into one reviewable issue rather than an autonomous edit. It fails closed the same way the routing host does: no finding gets promoted to a published change without a human decision in between.

That radar already tags a finding as version-sensitive when it touches current models, tools, or APIs — the exact content this routing table depends on. Wiring re-benchmarking to consume that same radar output, instead of running a second, separate watch on model and harness news, means one pipeline does both jobs: it keeps the editorial backlog honest, and it is why the next benchmarking round can start from something more current than whatever I happened to notice had gone stale. Model, harness, context-engineering practice, and the workload itself all move on their own schedules; one standing intake, scored the same way regardless of which of those four moved, is cheaper to keep running than four separate watch lists.

## The practical shape

What I have converged on is unremarkable, which I take as a good sign.

A small number of model classes, named by role rather than by vendor or version, each chosen by benchmarking sample research, coding, and image-generation workloads through the full harness rather than in isolation, and re-run on a cadence rather than trusted forever. A per-host mapping from class to concrete tag, so the same task description works on different hardware. Context budgets attached to the class, because quality travels with context. An explicit local-only route for anything sensitive. And a hard skip whenever the routing cannot be resolved unambiguously.

Model names in that system are the most disposable part. They change every few months. The classes, the boundaries, and the refusal behavior have not changed in a while, and those are the parts that were actually engineering.

Pick the constraint before you pick the model.

## Public sources

- [Shnitzer et al., "Large Language Model Routing with Benchmark Datasets" (arXiv:2309.15789)](https://arxiv.org/abs/2309.15789)
- [Stanford CRFM: Holistic Evaluation of Language Models (HELM)](https://crfm.stanford.edu/helm/)
- [Lee et al., "Holistic Evaluation of Text-to-Image Models" (HEIM), NeurIPS 2023 (arXiv:2311.04287)](https://arxiv.org/abs/2311.04287)
- [Chen, Zaharia, Zou, "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance" (arXiv:2305.05176)](https://arxiv.org/abs/2305.05176)
- [Ong et al., "RouteLLM: Learning to Route LLMs with Preference Data" (arXiv:2406.18665)](https://arxiv.org/abs/2406.18665)
- [OpenAI: Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)
- [Parupudi, "There Is No Neutral Harness: Modern LLM Leaderboards Are Manufactured by Config-Fragile Items" (arXiv:2608.21382)](https://arxiv.org/abs/2608.21382)
- [Mehta, "Format Sensitivity Index: Token-Controlled Prompt Wrapper Robustness and Schema Compliance in LLM Benchmarking" (arXiv:2607.09665)](https://arxiv.org/abs/2607.09665)
- [Cho, "It's Not the Capability: Harness Sensitivity Is Non-Monotone Across LLM Agent Tiers" (arXiv:2605.26731)](https://arxiv.org/abs/2605.26731)
- [Chroma: Context Rot — how increasing input tokens impacts LLM performance](https://www.trychroma.com/research/context-rot)
- [Chroma context rot replication toolkit](https://github.com/chroma-core/context-rot)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Ollama: structured outputs](https://docs.ollama.com/capabilities/structured-outputs)
- [Chiang et al., "Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference," ICML 2024 (arXiv:2403.04132)](https://arxiv.org/abs/2403.04132)
- [Xu et al., "Benchmark Data Contamination of Large Language Models: A Survey" (arXiv:2406.04244)](https://arxiv.org/abs/2406.04244)
- [Strathern, "'Improving ratings': audit in the British University system," European Review 5(3), 1997](https://www.cambridge.org/core/journals/european-review/article/abs/improving-ratings-audit-in-the-british-university-system/FC2EE640C0C44E3DB87C29FB666E9AAB)
- [Cochrane: Living systematic reviews](https://www.cochrane.org/about-us/news/cochranes-pioneering-role-living-evidence)

## Related reading

- [Treating Context Like Code](/posts/treating-context-like-code/)
- [My Personal LLM Wiki Operating Model](/posts/my-personal-llm-wiki-operating-model/)
- [reef-pi as a Small Open Source Platform](/posts/reef-pi-as-a-small-open-source-platform/)
- [Gardening With an Operations Mindset](/posts/gardening-with-an-operations-mindset/)
- [Planning Overlanding Trips Like Reliability Reviews](/posts/planning-overlanding-trips-like-reliability-reviews/)
