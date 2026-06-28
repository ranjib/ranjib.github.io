# Blog Pipeline

Weekly publishing plan for `ranjib.github.io`, derived from the personal website content and the local knowledge graph at `/Users/ranjib/workspace/llm-wiki-ranjib`.

Assumptions:

- Cadence: one post per week.
- Start date: Sunday, July 5, 2026.
- Preferred shape: personal technical essays grounded in lived projects, public artifacts, and safe hobby notes.
- Privacy rule: do not publish sensitive personal, family, finance, school, flight-training operational, or exact home-location details. Convert private notes into general lessons before drafting.

## Editorial Lanes

| Lane | Why it fits | Source areas |
| --- | --- | --- |
| Systems and reliability | Strongest public professional thread; already represented on the site | `Career Tech Themes`, `SRE`, `Platform Engineering`, public talks/blogs |
| GenAI practice | Current active learning arc; useful to practitioners building with agents | `GenAI Learning`, `Agentic AI`, `Evaluation-Driven Context Engineering`, `Coding Agent Lab` |
| Open source and physical computing | Distinctive personal/professional bridge through reef-pi | `reef-pi`, `reef-pi-*`, `3D Printing and Electronics` |
| Hobbies as systems | Makes the site more personal while preserving an engineering voice | `Overlanding`, `Gardening`, `Reef Keeping`, public-safe travel retrospectives |
| Career retrospectives | Durable essays from public talks and employer eras | `Professional Timeline`, `Career Tech Themes`, talk pages |

## 16-Week Calendar

| Week | Publish date | Working title | Lane | Source notes | Draft posture |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-07-05 | Treating Context Like Code | GenAI practice | `GenAI Learning`, `Evaluation-Driven Context Engineering` | Explain why prompts, context packs, skills, and agent instructions deserve versioning, review, and evals. |
| 2 | 2026-07-12 | The Through-Line From Chef to Agentic AI | Systems and GenAI | `Career Tech Themes`, `GenAI Learning` | Connect infrastructure-as-code discipline to context-as-code discipline. |
| 3 | 2026-07-19 | reef-pi as a Small Open Source Platform | Open source and physical computing | `reef-pi`, `reef-pi-software-essence`, `reef-pi-hardware-ecosystem` | Follow-up to the existing reef-pi post, focused on platform boundaries and hardware abstraction. |
| 4 | 2026-07-26 | What Incident Taxonomies Are Really For | Systems and reliability | `Career Tech Themes`, existing reliability post | Expand the taxonomy idea into a practical essay on learning from repeated failure classes. |
| 5 | 2026-08-02 | My Personal LLM Wiki Operating Model | GenAI practice | `GenAI Learning`, `Wiki Operating Model`, `Context Pack Registry` | Describe raw notes to curated context packs to agent-readable memory. |
| 6 | 2026-08-09 | Planning Overlanding Trips Like Reliability Reviews | Hobbies as systems | `Overlanding`, `Overlanding Safety Checklist`, `Trip Retrospectives` | Public-safe framing: route risk, constraints, verification, and go/no-go decisions. |
| 7 | 2026-08-16 | Testing Infrastructure Was the Original Context Engineering | Systems and GenAI | `Career Tech Themes`, Agile 2015/TDD ops pages | Compare TDD in operations with evaluation-driven context engineering. |
| 8 | 2026-08-23 | Gardening With an Operations Mindset | Hobbies as systems | `Gardening`, `Garden Seasonal Calendar`, `Garden Irrigation Zones` | Generalize zone-based planning, recurring tasks, source hierarchy, and feedback loops. |
| 9 | 2026-08-30 | Why Documentation Is Part of the Product | Open source and physical computing | `reef-pi-publications`, Adafruit guide references, existing reef-pi post | Use reef-pi guides and community support as the example. |
| 10 | 2026-09-06 | Model Routing Is an Engineering Decision | GenAI practice | `Model Routing Matrix`, `Coding Agent Lab`, `Local LLM Workstation` | Discuss quality/cost/speed/privacy tradeoffs without making time-sensitive model claims. |
| 11 | 2026-09-13 | From Service Discovery to Safer Defaults | Systems and reliability | `Career Tech Themes`, Consul at PagerDuty, Platform Engineering | A career-retrospective essay on platforms making safe paths easier. |
| 12 | 2026-09-20 | Building Hobby Systems That Survive Real Life | Hobbies as systems | `reef-pi`, `Gardening`, `Overlanding`, `3D Printing and Electronics` | Cross-hobby essay: maintenance, observability, constraints, and repairability. |
| 13 | 2026-09-27 | The Weekly GenAI Review | GenAI practice | `GenAI Weekly Reviews`, `GenAI Skill Matrix` | Turn the review schema into a public template and personal learning method. |
| 14 | 2026-10-04 | Capacity Planning as Product Thinking | Systems and reliability | Uber public blog pages, `Career Tech Themes` | Public-source essay on ML-assisted capacity safety and operational decision loops. |
| 15 | 2026-10-11 | A Public Knowledge Graph for a Personal Website | GenAI practice | `Public Site Plan`, `Public Professional Footprint`, `scripts/check_public_leaks.py` | Explain how the website can be fed from a curated knowledge graph with privacy checks. |
| 16 | 2026-10-18 | The Same Engineering Taste Across Work and Hobbies | Career retrospective | `Professional Timeline`, `reef-pi`, `Overlanding`, `Gardening` | Meta essay tying together reliability, automation, physical systems, and learning. |

## Backlog

| Title | Lane | Notes |
| --- | --- | --- |
| What I Learned Maintaining Chef Before Platform Engineering Had a Name | Career retrospective | Use only public Chef talks, award, and `chef-lxc` history. |
| Containers Before Containers Were Boring | Career retrospective | LXC, chef-lxc, CI/CD for ops; good historical essay. |
| The Difference Between Automation and Autonomy | Systems and GenAI | Bridge ML capacity work and agentic workflows. |
| A Reef Tank Is a Distributed System With Water | Open source and physical computing | Good personal voice; avoid overclaiming. |
| The Case for Small, Durable Open Source Projects | Open source and physical computing | reef-pi community, hardware ecosystem, documentation. |
| Source Hierarchies for Personal AI Systems | GenAI practice | UCANR/CIMIS-style source hierarchy generalized to AI memory. |
| What My Garden Taught Me About Feedback Loops | Hobbies as systems | Seasonal observations, plant records, irrigation. |
| Trip Retrospectives for Overlanding | Hobbies as systems | Public-safe format: route, constraints, surprises, next changes. |
| A Personal Website as a Long-Term Memory Interface | GenAI practice | Site as public projection of private knowledge graph. |
| How to Write Publicly From Private Notes | GenAI practice | Sanitization, source maps, privacy gates, public-safe summaries. |

## Weekly Workflow

1. Monday: choose the next topic and copy source page names into the draft issue or note.
2. Tuesday: outline the post with thesis, three sections, and public-source boundary.
3. Wednesday: draft 800-1,200 words.
4. Thursday: edit for privacy, specificity, and duplicated ideas.
5. Friday: add links and public sources.
6. Saturday: run the knowledge-graph public leak checks if content was exported from the wiki.
7. Sunday: publish.

## Draft Checklist

- The post has one clear thesis.
- The article can stand alone without private context.
- Any private source page is paraphrased into a general lesson.
- No family logistics, finance details, exact home operations, active flight-training details, or sensitive personal records are included.
- Public claims link to public artifacts when available.
- The title fits the existing site tone: direct, reflective, and engineering-oriented.
