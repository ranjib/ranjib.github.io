---
title: "Testing Infrastructure Was the Original Context Engineering"
date: 2026-08-11T00:00:00-07:00
draft: false
---

Current AI language makes context engineering sound new.

In one sense, it is. LLM agents have their own mechanics: context windows, retrieval, tool calls, system prompts, memories, model routing, and evals. The operating surface is different from a fleet of servers.

But the engineering problem feels familiar.

When I worked on test-driven development for operations, the hard part was getting teams to treat infrastructure code as behavior. A cookbook was not documentation about a server. It was an executable artifact that could change production. It encoded assumptions about packages, users, files, templates, secrets, service dependencies, and runtime state.

Context for agents has the same property. A prompt, project instruction file, retrieval result, tool schema, rubric, or memory pack is not just prose. It can make an agent choose the right file, preserve a privacy boundary, run the right check, or avoid a stale assumption. It can also make the agent confidently do the wrong thing.

Testing infrastructure was an early version of the same discipline: make hidden assumptions explicit, version them, and use feedback loops to keep behavior from drifting away from intent.

## Infrastructure testing was about intent

The first useful move in infrastructure testing was separating declared intent from observed behavior.

Chef let us describe desired state: install this package, render this config, start this service, create this user, wire this dependency. But a declared state is only useful if reality keeps matching it.

Fast unit tests with ChefSpec checked cookbook logic without building a whole machine. Test Kitchen converged real instances or containers. Serverspec and later InSpec verified system state. Linters caught obvious mistakes. CI made the feedback loop routine.

The specific tools have aged. The important idea has not: operational intent should be executable, inspectable, and testable.

That is also the core of context engineering.

An agent instruction might say, "prefer existing project patterns." A context pack might say, "this source is public, this source is private, and this claim is stale." A retrieval system decides which notes enter the model's context window. Those decisions are runtime behavior.

The question is not, "Did we write the context?" The question is, "Did the context cause the system to behave the way we intended?"

## Hidden state is the shared failure mode

Infrastructure had hidden state everywhere.

Two servers could have the same role and different package versions. A data bag could contain a surprising value. A cookbook could depend on a search result that worked in production but failed in a test environment. A service could start correctly only because some old manual change still existed on the host.

The ChefConf talk I gave in 2014 focused on exactly this problem: testing dynamic infrastructure. Dynamic cookbooks were hard to test because they depended on node attributes, data bags, encrypted secrets, search, and external APIs. Mocking helped, but only when used carefully. Too much produced comforting tests that did not verify the real system. Too little made the loop too slow for everyday development.

The hidden state is now conversation history, retrieved documents, tool descriptions, project files, memory, policy boundaries, examples, model behavior, and intermediate steps. A successful response can hide the wrong source. A failed response can be hard to reproduce because the context changed between runs.

That is why modern agent evaluation work keeps returning to multiple graders and layers: code checks, model judges, human review, groundedness checks, trajectory checks, regression suites, and production monitoring. A single final-answer score is not enough when the system can fail during retrieval, planning, tool use, formatting, safety, or source attribution.

This is the same lesson as infrastructure testing: match the test to the layer where the failure can happen.

## Evals are tests for behavioral contracts

The strongest current writing on agent evals has converged on a practical point: evals force teams to define what good behavior means before production users discover the ambiguity.

That sounds very close to TDD.

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

The artifact under test is different: a prompt, retrieval policy, tool interface, context pack, workflow instruction, or model-routing rule. The discipline is the same: write down the behavior, run representative cases, and improve the artifact when reality exposes a gap.

This matters more as agents become less single-turn and more operational.

A coding agent reads files, edits code, runs commands, and prepares a PR. A research agent searches, selects sources, synthesizes claims, and flags uncertainty. A support agent navigates policy, customer context, tool outputs, and escalation rules.

Those systems need regression tests because their behavior is shaped by more than one prompt.

## Context needs a test pyramid too

The state of the art in agent evals is not one magic judge. It is a portfolio: deterministic tests for JSON, tool calls, required fields, and allowed sources; model judgment for groundedness, instruction following, overclaiming, coverage, and tone; human review where domain judgment, taste, risk, or user trust matters.

That maps cleanly onto a context-engineering test pyramid:

- Fast checks for schema, required sections, stale dates, and source boundaries
- Scenario tests for workflows, tool selection, retrieval quality, and instruction following
- LLM-as-judge evals for groundedness, coverage, usefulness, and tone
- Human calibration and production monitoring where offline tests are not enough

The mistake would be treating LLM-as-judge as the whole system. Infrastructure teams learned the same lesson with mocks: they are valuable when they isolate the unit under test, and dangerous when they become a comforting simulation of the world you forgot to verify.

## The old lesson is still the useful one

Testing infrastructure was never really about ChefSpec or Test Kitchen. It was about taking operational behavior seriously once it moved into artifacts.

Prompts, memories, retrieval policies, tool manifests, and workflow instructions are becoming part of production systems. They change outcomes, encode judgment, carry stale assumptions, and create privacy boundaries. They need review, versioning, tests, and post-failure improvement.

The industry has better vocabulary now: agent trajectories, context curation, online and offline evals, groundedness, model graders, and regression suites. That vocabulary is useful. But the engineering taste underneath is older.

When behavior matters, make it explicit.

Write down the intent. Version it. Test it at the right layer. Keep the feedback loop fast. Add integration checks where the real world matters. Calibrate with humans where judgment matters. Fix the artifact when the system fails.

That was the lesson of TDD in operations.

It is also the lesson of context engineering.

## Public sources

- [Strategies for adopting TDD in Operations](https://speakerdeck.com/ranjibd/adopting-test-driven-development-in-operations)
- [Agile Alliance experience report on TDD in operations](https://www.agilealliance.org/wp-content/uploads/2015/12/ExperienceReport.2015.Dey_.Strategies_for_adopting_Test_Driven_Development_in_Operations_.pdf)
- [How to Mock a Mocking Bird](https://speakerdeck.com/ranjibd/how-to-mock-a-mocking-bird-testing-dynamic-infrastructure)
- [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI Evals](https://github.com/openai/evals)
- [OpenAI: How evals drive the next chapter in AI](https://openai.com/index/evals-drive-next-chapter-of-ai/)
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
