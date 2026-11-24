---
title: "My First Year of Agentic Software Development"
date: 2026-11-23T00:00:00-08:00
draft: false
description: "How agentic development moved from autocomplete to whole implementations—and why context, verification, and learning are now the real work."
summary: "Four milestones in the changing unit of software delegation, followed by the toolchain and context-engineering patterns that made larger agentic changes trustworthy."
lane: "engineering-ai"
tags:
  - "agentic software development"
  - "context engineering"
  - "software verification"
  - "spec-driven development"
  - "developer tools"
---

The industry path from Cursor's 2024 autocomplete to today's coding agents spans more than a year. I treat Cursor's autocomplete phase as the prelude. My first intensive year of repository-level agentic development began around the arrival of Claude Code and Codex in early 2025; the final milestone emerged as that year ended and has continued to develop in the months since.

First it was a statement. Then it was a method or a test. Then it was a task from a specification—for example, one endpoint and its tests inside a service. Now it can be a whole implementation spanning schema, API, UI, migration, observability, and documentation, delivered as one delegated objective with a large diff and a body of evidence around it.

That progression is easy to describe as better code generation. I think that misses the more important change.

For well-specified work in repositories with strong feedback loops, producing code is becoming cheaper than establishing shared confidence in it. The hard work has moved into the system around it: assembling context, preserving decisions, writing specifications, choosing models, designing verification, reviewing large changes, and helping people understand what was built. This is the context-engineering practice I have been developing across professional projects, open source, and my personal work.

These are not final answers. The field is moving too quickly for that. They are the patterns that have survived contact with several projects and remained useful for months—my first year's lessons in context engineering for software development.

## Four changes in the unit of delegation

The cleanest way I know to explain that first year—and the direction it established—is not by model generation or benchmark score. It is by the size of the intent I can hand off.

### 1. Autocomplete on steroids

The first shift felt like autocomplete suddenly understood the next move.

Cursor Tab could complete a full statement, edit multiple lines, add an import, or jump to the next likely edit. Cursor's retrospective on [its March 2024 Tab model](https://cursor.com/en-US/blog/tab-update) captures the transition well: it was no longer limited to inserting text at the cursor; it could propose edits around the cursor and predict where the developer would work next. Later models extended those suggestions into much longer changes.

This was still recognizably manual programming. I chose the design, navigated the code, and composed the implementation. The model accelerated expression. Pressing Tab replaced keystrokes, not engineering responsibility.

It was nevertheless an important threshold. Once a tool can infer the next statement from local context, the natural question is whether it can infer the rest of the implementation unit.

### 2. Complete methods and tests from a prompt

The next useful unit was a whole method, component, migration, or unit-test suite.

At this stage, I could describe a bounded behavior and receive an implementation. The developer still performed the decomposition: decide which method was needed, provide the relevant context, request the tests, inspect the output, and wire the result into the larger system.

