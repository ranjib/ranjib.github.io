---
title: "The Through-Line From Chef to Agentic AI"
date: 2026-07-12T00:00:00-07:00
draft: false
---

The first time I cared deeply about infrastructure as code, the argument was not really about Chef.

Chef was the tool in front of us. It gave us cookbooks, recipes, resources, and a DSL for describing how machines should be configured. But the deeper argument was that operational knowledge should not live only in tickets, shell history, wiki pages, and the heads of a few senior engineers.

If a server needed a package, file, daemon, permission, or dependency, that intent belonged in code. If a change could break production, it deserved version control, review, testing, and a release path. If an operator repeated the same judgment, the system should eventually learn it as an artifact.

That belief has followed me through infrastructure automation, TDD in operations, service discovery, reliability engineering, capacity management, and now agentic AI.

The tools differ. The shape is familiar.

## Infrastructure as code made operations legible

Before infrastructure as code became an industry default, a lot of operations work was hard to inspect. Two servers could be "the same" in intention but different in reality. A runbook could describe desired state while a production host drifted away from it. A setup script could work on one machine and fail on another because some unstated assumption was already true.

Chef helped make that work legible. It turned setup into a reviewed artifact. It made infrastructure intent explicit enough to diff, test, reuse, and discuss.

The important shift was not that every cookbook was perfect. It was that infrastructure moved from private procedure into shared software. Once that happened, the usual engineering questions became available:

- What behavior do we expect?
- How do we know this change is safe?
- What assumptions does this artifact encode?
- What happens when reality drifts from the declared state?
- How do we recover when the artifact is wrong?

Those questions mattered because infrastructure code changed production behavior. Treating it as casual text would have been irresponsible.

## Testing operations was the next step

Once infrastructure was code, the next question was obvious: why change it without tests?

That was the core of my automated infrastructure testing work. ChefSpec, Test Kitchen, Serverspec, InSpec, Foodcritic, RSpec, Jenkins, and containerized test environments were pieces of a feedback loop.

The goal was to make operational change less dependent on memory. A cookbook should express intent. A test should catch the common ways that intent breaks. A CI pipeline should run checks before production. A failed test should improve the artifact, not just remind one person to be more careful.

This was TDD in operations in the practical sense: define intended behavior, make the failure visible, change the artifact, and keep the regression from coming back.

The discipline mattered more than the specific toolchain. Some tools aged. The pattern did not.

## Agentic AI has the same hidden-state problem

LLM and agent workflows are in a similar stage.

It is easy to treat prompts as temporary text: paste instructions into a chat, get a useful answer, and move on. It is also easy to accumulate project notes, memory snippets, issue summaries, coding preferences, tool rules, and domain context until an agent seems well informed but nobody can explain why it behaves the way it does.

That is the hidden-state problem again.

An agent does not respond only to the user's last sentence. It responds to the whole operating environment: system instructions, project files, tool permissions, retrieved context, examples, prior decisions, stale facts, and whatever the model already learned during training. Some of that environment is visible. Some is implicit. Some is maintained. Some is accidental.

When the agent succeeds, hidden state feels convenient. When it fails, hidden state becomes expensive. The agent edits the wrong file, misses a privacy boundary, follows an obsolete workflow, invents a policy, or gives a confident answer based on stale context.

That failure mode is not mysterious. It is configuration drift for reasoning environments.

## Context as code is not a metaphor

Context changes behavior. A project instruction can decide whether an agent runs tests, asks a question, opens a pull request, or refuses to touch a risky file. A context pack can decide whether it remembers a public source, excludes a private detail, or treats a claim as stale. A routing rule can decide whether a task goes to a local model, a cloud coding agent, or a human.

Those artifacts deserve the same basic treatment that infrastructure code deserved:

- version them
- review meaningful changes
- keep public and private context separated
- write down intended behavior
- capture failure modes
- test important workflows
- delete stale assumptions
- improve the artifact when the agent fails

This does not mean every prompt needs ceremony. A throwaway prompt can stay throwaway. The distinction is behavioral importance. If the artifact will be reused, shared, trusted, or allowed to drive real changes, it needs more discipline.

## The old lesson still applies

In infrastructure automation, the mistake was believing the system was safe because an experienced operator knew what to do.

In agentic AI, the equivalent mistake is believing the system is safe because an experienced user can steer the agent in the moment.

Human supervision matters, but it is not a substitute for maintained artifacts. The whole point of automation is that some judgment moves from the person into the system. When that happens, the system needs a way to preserve intent, surface assumptions, and catch regressions.

That is why I like Git-backed context packs, explicit project instructions, reusable workflow checklists, eval rubrics, and issue-to-branch-to-PR loops for agentic coding. They turn conversational habit into something inspectable.

The loop is familiar:

```text
intent
  -> artifact
  -> execution
  -> test or review
  -> observed failure
  -> artifact improvement
```

That loop worked for infrastructure because it made operations inspectable. It can work for agents for the same reason.

## From automation to autonomy

There is still an important difference. Chef converged machines toward a declared state. Agents operate in messier spaces: writing code, summarizing context, choosing tools, interpreting ambiguous goals, and deciding when to ask for help. The behavior is less deterministic, and failures are subtler.

That makes the engineering discipline more important, not less.

Infrastructure as code taught us to make operational intent explicit. TDD in operations taught us to create feedback loops around that intent. Reliability engineering taught us to classify failures so repeated problems become investment signals. Platform engineering taught us to make the safe path easier than the unsafe path.

Agentic AI needs all of that.

The through-line from Chef to agents is not nostalgia for old tools. It is the same engineering taste applied to a new layer of automation: important behavior should be written down, reviewed, tested, and improved when reality proves it wrong.

The prompt is not the unit of value. The behavior is.

## Public sources

- [System Automation Using Chef](https://ranjib.github.io/about/personal/)
- [Automated Infrastructure Testing](https://www.slideshare.net/ThoughtWorks/automated-infrastructure-testing-ranjib-dey)
- [How to Mock a Mocking Bird](https://speakerdeck.com/ranjibd/how-to-mock-a-mocking-bird-testing-dynamic-infrastructure)
- [Strategies for adopting TDD in Operations](https://speakerdeck.com/ranjibd/adopting-test-driven-development-in-operations)
- [Agile Alliance experience report](https://www.agilealliance.org/wp-content/uploads/2015/12/ExperienceReport.2015.Dey_.Strategies_for_adopting_Test_Driven_Development_in_Operations_.pdf)
- [Chef-LXC: Building and Deploying Custom Containers](https://speakerdeck.com/ranjibd/chef-lxc-building-and-deploying-custom-containers)
- [Consul at PagerDuty](https://speakerdeck.com/ranjibd/consul-at-pagerduty)
