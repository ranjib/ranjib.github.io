---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
description: ""
summary: ""
lane: "engineering-ai"
images:
  - "images/social/default-card.png"
image_alt: "Ranjib Dey social preview"
tags: []
categories: []
---

<!--
Metadata contract:
- description: concise, unique search/social snippet. Keep it under 160 characters.
- summary: optional on-site card text. It can be longer than description.
- lane: required primary lane. Use one of engineering-ai, open-source-making, field-notes, or learning-life.
- images: first item is used for Open Graph/Twitter cards. Prefer a 1200x630 PNG/JPEG under static/images/social/.
- image_alt: short alt text for the social image.
- tags/categories: optional taxonomy fields for future discovery work.
-->
