# Editorial Research Radar

Status: Active contract for issue #78.

This file is the machine-readable and human-readable contract for editorial
research agents that work on `ranjib/ranjib.github.io`. Agents must read this
file before performing radar work.

## Editorial Thesis

Ranjib builds reliable systems across software, infrastructure, open source,
physical hobbies, personal knowledge, and GenAI. The site is the canonical
public home for that work. External research should help identify meaningful
changes that connect to lived experience, public artifacts, experiments, and
durable systems lessons.

The radar must not become an autonomous content farm. It observes, compares,
and proposes bounded review items.

Allowed path:

```text
external sources -> research agent -> research issue -> Ranjib review
  -> experiment or outline -> draft -> publication decision
```

Disallowed path:

```text
external sources -> LLM -> published article
```

## Editorial Lanes

Use the editorial lanes from `docs/blog-pipeline.md` when classifying findings:

- Systems and reliability
- GenAI practice
- Open source and physical computing
- Hobbies as systems
- Career retrospectives

Map these to public site lanes when useful:

- `engineering-ai`: Systems and reliability, GenAI practice
- `open-source-making`: Open source and physical computing
- `field-notes`: Hobbies as systems
- `learning-life`: Career retrospectives and public-safe learning reflections

## Recurring Concepts

Prefer findings that connect to one or more of these recurring concepts:

- observability
- feedback loops
- automation
- safe defaults
- documentation
- capacity
- constraints
- maintenance
- learning loops

## Evidence Hierarchy

Use primary and high-context sources first:

1. Official project, vendor, standards, or research publications.
2. Engineering blogs from teams that built or operated the system.
3. Peer-reviewed papers, preprints with clear provenance, and conference talks.
4. Reputable extension, university, or public-agency sources for hobby systems.
5. Practitioner write-ups with enough detail to verify the claim.
6. Secondary summaries, social posts, SEO pages, and rumor threads.

Lower-authority sources may help detect weak signals, but they should not carry
the recommendation unless corroborated by stronger evidence.

## Preferred Source Types

Prefer source-backed developments such as:

- release notes and changelogs;
- incident reviews and postmortems;
- public engineering write-ups;
- standards and specification changes;
- research papers and evaluator documentation;
- extension publications for gardening and field systems;
- open-source project documentation and issue discussions.

## Novelty Criteria

A finding should explain what changed, not just what appeared.

Useful novelty includes:

- a new capability, failure mode, or operating pattern;
- evidence that strengthens or challenges an existing article thesis;
- a repeated weak signal across independent sources;
- a concrete experiment Ranjib can run;
- a connection across professional and hobby systems.

Reject novelty that is only launch hype, listicle framing, or a thin summary of
someone else's announcement.

## Lived-Experience Test

Before recommending `write`, ask whether Ranjib can add at least one of:

- first-hand infrastructure, reliability, platform, or open-source context;
- a local GenAI/tooling experiment;
- a real hobby-system observation;
- a historical comparison grounded in public work;
- a reusable engineering lesson beyond the external announcement.

If not, use `watch`, `ignore`, or `experiment` instead.

## Trend-Chasing Rejection Criteria

Reject or downgrade a candidate when:

- it is popular but has no clear connection to the site thesis;
- the likely article would mostly recap another organization's post;
- evidence is weak, speculative, or dominated by secondary SEO content;
- it duplicates a stronger existing post or backlog idea;
- the useful insight fits a research note better than a blog post.

## Freshness Classes

Use these classes when auditing existing articles:

| Class | Meaning | Default action |
| --- | --- | --- |
| Evergreen | Durable principle or historical reflection | None |
| Evolving | Pattern still holds but the ecosystem is changing | Research note |
| Version-sensitive | Mentions current models, tools, APIs, or features | Review |
| Obsolete | Recommendation or factual claim is superseded | Correction/update issue |
| New evidence | New paper or data strengthens or challenges thesis | Consider follow-up |

Do not rewrite published posts automatically. Create issues only when the
change is material.

## Research Scoring Rubric

Score candidates from 0 to 3 on each dimension:

| Dimension | Question |
| --- | --- |
| Impact | Would this materially change practice, framing, or reader value? |
| Relevance | Does it intersect with the site's thesis, lanes, or backlog? |
| Novelty | Is there a real change or repeated weak signal? |
| Evidence quality | Are sources primary, durable, and corroborated? |
| Lived-experience fit | Can Ranjib add experiment, history, or field context? |

Recommended disposition:

- `ignore`: low relevance or weak evidence;
- `watch`: plausible but not yet actionable;
- `experiment`: useful only after local testing or observation;
- `update-existing`: material change to a published post;
- `write`: strong enough for a blog issue or article plan.

Default to the least aggressive disposition that still preserves the signal.

## Privacy Rules

The radar may use only public website content, public GitHub issues, public
source registries, and explicitly generated public-safe context packs. It must
not read, request, summarize, or infer from private wiki content unless Ranjib
has created a public-safe pack for that specific use.

Do not publish or suggest publishing:

- family logistics or child-identifying context;
- health, school, custody, finance, or exact home-location details;
- precise home operations or private garden/household inventories;
- confidential employer information;
- private knowledge-graph pages or raw local photo inventories.

## Allowed Automated Outputs

Radar workflows may:

- create or update one bounded research issue per run;
- comment on an existing blog issue when a finding clearly belongs there;
- update deterministic weak-signal state when the diff is reviewable;
- propose experiments, backlog updates, or article candidates.

## Prohibited Autonomous Outputs

Radar workflows must not:

- publish posts;
- rewrite published posts;
- merge pull requests;
- change site branding;
- change domain, DNS, or GitHub Pages settings;
- alter private knowledge-graph content;
- broadly reorder the editorial backlog;
- send social posts, comments, direct messages, or newsletters.

## Human Approval Boundaries

Ranjib owns final decisions about:

- whether a finding becomes an experiment, backlog item, article, or update;
- whether a source is sufficiently trustworthy;
- whether a private-context boundary is safe;
- whether scheduling should move from manual to recurring automation;
- whether any external profile, newsletter, or domain change happens.

## Output Shape

Weekly radar issues should include 10 to 15 high-signal findings when possible,
but signal quality matters more than count. Each finding should include:

```text
Finding
Why it matters
Editorial lane
Connection to existing article, issue, or backlog item
Potential thesis
Public sources
Freshness
Confidence
Scores: impact, relevance, novelty, evidence quality, lived-experience fit
Recommended disposition: ignore | watch | experiment | update-existing | write
```

The issue should also include:

- rejected trend-only candidates;
- repeated weak signals;
- experiments worth running before writing;
- privacy exclusions encountered;
- next review date.

## First Drift Fixture

The original issue #78 identified a README versus CLAUDE theme/submodule
contradiction as the first internal drift fixture. This PR resolves that
specific contradiction. Future platform and obituary audits should continue to
detect similar drift between `README.md`, `CLAUDE.md`, `docs/*`,
`design-system/*`, `layouts/*`, `.github/workflows/*`, `scripts/*`, and
`config.toml`.
