---
title: "What Incident Taxonomies Are Really For"
date: 2026-07-18T00:00:00-07:00
draft: false
---

Reliability engineering often starts with tooling, but the durable work starts earlier: naming what actually fails.

That sounds smaller than it is. Names are the unit that lets an organization learn from production. Without them, incidents remain stories: this deploy, that overload, this dependency outage, that missing alert. The stories may be accurate, but they are hard to compare. They depend on who was in the room, who wrote the postmortem, and which details were memorable under stress.

An incident taxonomy is a way to turn those stories into engineering signal.

My public talks on resiliency and incident management span from DevopsDays India in 2013 to Uber-focused talks in 2020. The shape changed over time. The early framing was culture, tools, and practices. The later framing was incident taxonomy, data, and large-scale operational learning. The through-line is the same: resilient systems are built deliberately, and deliberate systems need a shared vocabulary.

## Taxonomy turns incidents into engineering signal

A taxonomy is useful because it turns a pile of incidents into a system of patterns. Without names, every incident feels unique. With names, repeated causes become visible: capacity, dependency failure, deploy risk, operational gaps, incomplete automation, unclear ownership, weak detection, or missing failover behavior.

That does not make incidents simple. It makes them discussable.

The important move is from "what happened?" to "what kind of thing happened?" The first question is necessary during response and postmortem. The second question is what lets the organization improve across teams. If ten services each had a different incident caused by missing capacity headroom, the taxonomy should make that visible. If five incidents came from manual operational steps during mitigation, the taxonomy should point at automation and runbook quality, not five unrelated local fixes.

That is what incident categories are really for. They are not labels for a report. They are handles for investment.

## The category should change what you do next

The test of a taxonomy is whether it changes prioritization.

If an incident is classified as a deploy problem, the useful follow-up may be safer rollout defaults, canary analysis, faster rollback paths, or better dependency checks. If it is a capacity problem, the follow-up may be forecasting, load shedding, quota policy, or headroom review. If it is a dependency problem, the work may be timeout discipline, graceful degradation, ownership clarity, or regional isolation. If it is a detection problem, the fix may sit in instrumentation and alert quality rather than the code path that failed.

Those are different engineering programs. Putting all of them under "reliability" is too broad to guide action. A good taxonomy gives leaders and teams a way to ask which class of risk is repeating, where the leverage is, and whether the backlog reflects the actual failure history.

This matters because incident follow-up competes with feature work, migration work, hiring gaps, platform debt, and everything else a team carries. The best postmortem action item is not always the one closest to the stack trace. Sometimes the right action is one level down in the platform. Sometimes it is one level up in ownership or review. The taxonomy helps make that argument with evidence instead of volume.

## Incident management is a system, not a meeting

The public material around incident management at Uber emphasizes process at scale: detection, alerting, severity, role clarity, communication, mitigation, postmortems, and follow-up. The important point is that incident management is itself a production system.

That system needs operators, feedback loops, and maintenance. It needs clean handoffs between people diagnosing the issue and people coordinating the response. It needs postmortems that produce engineering work, not just documents.

A taxonomy belongs inside that system. It should be present when an incident is reviewed, but it should also feed aggregate views later. Which services repeat the same failure mode? Which mitigations keep depending on the same manual step? Which alerts detect customer impact late? Which categories are shrinking because the organization invested in a platform fix?

Those questions are hard to answer from free-form prose alone. Prose is still necessary because incidents are contextual and human. But structured classification gives the prose memory. It lets a reliability program ask whether the system is learning, rather than whether this week's postmortems were well written.

## Culture and data need each other

The 2013 resiliency framing emphasized culture, tools, and practice. The 2020 taxonomy framing emphasized data. Those are not competing ideas.

A blameless culture without data can become vague. Data without a healthy culture becomes a ranking system for blame. Reliability work needs both: a culture that can look honestly at failure, and data that helps teams see where repeated investment will matter.

This is where taxonomies can go wrong. If categories become a compliance exercise, people will optimize for clean labels instead of honest learning. If categories are used to rank teams without context, teams will under-report or misclassify. If the taxonomy is too detailed, nobody will use it consistently. If it is too vague, it will not separate meaningful failure classes.

The goal is not perfect classification. The goal is a vocabulary that is good enough to reveal repeated risk while still being light enough for responders and reviewers to use accurately.

## The practical shape

The taxonomies I trust tend to be boring in the right way.

They have a small number of top-level categories. They distinguish technical cause from organizational follow-up. They allow an incident to have more than one contributing factor without turning every postmortem into a tagging contest. They are reviewed periodically, because the failure modes of a system change as the architecture and organization change.

They also keep a sharp distinction between severity and category. Severity asks how bad the impact was. Category asks what kind of failure produced or amplified that impact. A low-severity incident can reveal a category that will become expensive later. A high-severity incident can still belong to a known class where the right investment is already underway.

That distinction is important. Reliability programs get distorted when they only learn from the loudest events. Taxonomy lets smaller incidents contribute signal before the expensive version arrives.

## Why this still matters

Modern software systems are too large for heroics to be the operating model. Services have dependencies, regions, queues, caches, deployments, experiments, and traffic patterns. Incidents will happen. The question is whether each one teaches the system something durable.

Naming failure is the first step. It lets teams turn incidents from isolated emergencies into a long-running reliability program.

The point is not to reduce messy production reality to a spreadsheet. The point is to make repeated reality visible enough to act on. When the same failure class appears across teams, the organization can decide to build a safer deploy system, improve capacity planning, change defaults, automate mitigation, or clarify ownership.

That is what incident taxonomies are really for: not explaining the past more neatly, but making the next investment harder to ignore.

## Public sources

- [Culturing resiliency with Data: A taxonomy of incidents](https://www.infoq.com/presentations/uber-outages/)
- How Uber does incident management, Major Incident Management Expo 2020
- [Using ML for Microservice Capacity Safety](https://www.uber.com/en-US/blog/capacity-recommendation-engine/)
- [Uber's Failover Architecture: Reconciling Reliability and Efficiency in Hyperscale Microservice Infrastructure](https://www.usenix.org/conference/nsdi26/presentation/bansal)
- [Attaining Resiliency: Culture, Tools and Practices](https://speakerdeck.com/ranjibd/attaining-resiliency-culture-tools-and-practices)
