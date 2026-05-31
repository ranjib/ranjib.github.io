---
title: "Reliability Work Starts With Naming Failure"
date: 2026-05-31T00:00:00-07:00
draft: false
---

Reliability engineering often starts with tooling, but the durable work starts earlier: naming what actually fails.

My public talks on resiliency and incident management span from DevopsDays India in 2013 to Uber-focused talks in 2020. The shape changed over time. The early framing was culture, tools, and practices. The later framing was incident taxonomy, data, and large-scale operational learning. The through-line is the same: resilient systems are built deliberately, not wished into existence.

## Taxonomy turns incidents into engineering signal

A taxonomy is useful because it turns a pile of stories into a system of patterns. Without names, every incident feels unique. With names, repeated causes become visible: capacity, dependency failure, deploy risk, operational gaps, incomplete automation, unclear ownership, or missing detection.

That does not make incidents simple. It makes them discussable. It gives engineering teams a way to ask whether they are fixing a one-off issue or paying down a class of risk.

## Incident management is a system, not a meeting

The public material around incident management at Uber emphasizes process at scale: detection, alerting, severity, role clarity, communication, mitigation, postmortems, and follow-up. The important point is that incident management is itself a production system.

That system needs operators, feedback loops, and maintenance. It needs clean handoffs between people diagnosing the issue and people coordinating the response. It needs postmortems that produce engineering work, not just documents.

## Culture and data need each other

The 2013 resiliency framing emphasized culture, tools, and practice. The 2020 taxonomy framing emphasized data. Those are not competing ideas.

A blameless culture without data can become vague. Data without a healthy culture becomes a ranking system for blame. Reliability work needs both: a culture that can look honestly at failure, and data that helps teams see where repeated investment will matter.

## Why this matters now

Modern software systems are too large for heroics to be the operating model. Services have dependencies, regions, queues, caches, deployments, experiments, and traffic patterns. Incidents will happen. The question is whether each one teaches the system something durable.

Naming failure is the first step. It lets teams turn incidents from isolated emergencies into a long-running reliability program.

## Public sources

- [Culturing resiliency with Data: A taxonomy of incidents](https://www.infoq.com/presentations/uber-outages/)
- How Uber does incident management, Major Incident Management Expo 2020
- [Using ML for Microservice Capacity Safety](https://www.uber.com/en-US/blog/capacity-recommendation-engine/)
- [Uber's Failover Architecture: Reconciling Reliability and Efficiency in Hyperscale Microservice Infrastructure](https://www.usenix.org/conference/nsdi26/presentation/bansal)
- [Attaining Resiliency: Culture, Tools and Practices](https://speakerdeck.com/ranjibd/attaining-resiliency-culture-tools-and-practices)
