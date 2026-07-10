---
title: "reef-pi as a Small Open Source Platform"
date: 2026-07-10T00:00:00-07:00
draft: false
---

I have [written before](/posts/reef-pi-public-engineering-lessons/) about reef-pi as a public engineering artifact: modules, documentation, community, hardware. That post surveyed the shape of the project. This one is about a single line inside it.

The difference between a project and a platform is not size, and it is not popularity. It is whether there is a boundary somewhere in the system that the maintainers agree not to cross, and whether that agreement survives contact with real hardware.

reef-pi has one such boundary. It is worth looking at closely, because of how it arrived and where it paid off.

## The boundary showed up as a bug report

Hardware abstraction in reef-pi did not begin as an architecture diagram. It began as two issues that were, on their surface, unremarkable.

Issue #656 was titled "Doser module uses pins directly." Nothing was broken; the pumps ran on schedule and delivered the right volumes. The complaint was structural: the doser referenced hardware pin numbers itself, rather than going through an outlet abstraction. A module that knows about pins must be edited every time the hardware underneath it changes.

Issue #698 was titled "Add new connector type for adc (ph board)." The reef-pi pH board reads a probe through an I2C analog-to-digital converter, and the controller had no vocabulary for that. There were digital outputs and digital inputs, and an analog reading from an ADC was neither. Supporting the board meant the abstraction had to grow a shape it did not yet have.

Neither issue is a grand design statement. Both are pressure. The first says an existing boundary is leaking; the second says it is too narrow to hold the hardware people actually want to attach. Together they produced the Hardware Abstraction Layer that landed in reef-pi 3.0 in November 2019.

That ordering matters. The boundary was discovered under load, not specified in advance. Most of the good ones are.

## What the line actually separates

After 3.0, the separation is three-way and lives in three places.

The `hal` repository holds Go interfaces and almost nothing else: digital input and output drivers, analog input, PWM. It ships a no-op driver so that module logic can be tested without touching a pin. If you go looking for the clever code, you will not find it. The package is close to empty, and that is the design. Its value is not in what it does, but in what it forbids other packages from doing.

The `drivers` repository holds the implementations: Kasa smart outlets, Digital Loggers web power switches, Tasmota outlets, the ADS1x15 analog-to-digital converter, the PCA9685 PWM board, the Atlas Scientific EZO pH circuit, the reef-pi pH board, the Blue Acro Pico baseboard. Each depends on very little — most on nothing beyond the Raspberry Pi GPIO library.

The controller modules — ATO, doser, lighting, temperature, pH — consume the interfaces and never call a hardware library directly. That is the rule that falls out of the whole arrangement, and it is short enough to hold in your head: **adding hardware means adding a driver, never editing a module.**

The abstraction did not stay internal. It surfaced in the web UI as *connectors*: the user binds a driver to a module themselves, in a browser, without touching code. An internal engineering boundary became a concept a reef keeper must understand to configure their tank. That is a fair trade. The alternative is a controller that only supports hardware its maintainer happens to own.

## The payoff arrived somewhere else

The HAL was justified by maintenance: hardware diversity was becoming unmanageable, modules were reaching through the abstraction, testing required real pins. Ordinary reasons, and reason enough.

Three years later, reef-pi 6.0 shipped an ESP32 driver.

The ESP32 firmware exposes a small HTTP API. Outlets toggle at `/outlets/<id>/on`. PWM channels — jacks, in reef-pi's vocabulary — take a value from 0 to 255 at `/jacks/<id>/<value>`. There are inlets for digital reads and analog inputs for probes. On the controller side, a driver speaks that API and implements the same HAL interfaces as everything else.

Consider what that means above the line. The doser module cannot tell whether the pump it drives hangs off a GPIO pin twelve inches away, or off a microcontroller across the house, reached over the local network. Nothing above the HAL had to learn about HTTP, latency, or network failure as a category distinct from hardware failure.

Nobody designed the HAL for this. The interface was drawn to hide differences between *devices*. It turned out to hide *distance* too.

The second-order effect is larger. Because hardware I/O could be delegated to an ESP32, reef-pi no longer needed to run on a Raspberry Pi at all. It became a Debian program. Issue #1471, from 2021, is a user trying to build reef-pi on a Jetson Nano and running aground on arm64 dependencies — the demand for non-Pi hosts predates the capability by more than a year. Version 6.0 did not answer that request with a patch. The architecture had already made the answer available; someone had to write one more driver.

This is the test I now apply to any boundary worth the name. Not whether it is elegant. Whether it keeps paying for reasons you did not anticipate.

## Where the boundary still leaks

An honest platform has seams, and reef-pi's are documented rather than hidden.

A ds18b20 temperature sensor wired to an ESP32 is modeled as an analog input and read through the pH module — not through the temperature module, where it obviously belongs. The firmware's own README says so, and notes that a future version should unify the two modules. The physical wiring of a sensor is dictating which logical module owns it. The abstraction bent.

Setting up the ESP32 driver requires declaring counts for all four resource types even if you use only one, because the firmware wants its topology fixed at configuration time. That is issue #2082 — the friction that shows up when a remote device must be described before it can be discovered. And the `drivers` API is explicitly marked unstable, in writing, by the maintainers.

None of that reads as failure to me. A boundary that never leaks usually means not enough hardware has hit it yet.

## What the small ones teach

reef-pi is a hobbyist aquarium controller with a small maintainer base and no revenue. It is easy to assume the engineering discipline required is correspondingly smaller. I think the opposite is closer to true.

A platform team inside a company can migrate its callers: grep the monorepo, send a deprecation notice, delete the old path next quarter. reef-pi cannot. Its callers are strangers with living rooms full of saltwater, running versions the maintainers have never seen, on hardware bought years ago. There is no migration to run. The interface has to be right earlier and change more slowly, with less information and fewer people, and the cost of getting it wrong is a dead tank rather than a rolled-back deploy.

That constraint produces a clarifying lesson. The boundary is not the code you write. It is the code you refuse to let a module write. The `hal` package's contribution to reef-pi is not the interfaces it defines — those are a few dozen lines. It is the hardware library imports that never appeared in the doser, the ATO, the lighting controller, in every major version since.

That is what a small open source platform is. Not a large system. A well-defended line.

## Public sources

- [reef-pi official site](https://reef-pi.github.io/)
- [reef-pi controller repository](https://github.com/reef-pi/reef-pi)
- [reef-pi release history](https://github.com/reef-pi/reef-pi/releases)
- [reef-pi `hal` repository](https://github.com/reef-pi/hal)
- [reef-pi `drivers` repository](https://github.com/reef-pi/drivers)
- [reef-pi `esp32` firmware repository](https://github.com/reef-pi/esp32)
- [reef-pi `pH-Board` hardware repository](https://github.com/reef-pi/pH-Board)
