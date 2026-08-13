# Carousel Source: Context Engineering Evals

Export target: `docs/distribution/golden/context-engineering-evals-carousel.pdf`

Canonical campaign URL:
`https://ranjib.github.io/posts/context-engineering-evaluation-and-infrastructure-testing-lessons/?utm_source=linkedin&utm_medium=social&utm_campaign=context-engineering-evals&utm_content=carousel`

## Slide 1

Testing Infrastructure Was the Original Context Engineering

Agent evals feel new. Some of the testing problems feel familiar.

## Slide 2

Shared Failure Mode: Hidden State

Infrastructure hid state in packages, data bags, search, secrets, old manual changes, and runtime dependencies.

Agents hide state in retrieved docs, memory, tool outputs, conversation history, model behavior, and intermediate steps.

## Slide 3

Intent Became Executable

Chef cookbooks encoded operational intent.

Prompts, tool schemas, retrieval policies, and context packs now steer agent behavior.

The question is the same: did the artifact create the intended behavior?

## Slide 4

Unit Tests Map To Small Context Checks

Infrastructure unit tests asked whether a small artifact expressed the right intent.

Agent unit checks can test prompt fields, privacy boundaries, output schemas, source rules, and routing decisions.

Fast, deterministic, cheap.

## Slide 5

Smoke And Integration Tests Map To Agent Workflows

Smoke tests ask: can the system complete a golden path?

Integration tests ask: do real dependencies line up?

For agents, that means retrieval, tools, memory, handoffs, guardrails, and trajectory review.

## Slide 6

Production Traces Become Regression Data

Offline evals cover cases we predicted.

Production traces show the cases users actually create.

The strongest loop turns surprising traces into future regression examples.

## Slide 7

The Warning

An LLM judge can become a comforting mock of reality.

Use model judgment where it helps, but calibrate it with deterministic checks, traces, and humans.

Read and discuss:
ranjib.github.io/posts/context-engineering-evaluation-and-infrastructure-testing-lessons/
