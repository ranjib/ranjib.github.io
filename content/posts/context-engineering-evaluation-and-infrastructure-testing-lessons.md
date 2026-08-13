---
title: "Context Engineering Evals Remind Me of Infrastructure Testing"
date: 2026-08-11T00:00:00-07:00
draft: false
---

Context engineering is real engineering work in its own right.

LLM agents have their own mechanics: context windows, retrieval, tool calls, system prompts, memories, model routing, and evals. The operating surface is different from a fleet of servers, and it deserves its own vocabulary.

Still, the evaluation challenges feel familiar.

When I worked on test-driven development for operations, the hard part was getting teams to treat infrastructure code as behavior. A cookbook was not documentation about a server. It was an executable artifact that could change production. It encoded assumptions about packages, users, files, templates, secrets, service dependencies, and runtime state.

Context for agents has a related property. A prompt, project instruction file, retrieval result, tool schema, rubric, or memory pack is not just prose. It can make an agent choose the right file, preserve a privacy boundary, run the right check, or avoid a stale assumption. It can also make the agent confidently do the wrong thing.

That does not make context engineering a renamed version of infrastructure testing. It makes the comparison useful. Both domains ask how to make hidden assumptions explicit, version the artifacts that steer behavior, and build feedback loops that catch drift before it becomes user-visible.

## Infrastructure testing was about intent

The first useful move in infrastructure testing was separating declared intent from observed behavior.

Chef let us describe desired state: install this package, render this config, start this service, create this user, wire this dependency. But a declared state is only useful if reality keeps matching it.

Fast unit tests with ChefSpec checked cookbook logic without building a whole machine. Test Kitchen converged real instances or containers. Serverspec and later InSpec verified system state. Linters caught obvious mistakes. CI made the feedback loop routine.

The specific tools have aged. The useful lesson has not: operational intent should be executable, inspectable, and testable.

That lesson maps well to context engineering evaluation.

An agent instruction might say, "prefer existing project patterns." A context pack might say, "this source is public, this source is private, and this claim is stale." A retrieval system decides which notes enter the model's context window. Those decisions are runtime behavior.

The question is not, "Did we write the context?" The question is, "Did the context cause the system to behave the way we intended?"

## Hidden state is the shared failure mode

Infrastructure had hidden state everywhere.

Two servers could have the same role and different package versions. A data bag could contain a surprising value. A cookbook could depend on a search result that worked in production but failed in a test environment. A service could start correctly only because some old manual change still existed on the host.

The ChefConf talk I gave in 2014 focused on exactly this problem: testing dynamic infrastructure. Dynamic cookbooks were hard to test because they depended on node attributes, data bags, encrypted secrets, search, and external APIs. Mocking helped, but only when used carefully. Too much produced comforting tests that did not verify the real system. Too little made the loop too slow for everyday development.

The hidden state is now conversation history, retrieved documents, tool descriptions, project files, memory, policy boundaries, examples, model behavior, and intermediate steps. A successful response can hide the wrong source. A failed response can be hard to reproduce because the context changed between runs.

That is why modern agent evaluation work keeps returning to multiple graders and layers: code checks, model judges, human review, groundedness checks, trajectory checks, regression suites, and production monitoring. A single final-answer score is not enough when the system can fail during retrieval, planning, tool use, formatting, safety, or source attribution.

This is the infrastructure-testing lesson I keep reaching for in context engineering: match the test to the layer where the failure can happen.

## Evals are tests for behavioral contracts

The strongest current writing on agent evals has converged on a practical point: evals force teams to define what good behavior means before production users discover the ambiguity.

That reminds me of TDD.

In operations, the red-green-refactor loop forced intent into the open. What should this cookbook do? What should happen after convergence? Which behavior is a unit concern, and which belongs in production monitoring?

For agents, the loop is similar:

```text
intended behavior
  -> examples and rubrics
  -> agent run
  -> grader result
  -> context or prompt change
  -> regression check
```

The artifact under test is different: a prompt, retrieval policy, tool interface, context pack, workflow instruction, or model-routing rule. The habit is similar: write down the behavior, run representative cases, and improve the artifact when reality exposes a gap.

This matters more as agents become less single-turn and more operational.

A coding agent reads files, edits code, runs commands, and prepares a PR. A research agent searches, selects sources, synthesizes claims, and flags uncertainty. A support agent navigates policy, customer context, tool outputs, and escalation rules.

Those systems need regression tests because their behavior is shaped by more than one prompt.

## Context needs a test pyramid too

The state of the art in agent evals is not one magic judge. It is a portfolio: deterministic tests for JSON, tool calls, required fields, and allowed sources; model judgment for groundedness, instruction following, overclaiming, coverage, and tone; human review where domain judgment, taste, risk, or user trust matters. Anthropic's agent-eval guidance, OpenAI's graders and tracing, LangSmith's offline and online evaluator split, Promptfoo's repo-friendly assertions, and Phoenix/Braintrust-style trace-to-dataset workflows all point in the same direction: evaluate the agent at the layer where the behavior can fail.

That suggests a context-engineering test pyramid, with parallel examples from infrastructure and agents.