February and May 2025 made this mode much more practical. Anthropic introduced [Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet) as a terminal-based agentic coding tool in February. OpenAI launched the [Codex cloud research preview](https://openai.com/index/introducing-codex/) in May, describing an agent that could work on software tasks in its own environment, edit files, and run tests. This was my “prompt to code” moment: the model was no longer only proposing a snippet for me to paste. It could operate on a repository, attempt a bounded change, and validate it in the development environment.

Benchmarks were also beginning to measure this larger unit. [SWE-bench](https://www.swebench.com/) shifted the evaluation unit from small, self-contained coding exercises to real GitHub issues and repository snapshots. Solving the task required finding the relevant code, understanding an issue, modifying the repository, and passing tests. The benchmark was imperfect, but its unit of work was directionally right: an engineering issue rather than a function-completion puzzle.

The human still owned the workflow. I was asking for one bounded change at a time and deciding what came next.

### 3. A complete task from a specification

By January 2026, the practical unit had become an entire task.

I could start with a specification or a well-formed issue and expect the agent to inspect the repository, develop a plan, implement the change, add or update tests, run checks, and report what it had done. That was when I realized I was unlikely to return to writing production code by hand as my default mode.

This did not mean the agent no longer needed engineering judgment. It meant my judgment was being expressed in different artifacts. The issue carried the problem and acceptance criteria. Project instructions carried repository conventions. The plan exposed the intended path. Tests and review criteria defined what evidence would be persuasive.

The ecosystem was also converging on this shape. GitHub's [Spec Kit](https://github.github.com/spec-kit/) made specification, planning, implementation, and convergence explicit stages of an agentic development workflow. OpenAI's own [Codex practices](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf) recommended prompts structured like GitHub issues and a plan-first approach for large changes. Integrations now allow a [Linear issue to be assigned to Codex](https://linear.app/integrations/codex), making the tracker itself an entry point into implementation.

Anthropic's research later found the same broad movement in real usage: [people granted Claude Code longer periods of autonomous work](https://www.anthropic.com/research/measuring-agent-autonomy). My January realization was personal, but it was not isolated.

### 4. The whole implementation in one run

The current frontier is a qualitative change from task-by-task agentic development.

Instead of decomposing a feature into several issues, running an agent for each one, and incrementally assembling the result, I can increasingly hand over the complete implementation. The run may change a module across several subsystems: data model, API, control plane, user interface, migrations, observability, tests, and documentation. The output is correspondingly larger.

This is not “one-shot prompting.” A large implementation succeeds because the run has a prepared environment and a rigorous internal process. It may use specialized agents, skills, plans, checkpoints, test loops, independent reviewers, and multiple context windows. “One run” describes the unit I delegate, not the absence of engineering inside the run.

Anthropic's work on [effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) makes the same distinction. A frontier model in a loop is not enough. Long work needs progress artifacts, context management, a clean environment, incremental validation, and a way for later sessions to recover state. The larger the requested implementation, the more important the harness becomes.

By **one run**, I mean one delegated objective carried to an evidence-backed result, even when the harness uses multiple agents, checkpoints, commits, or context windows internally. It does not mean that the result should be deployed as one indivisible change.

This stage produces a paradox. The agent can present a larger candidate change than a human can comfortably review in one sitting. Implementation throughput rises, but comprehension does not rise at the same rate. The bottleneck moves.

## My current toolchain: harness, models, and skills

I no longer think of an agentic development toolchain as a single coding assistant. I think of it as three layers.

The first layer is the **harness**: the environment that can inspect a repository, edit files, run commands, manage context, and show me the result. I use [Codex](https://developers.openai.com/learn/codex), [OpenCode](https://github.com/anomalyco/opencode), and [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) in this role. They overlap, but that is useful. Harness choice affects permissions, isolation, model access, interaction style, extensibility, and how easily a run can be resumed or reviewed.

The second layer is the **model**. I choose it for the kind of reasoning required, not only for a leaderboard position. A model that is effective for a broad implementation may not be my preferred reviewer. A fast model may be enough for repository reconnaissance. A deeper-reasoning model may be worth the cost for architecture or failure analysis. Model routing is now an engineering choice inside the workflow.

The third layer is **skills**: reusable process and domain instructions that turn hard-won practice into agent-readable behavior.

[Superpowers](https://github.com/obra/superpowers) is a good example of process encoded as composable skills: brainstorming, writing specifications and plans, test-driven development, systematic debugging, verification, and review. It makes the development method explicit instead of hoping the model reconstructs it from a short prompt.

[Ponytail](https://github.com/DietrichGebert/ponytail) pushes in a complementary direction: write the smallest change that solves the problem, reuse what already exists, and do not remove validation, security, or tests in the name of minimalism. This matters because agents can produce plausible excess code extremely quickly.

[pstack](https://github.com/cursor/plugins/tree/main/pstack) packages a more extensive engineering workflow around its main Poteto mode, multi-model routing, investigation, architecture, test-driven development, review panels, verification skills, and long-running or parallel work. What interests me most is not any single command. It is the idea that verification strategy itself can be generated, maintained, and invoked as a reusable project skill.

These tools will change. The durable lesson is the separation of concerns: the harness operates, the model reasons, and the skills carry method. Treating them as distinct layers makes it easier to improve one without rebuilding the whole workflow.

## Pattern 1: build the knowledge system before the software factory

The most leveraged work often happens before the first implementation prompt.

I want a project to have a distilled LLM wiki: an agent-readable representation of architecture, terminology, decisions, constraints, ownership, interfaces, operational history, and active work. Some projects may represent relationships as a knowledge graph, but the important property is curated, traversable knowledge—not the storage technology. This is not a dump of every chat and document. Raw history contains abandoned decisions, duplicated facts, stale assumptions, and details that should not influence the next run.

The useful pipeline is closer to:

```text
raw sources
  -> reviewed knowledge
  -> task-specific context
  -> agent work
  -> new evidence and decisions
  -> reviewed knowledge
```

Anthropic's work on [effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) emphasizes selecting the smallest, highest-signal context that supports the desired behavior. Its later discussion of [agent memory](https://www.anthropic.com/research/components-of-agent-memory) explicitly describes wikis as one representation an agent can use to navigate a growing knowledge base.

The same knowledge system can power much more than software implementation. Architecture and product design need the same constraints. Documentation needs the same terminology. Outreach needs accurate project history and positioning. Support needs the same operational facts. A well-maintained knowledge base becomes shared infrastructure for a wider work factory.

The important word is **distilled**. More context is not automatically better context. The knowledge needs provenance, freshness, boundaries, and a maintenance loop. I described my current approach in [My Personal LLM Wiki Operating Model](/posts/my-personal-llm-wiki-operating-model/) and [Treating Context Like Code](/posts/treating-context-like-code/).

My wiki made this concrete. Raw conversations and project artifacts remain source evidence; reviewed domain pages hold durable knowledge; task-specific context packs compile only the relevant sections; and eval failures point back to the source page that needs correction. That separation prevents a temporary observation from silently becoming permanent agent memory. It also gives every layer a different review question: Is the source authentic? Is the distilled claim still current? Is this the right claim to include for this task? Did it produce the intended behavior?

## Pattern 2: specifications and plans are executable coordination

When an agent can generate thousands of lines quickly, ambiguity becomes more expensive.

A specification should state the behavior, constraints, non-goals, interfaces, failure modes, and acceptance criteria. A plan should connect those requirements to the existing system: which components change, in what order, with what migration and verification strategy. The spec holds intent. The plan holds the proposed path. Keeping them distinct makes both easier to review.

Issue trackers such as GitHub Issues, Jira, and Linear fit naturally into this workflow, but their value is larger than task dispatch. They can become episodic memory.

An issue records what the world looked like when the work began: the problem, evidence, alternatives, decisions, linked dependencies, implementation trace, review discussion, and outcome. A later agent can learn not only the current architecture but why it became that way. The tracker becomes a chronological complement to the distilled wiki.

The integration loop I want is:

```text
issue -> specification -> reviewed plan -> implementation
      -> verification evidence -> review -> outcome and lessons
```

This is why assignment integrations such as [Codex for Linear](https://learn.chatgpt.com/docs/third-party/linear) are interesting, and why OpenAI's [Jira-to-GitHub Codex example](https://developers.openai.com/cookbook/examples/codex/jira-github) matters beyond convenience. The issue is becoming a durable interface between human intent, agent execution, and organizational memory.

The failure mode is treating every ticket as permanent truth. Episodic memory still needs links to superseding decisions and periodic distillation into stable project knowledge.

In my projects, the practical cycle is issue → branch or worktree → reviewed plan → implementation → tests and lint → pull request → review → merge → memory update. The issue preserves the episode; the wiki preserves the durable lesson. Keeping those roles separate avoids turning the knowledge base into a chronological dump while still making the history recoverable. My companion essay, [From Natural-Language Plans to Executable Work Contracts](/posts/from-natural-language-plans-to-executable-work-contracts/), goes deeper on the boundary between a prose plan and an authorized, verifiable unit of execution.

## Pattern 3: verification must exist at every layer

The limiting factor in large agentic changes is not whether the agent can produce code. It is whether the delivery system can produce enough evidence to justify accepting and deploying the change.

That requires more than asking the agent to “add tests.” A serious project needs a layered verification strategy:

- **Static checks and unit tests** for narrow logic, types, schemas, lint, and security properties.
- **Integration tests** for boundaries between components, storage, queues, APIs, and third-party dependencies.
- **User acceptance tests** for behavior stated in the specification, ideally expressed in language a product owner or operator can inspect.
- **Smoke tests** for the smallest proof that the deployed system starts and completes a critical path.
- **Distributed-systems tests** for retries, timeouts, idempotency, partial failure, race conditions, degraded dependencies, and recovery.
- **Production observability** for the cases no pre-production suite anticipated.

Google's SRE guidance on [testing for reliability](https://sre.google/sre-book/testing-reliability/) remains relevant because distributed behavior cannot be established by unit coverage alone. Anthropic's [agent-evaluation guidance](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) makes a parallel point: no single evaluation layer catches every problem. Deterministic checks, model-based graders, transcript inspection, human judgment, and production monitoring cover different failure surfaces.

The newer lesson for me is that a project needs **verification skills**, not only tests.

A verification skill teaches an agent how to establish confidence for this particular system: which environments to use, how to seed data, which invariants matter, how to observe an asynchronous workflow, how to inject failures, how to distinguish a flaky check from a real regression, and what evidence belongs in the final report. The [pstack verification-skill workflow](https://github.com/cursor/plugins/tree/main/pstack/skills/create-verification-skill) points in this direction.

Tests are artifacts. Verification is a practiced method for deciding whether the artifacts and the running system support the claim.

For a substantial change, I want the run to return an **evidence bundle**, not merely a green checkmark:

- each acceptance criterion mapped to one or more checks
- the commands, environments, and test data used
- the relevant results, including failures encountered and fixed
- migration and rollback evidence where state changes
- unresolved risks and assumptions
- the production signals that should be watched after deployment

The evidence is still bounded. A passing suite cannot prove the absence of failure, and an agent can write tests that simply agree with its implementation. Independent tests, failure injection, production observation, and human judgment remain necessary where the risk demands them.

One lesson from my agent lab is to make the authority order explicit. Capability and security policy come first. Deterministic validation gates outrank the model's opinion. The specification defines the required behavior. Model-generated implementation and critique remain candidates and advice. An agent may propose a repair, but it cannot waive a failed gate, expand its own permissions, or declare an unattributed substitute result successful.

## Pattern 4: use a challenger model, then fix the gap structurally

The model that implemented the change should not be the only model asked whether the change is complete.

I use a challenger as an independent auditor. It receives the specification, plan, diff, and verification evidence and tries to disprove completion. It looks for missed requirements, architectural drift, unsafe assumptions, weak tests, incompatible interfaces, operational gaps, and documentation that no longer matches behavior.

Independence matters. A fresh context avoids inheriting the implementation run's narrative. A different model can add useful diversity because models have different blind spots. For a high-risk change, I may want more than one challenger, each with a narrow rubric: security, reliability, data migration, performance, or user behavior.

I now treat the challenger as a bounded, attributable attempt rather than a free-form escalation. It receives the same acceptance gates as the primary model, has an explicit model identity and attempt number, and cannot publish anything that fails those gates. This distinction matters because a more persuasive explanation is not evidence that the implementation improved.

The challenger is not automatically correct. Model graders need calibration, clear criteria, and human review. OpenAI's guidance on [evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) and Anthropic's eval guidance both treat model judgment as one layer rather than an oracle.

My own experiments also made me more conservative about model routing. A fixture can prove that the retry and challenger machinery accounts for failures correctly; it cannot prove that a challenger improves real completion rates. Changing production routing requires repeated task-class evidence, including completion, wall time, cost, and the negative cases where the challenger adds nothing or makes the result worse.

The most important step comes after a valid finding. Do not only patch the code.

Ask which durable artifact allowed the gap:

- Was the requirement missing from the specification?
- Did the plan ignore a subsystem boundary?
- Was the knowledge base stale?
- Did project instructions omit a convention?
- Was a test layer absent?
- Did the verification skill fail to request the decisive evidence?

Fix that artifact as well as the implementation. Otherwise the next run will reproduce the same class of mistake.

## Pattern 5: human review and comprehension become the bottleneck

When implementation is largely automated, the cognitive burden does not disappear. It concentrates.

The developer has to review the design, understand the implementation, judge the verification, and decide whether the system is safe to operate. A ten-line autocomplete suggestion is easy to absorb. A cross-subsystem diff produced in one run may represent days of conventional implementation work. Reading it linearly is not a viable long-term interface.

This is the current review and comprehension bottleneck in agentic software delivery: the rate at which candidate implementations can be generated is beginning to exceed the rate at which people can build an accurate mental model of them and establish trust.

Review therefore needs better learning artifacts.

[Archify](https://github.com/tt-a1i/archify) can turn a plan or codebase into interactive architecture, sequence, workflow, data-flow, and lifecycle diagrams. The official [draw.io MCP server and plugins](https://www.drawio.com/docs/manual/generate/drawio-mcp-server/) let agents create editable `.drawio` diagrams inside supported assistants. These are valuable when they expose a design claim that can be checked against the code, not when they merely decorate a pull request.

Documentation should expand beyond an API reference. A large change can produce:

- a maintainer's manual and an operator runbook
- an architecture diagram and a request-flow walkthrough
- a short presentation for reviewers
- migration and rollback guides
- flash cards for terminology and invariants
- a quiz that tests whether a reviewer understood the failure modes
- a source-grounded audio overview for learning away from the screen

Tools such as [NotebookLM](https://notebook.google/students) demonstrate the range: source-grounded study guides, audio overviews, slide decks, mind maps, flash cards, and quizzes. The specific product is less important than the principle. If a format helps a developer build an accurate model faster, it is part of the delivery system.

This changes what “developer tooling” means. A tool that helps people test their understanding can be as valuable as one that helps an agent write code. A tool that converts an implementation into a reviewable visual explanation may remove more delivery latency than another improvement in token generation speed.

The goal is not to produce a pile of ancillary artifacts. It is to identify the smallest set that transfers the important knowledge: what changed, why it is shaped this way, how it behaves, how it fails, and how we know. These formats are options, not a checklist; they earn their place only when they reduce review or learning time.

## Where I would not delegate the whole implementation

Larger delegation is not automatically better.

I would break the work down when the product intent is still contested, ownership is unclear, the repository lacks reliable feedback loops, or a change crosses a security, privacy, financial, or irreversible data boundary that needs explicit human decisions. The same caution applies when a legacy system has weak tests, undocumented coupling, or no safe environment for migration and rollback rehearsal.

Large generated diffs also need reviewable structure. One delegated objective can still produce small ordered commits, feature flags, reversible migrations, and independently deployable stages. The unit of delegation should not become the unit of blast radius.

Secrets and permissions are another boundary. A coding agent should receive the least access needed for the run, operate in an isolated environment where practical, and treat repository instructions and third-party skills as executable supply-chain inputs rather than harmless prose.

The decision is not “Can the agent attempt this?” It is “Do the context, feedback loops, access boundaries, and rollback path make this a responsible unit to delegate?”

## What I believe after the first year

I do not know whether these will be the long-term patterns of software development. Models, harnesses, skill formats, benchmarks, and team practices are changing too quickly to mistake the current stack for a settled architecture. Some workflows that feel essential today may become native model behavior. Some large autonomous runs may prove harder to maintain than smaller, incremental changes. New failure modes will appear as delegation grows.

But a few lessons have remained useful across personal and professional projects. The meaningful measure of progress is the unit of intent we can delegate with confidence. Larger delegation requires better context, not only a better model. Specifications and issues are memory and coordination artifacts, not ceremony. Verification must be designed at every layer. Independent challenge is more useful when its findings improve the system, not only the patch. And as code production becomes cheaper, human comprehension becomes the constraint worth optimizing.

I started this year thinking mostly about what an agent could code. I end it asking four questions before delegating a larger unit of work:

1. Is the intent explicit enough to review before implementation?
2. Is the context current, distilled, and appropriately bounded?
3. Can the system exercise the important failure modes and return persuasive evidence?
4. Can a reviewer understand, challenge, deploy, and reverse the result?

That is my first year of context engineering for software development: not learning how to ask for more code, but learning how to build the environment in which more consequential delegation can be responsible.
