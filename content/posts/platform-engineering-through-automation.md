---
title: "Platform Engineering Through Automation"
date: 2026-05-31T00:00:00-07:00
draft: false
---

Looking back across my public talks and writing, the same idea keeps returning in different forms: operational work should become software.

In the early 2010s, that meant Chef, infrastructure as code, and testing cookbooks. At PagerDuty, it meant CI/CD for infrastructure, TDD in operations, and service discovery with Consul. At Uber scale, it meant production engineering, capacity management, incident taxonomy, and ML-assisted operational decisions.

The tools changed. The direction did not.

## Infrastructure as code was the starting point

Chef was the first clear public thread. Talks from FudCon, vodQA, Chef Meetup, ChefConf, and LinuxCon show a progression from configuration management to automated testing and containerized integration workflows.

The argument was simple: infrastructure changes are software changes. They deserve version control, review, tests, feedback loops, and release discipline.

## Testing made operations safer

The testing thread became most explicit in the Agile 2015 talk and experience report on adopting TDD in operations. The work used tools like ChefSpec, Test Kitchen, Serverspec/InSpec, Foodcritic, RSpec, and Jenkins to bring software testing discipline into infrastructure code.

That mattered because untested infrastructure changes are a common source of operational failure. Fast tests make infrastructure safer to change. Slow or absent tests make every change depend on memory and luck.

## Containers made feedback loops faster

The chef-lxc work and LXC talks were about using containers before they became the default deployment vocabulary. The practical goal was fast, repeatable environments for building and testing infrastructure changes.

That was platform engineering before the term became common: create a path where teams can make changes with less local setup, faster feedback, and more confidence.

## Service discovery expanded the boundary

The Consul work at PagerDuty moved the focus from machine configuration to distributed systems coordination. Service discovery, health checking, and distributed configuration sit below the application but above individual hosts. That is a platform layer.

Once systems become service-oriented, the platform has to encode more than deployment. It has to help services find each other, fail safely, and expose enough health signal for operators to act.

## ML-assisted operations is another automation step

At Uber scale, manual capacity planning cannot keep up with hundreds of microservices and variable traffic. Public Uber Engineering Blog work on ML-driven capacity safety and capacity recommendation shows the next step in the same automation arc: use data and prediction to support operational decisions before users see impact.

That is not automation for its own sake. It is automation aimed at better reliability and more efficient infrastructure.

## The pattern

The public career arc is not a set of disconnected tools. It is a series of attempts to make operational systems more explicit, testable, repeatable, and data-driven.

That is the heart of platform engineering for me: make the safe path easier, make the system legible, and turn repeated operational judgment into durable software.

## Public sources

- [System Automation Using Chef](https://ranjib.github.io/about/personal/)
- [Automated Infrastructure Testing](https://www.slideshare.net/ThoughtWorks/automated-infrastructure-testing-ranjib-dey)
- [Chef-LXC: Building and Deploying Custom Containers](https://speakerdeck.com/ranjibd/chef-lxc-building-and-deploying-custom-containers)
- [How to Mock a Mocking Bird](https://speakerdeck.com/ranjibd/how-to-mock-a-mocking-bird-testing-dynamic-infrastructure)
- [Strategies for adopting TDD in Operations](https://speakerdeck.com/ranjibd/adopting-test-driven-development-in-operations)
- [Agile Alliance experience report](https://www.agilealliance.org/wp-content/uploads/2015/12/ExperienceReport.2015.Dey_.Strategies_for_adopting_Test_Driven_Development_in_Operations_.pdf)
- [Consul at PagerDuty](https://speakerdeck.com/ranjibd/consul-at-pagerduty)
- [Using ML for Microservice Capacity Safety](https://www.uber.com/en-US/blog/capacity-recommendation-engine/)