At the unit layer, infrastructure tests ask whether one small artifact expresses the right intent: does this recipe render the expected config, set the right owner, or call the right resource? Agent unit tests should be just as narrow. Does the prompt template include the privacy boundary? Does the tool schema reject missing required fields? Does the router choose the retrieval tool for a source-backed question? Does the output parser reject invalid JSON? These should be fast, deterministic, and cheap enough to run in CI on every prompt, policy, or context-pack change.

At the smoke layer, infrastructure teams ask whether the system starts at all after a change: can the service converge, boot, answer a health check, and expose the expected port? Agent smoke tests should ask whether the workflow can complete a small golden path without falling apart. Can the coding agent inspect a tiny repo and produce a patch? Can the support agent answer one known policy question with a citation? Can the research agent call search, select an allowed source, and produce a grounded summary? The goal is not deep quality measurement. It is catching broken credentials, missing tools, invalid model names, bad prompt wiring, and obvious regressions before users see them.

At the integration layer, infrastructure tests verify behavior across real dependencies: converge a node, start the service, hit the API, and confirm that the database, network, secrets, and runtime assumptions line up. Agent integration tests need the same realism. Run multi-turn tasks with retrieval, memory, tool calls, handoffs, guardrails, and representative documents. Score the full trajectory, not only the final answer. Did the agent retrieve the right document, call the right tool, avoid forbidden actions, recover from a tool error, cite sources, and stop when the task was complete? This is where LLM-as-judge, pairwise comparison, trajectory checks, and human labels become useful.

The top of the pyramid is production observability. It is not a replacement for testing; it is the higher-priority must-have once agents are doing real work. Offline evals only cover the cases we thought to write down. Production traces show the cases users actually create.

For agent systems, useful observability means nested traces for the agent run, model calls, retrieval, memory reads and writes, tool calls, guardrails, handoffs, retries, errors, token usage, latency, cost, and model version. OpenTelemetry's GenAI semantic conventions are becoming the vendor-neutral shape for that data, and tools such as OpenAI Agents tracing, Arize Phoenix/OpenInference, LangSmith, Braintrust, Promptfoo tracing, and OpenSearch agent traces are all converging on span trees as the debugging primitive.

The must-haves are practical:

- Every production agent run gets a trace ID and a workflow name.
- Every tool call records inputs, outputs, latency, errors, and redacted sensitive fields.
- Retrieval spans record query, selected documents, scores, and source identifiers.
- Model spans record model name, parameters, token counts, finish reason, latency, and cost signals.
- Quality signals from users, humans, or model graders can attach back to the trace.
- Failed or surprising traces can be promoted into regression datasets.

The mistake would be treating LLM-as-judge as the whole system. Infrastructure teams learned the same lesson with mocks: they are valuable when they isolate the unit under test, and dangerous when they become a comforting simulation of the world you forgot to verify.

## The comparison is useful, not complete

Context engineering is not infrastructure testing with a new name. It has new materials: probabilistic models, natural-language instructions, retrieval, memory, tool use, trajectory scoring, and human preference. The work is genuine because those materials create new failure modes.

But infrastructure testing still offers a useful memory. ChefSpec and Test Kitchen were not the point. The point was taking operational behavior seriously once it moved into artifacts.

Prompts, memories, retrieval policies, tool manifests, and workflow instructions are becoming part of production systems. They change outcomes, encode judgment, carry stale assumptions, and create privacy boundaries. They need review, versioning, tests, and post-failure improvement.

The industry has better vocabulary now: agent trajectories, context curation, online and offline evals, groundedness, model graders, and regression suites. That vocabulary is useful because the domain is different. The engineering taste underneath is still recognizable.

When behavior matters, make it explicit.

Write down the intent. Version it. Test it at the right layer. Keep the feedback loop fast. Add integration checks where the real world matters. Calibrate with humans where judgment matters. Fix the artifact when the system fails.

That is the lesson from TDD in operations that I want to carry into context engineering without flattening the new field into the old one.

## Public sources

- [Strategies for adopting TDD in Operations](https://speakerdeck.com/ranjibd/adopting-test-driven-development-in-operations)
- [Agile Alliance experience report on TDD in operations](https://www.agilealliance.org/wp-content/uploads/2015/12/ExperienceReport.2015.Dey_.Strategies_for_adopting_Test_Driven_Development_in_Operations_.pdf)
- [How to Mock a Mocking Bird](https://speakerdeck.com/ranjibd/how-to-mock-a-mocking-bird-testing-dynamic-infrastructure)
- [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenTelemetry: GenAI observability](https://opentelemetry.io/blog/2026/genai-observability/)
- [OpenTelemetry: AI agent observability](https://opentelemetry.io/blog/2025/ai-agent-observability/)
- [OpenTelemetry GenAI agent span conventions](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md)
- [OpenAI Evals](https://github.com/openai/evals)
- [OpenAI: How evals drive the next chapter in AI](https://openai.com/index/evals-drive-next-chapter-of-ai/)
- [OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/)
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
- [LangSmith evaluation types](https://docs.langchain.com/langsmith/evaluation-types)
- [Arize Phoenix: AI observability and evaluation](https://arize.com/docs/phoenix)
- [Promptfoo tracing](https://www.promptfoo.dev/docs/tracing/)
- [Braintrust Eval Manifesto](https://www.braintrust.dev/manifesto)
