---
title: "Why Documentation Is Part of the Product"
date: 2026-08-30T00:00:00-07:00
draft: false
description: "Why reef-pi's documentation issues taught me that docs are a product surface, not a chore that follows shipped code."
summary: "A look at reef-pi's documentation debt, its own issue queue, and why writing guides deserves the same rigor as writing drivers."
lane: "open-source-making"
tags:
  - "reef-pi"
  - "documentation"
  - "open source"
  - "maintenance"
---

I have [written before](/posts/reef-pi-as-a-small-open-source-platform/) about reef-pi's hardware abstraction layer, and [before that](/posts/reef-pi-public-engineering-lessons/) about the project as a whole. Both posts treated documentation as one ingredient among several: modules, drivers, community, docs. I want to correct that framing. For a project like reef-pi, documentation is not an ingredient. It is a surface of the product, on the same footing as the code that runs on the Pi.

I know this less from studying the project than from filing issues against it.

## The issue queue is a documentation backlog

Over the years I have opened a string of issues against reef-pi's documentation site, not its controller code: [document standalone, no-network installation](https://github.com/reef-pi/reef-pi.github.io/issues/31), [update the pH module doc for transformer function syntax](https://github.com/reef-pi/reef-pi.github.io/issues/30), [update installation instructions to cover auto-start on reboot](https://github.com/reef-pi/reef-pi.github.io/issues/29), [enlist essential safety checks](https://github.com/reef-pi/reef-pi.github.io/issues/28), [document all metrics emitted by reef-pi](https://github.com/reef-pi/reef-pi.github.io/issues/11), [document how to import and export the database](https://github.com/reef-pi/reef-pi.github.io/issues/8), and several more in the same vein.

None of these are bug reports in the usual sense. The controller worked. The pH module read the probe, the doser ran on schedule, the metrics were being emitted. What was missing was the part a stranger needs in order to trust and operate the thing: what does "standalone" actually require, what does the transformer function's syntax accept, what happens on power loss, which checks keep the tank from becoming a very expensive failure.

Notice the labels those issues carry: `installation`, `reference`, `troubleshooting`, `operations`, `observability`. That is the same vocabulary reef-pi uses to triage its module code, applied to prose. Documentation gaps get typed and prioritized the way software defects do, because functionally they are the same category of problem. A missing explanation of the healthcheck-alerting behavior is not cosmetic. It is a gap in the product's contract with the person operating it.

## Two different jobs, both called "documentation"

reef-pi actually maintains two distinct kinds of documentation, and conflating them is where projects go wrong.

The [Adafruit Learn guide series](https://learn.adafruit.com/reef-pi-installation-and-configuration) is a narrative onboarding path: wire this, install that, verify the LED dims, move to the next guide. It exists to get a stranger from a box of parts to a running controller, one guide at a time, with a parts list and a photo at every step. This is documentation as a funnel.

The project's [additional documentation](https://reef-pi.github.io/additional-documentation/) section is a different animal: glossary, safety, remote access, telemetry, watchdog behavior, the [API](https://reef-pi.github.io/additional-documentation/open-api/), the [development environment](https://reef-pi.github.io/additional-documentation/development/). Nobody reads this front to back. It exists to be searched, months after setup, when something specific needs answering. This is documentation as reference.

A hardware project that only writes the onboarding guide will onboard people successfully into a system they cannot operate long-term. A project that only writes reference material will never get past the people who already understand it. reef-pi needs both, and the issue labels above show the project treating each as a real deliverable rather than folding everything into a README.

## Where the gap actually bites

The pattern behind most of my own issues is the same: a feature shipped, and the documentation that would let someone else use it correctly did not ship with it. The transformer function in the pH module is real and works; its syntax was not written down anywhere a user could find, so every user who needed it had to either read Go source or ask in a forum thread that will not exist in two years. Metrics were being emitted; nothing enumerated which ones, so operators built dashboards from trial and error rather than a reference.

I made the same point about the hardware abstraction layer: a boundary is not the interface it exposes, it is what the interface forbids a caller from doing accidentally. Documentation has the identical structure. An undocumented feature is not "half shipped." It is shipped only to the people who already have the context to guess correctly, which in practice means the maintainers and no one else. The feature exists; the product does not, yet, because the product is what a stranger can operate from public material alone.

## The support thread is the test suite

reef-pi keeps a public GitHub issue tracker and a large [Reef2Reef](https://www.reef2reef.com/) community thread running in parallel with its docs. It is tempting to read the forum as a symptom of documentation failing. I think it is closer to the opposite: a healthy support channel is documentation's continuous integration. Every question that gets asked twice is a signal that a guide needs to exist, or an existing guide needs a section it does not have. The issues I listed above did not come from an audit. They came from being a user, hitting a wall, and turning the wall into a labeled, triaged, public artifact instead of a private workaround.

That is the discipline worth generalizing past aquarium controllers. Treat a "how do I..." question, asked in public, as a documentation bug with the same standing as a stack trace. File it, label it, and let it join the backlog next to the code. The alternative is a project that works, exactly once, for whoever wrote it.

## Public sources

- [reef-pi documentation issues filed by the author](https://github.com/reef-pi/reef-pi.github.io/issues?q=is%3Aissue+author%3Aranjib)
- [reef-pi Adafruit Learn guide series](https://learn.adafruit.com/reef-pi-installation-and-configuration)
- [reef-pi additional documentation](https://reef-pi.github.io/additional-documentation/)
- [reef-pi additional documentation: API](https://reef-pi.github.io/additional-documentation/open-api/)
- [reef-pi additional documentation: development environment](https://reef-pi.github.io/additional-documentation/development/)
- [reef-pi troubleshooting guide](https://reef-pi.github.io/guides/troubleshooting/)
- [Reef2Reef reef-pi community](https://www.reef2reef.com/)
