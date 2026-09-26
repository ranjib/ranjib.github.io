---
title: "From Service Discovery to Safer Defaults"
date: 2026-09-13T00:00:00-07:00
draft: false
description: "What service discovery taught me about platform engineering: encode healthy, observable paths so the safer choice becomes the easier one."
summary: "A reflection on service discovery, operational judgment, and why good platforms turn repeated safety decisions into reliable defaults."
lane: "engineering-ai"
tags:
  - "service discovery"
  - "platform engineering"
  - "reliability"
  - "safe defaults"
---

When people describe service discovery, the explanation often starts with a directory: services register their locations, and clients look them up.

That description is accurate, but it misses the part that stayed with me. Service discovery is not only a way to find an address. It is a way to move repeated operational judgment out of every application and into a shared system.

I worked on Consul adoption at PagerDuty during a period when infrastructure was becoming more dynamic and service-oriented. The public talk I gave about that work focused on the practical architecture. Looking back, the more durable lesson was about platform engineering: a platform earns its place when it makes the safe path easier than the unsafe one.

Service discovery was one of the clearest places I learned that lesson.

## An address is not enough

In a small system, a service dependency can look like a hostname and port in a configuration file. That works until the world around it starts moving.

Instances are replaced. Deployments change capacity. A process may still be reachable while being unable to serve correct traffic. A node can be alive while one service on it is failing. If every application owns the logic for finding dependencies, interpreting health, retrying failures, and updating addresses, then every team is rebuilding a small and inconsistent control plane.

The operational question is not simply, "Where is this service?" It is, "Which instances should receive traffic right now, and what evidence supports that choice?"

Consul's model makes those concerns explicit. Services register in a catalog. Health checks update the state associated with service instances. DNS or API queries can return discoverable instances without requiring callers to carry a hand-maintained inventory. Current Consul documentation describes the catalog and its health information as the basis for directing traffic to healthy instances.

That combination matters. Registration without health can automate the distribution of stale information. Health without discovery can detect a problem without changing caller behavior. The useful abstraction joins identity, location, and readiness at the point where a client decides where to send work.

This is the first platform lesson: centralization is not valuable merely because configuration has moved. It is valuable when the shared layer can enforce a better decision than each caller would reliably make alone.

## Defaults carry operational policy

The word *default* can sound cosmetic, like a value chosen to save a few lines of configuration. In production systems, defaults are policy.

Consider a service instance whose health check has failed. A discovery path that continues returning it asks every caller to notice the failure and react correctly. A path that filters unhealthy instances encodes a safer behavior once, close to the source of truth.

The same reasoning applies to the checks themselves. A timeout, check interval, failure threshold, and deregistration policy are not incidental settings. They express how quickly the platform should react, how much instability it should tolerate, and when an unhealthy instance should stop being considered part of the system. There is no universally correct value, but there is a major difference between making those choices visible and leaving them hidden inside application folklore.

Good defaults do not eliminate judgment. They concentrate it where it can be reviewed, observed, and improved.

This also changes the failure mode. With static configuration, a wrong address can remain wrong until a person edits and redeploys it. With dynamic discovery, the control plane itself becomes critical infrastructure. Its availability, consistency, rollout process, and observability now matter to every participating service.

That is not a reason to avoid the platform. It is a reason to be honest about the responsibility being created. Shared safety mechanisms need stronger operational discipline precisely because so many teams depend on their defaults.

The safest path also needs to be the legible path. Teams should be able to answer which instances are registered, why one is considered unhealthy, what a query will return, and whether the discovery system is degraded. If the platform makes a decision but cannot explain its inputs, it has replaced distributed confusion with centralized confusion.

## The platform should remove repeated decisions

I now use a simple test when thinking about internal platforms: which decisions are users forced to make repeatedly, and which of those decisions can the platform make more safely from better information?

Service discovery removes the need for every application owner to maintain a list of dependency addresses. Health-aware discovery removes the need for every caller to invent its own interpretation of availability. Standard registration and query paths give operators one place to inspect the state that influences routing.

The same pattern appears elsewhere. A deployment platform can make progressive rollout and rollback the normal path. An identity platform can make short-lived credentials easier than copied secrets. A development platform can attach tests, ownership metadata, and observability to the standard service template. In each case, the platform is not merely offering another tool. It is turning a repeated reliability decision into a paved path.

There is a limit to this approach. A platform should not hide meaningful differences or claim certainty it does not have. Passing a shallow TCP check does not prove an application can complete its real work. Removing an instance from discovery does not make in-flight requests safe. A central catalog does not replace application-level timeouts, bounded retries, or graceful degradation.

Safe defaults are a starting position, not a guarantee.

That distinction is important because platform work can drift into accumulating features and abstractions. The goal is not to absorb every decision. It is to identify the decisions that are repeated, error-prone, and better informed by shared state, then make the reliable choice easy to adopt and easy to inspect.

My service discovery work changed how I think about that boundary. Before, I often saw infrastructure automation as a way to make operations faster and more consistent. Service discovery made the deeper purpose clearer: automation should shape the choices available to the next engineer and improve the system's behavior when nobody is manually steering it.

The best platform default is not the one that saves the most configuration. It is the one that quietly prevents a familiar failure, exposes enough evidence to earn trust, and still leaves room for an explicit exception when reality requires one.

That is the through-line from service discovery to platform engineering: make the safe path visible, make it ordinary, and make it easier to follow than to bypass.

## Public sources

- [Consul at PagerDuty](https://speakerdeck.com/ranjibd/consul-at-pagerduty)
- [Consul: Discover services overview](https://developer.hashicorp.com/consul/docs/discover)
- [Consul: Health check configuration reference](https://developer.hashicorp.com/consul/docs/reference/service/health-check)
- [Platform Engineering Through Automation](/posts/platform-engineering-through-automation/)
