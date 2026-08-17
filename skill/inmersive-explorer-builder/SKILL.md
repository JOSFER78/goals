---
name: immersive-explorer-builder
description: Design, research, architect, build, verify, and evolve interactive multiscale learning explorers for domains such as space, Earth, history, anatomy, cells, machines, and custom scientific or educational subjects. It converts a human intention into a data-grounded, visually rich, navigable experience instead of rushing into code.
version: 1.0.0
author: GOALS / User
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [interactive, 3d, visualization, education, research, multiscale, web, threejs, webgpu]
    category: development
---

# Immersive Explorer Builder Skill

Build reusable interactive explorers for learning and knowledge discovery. This skill is deliberately domain-agnostic: it can plan and construct a space explorer, historical map, human-body explorer, nervous-system model, cell explorer, machine/engine teardown, architectural walkthrough, or a custom interactive subject.

The skill does **not** assume that every project needs 3D, Three.js, WebGPU, an API, or a particular framework. It first discovers the domain, evidence, scale, interaction model, technical constraints, and educational goal, then selects the smallest architecture that can still support the required future scale.

## When to Use

Use when the user asks to create or substantially redesign an interactive explorer, simulation, map, scientific visualization, educational world, multiscale viewer, 3D knowledge environment, historical reconstruction, anatomical explorer, machinery viewer, or similar experience.

Typical prompts:
- "Build a solar-system explorer that feels like flying a spacecraft."
- "Make a Roman Empire map students can explore by date."
- "Create a human nervous-system explorer from body to synapse."
- "Make a cell where I can zoom from the cell to organelles."
- "Build a car engine that can be inspected and exploded apart."

## Prerequisites

Before implementation, confirm:
1. The workspace/project exists and is inspectable.
2. Relevant local files, package manifests, and existing architecture have been reviewed.
3. Needed web, browser, terminal, vision, code, Git, and MCP capabilities are available; if a needed capability is missing, identify it before building.
4. Domain-specific sources and asset/licensing requirements have been identified.
5. The build target is defined: browser, desktop webview, mobile web, or another target.

Do not assume an external API or MCP is available. Discover and verify it.

## How to Run

Preferred entry:

`/immersive-explorer-builder <natural-language project brief>`

Natural language is also supported. The first response for a new project should be a discovery/architecture plan unless the user explicitly asks for immediate implementation and the task is low-risk.

## Quick Reference

The lifecycle is:

`DISCOVER → RESEARCH → FEASIBILITY → EXPERIENCE MODEL → DATA MODEL → ARCHITECTURE → TRACER BULLET → BUILD → VERIFY → POLISH → HANDOFF → LEARN`

Non-negotiable behavior:
- Do not code before auditing an existing project.
- Do not invent factual data when primary/reputable sources are available.
- Do not confuse visual realism with scientific accuracy.
- Do not hard-code every object into one HTML file when the project is intended to grow.
- Do not load every heavy asset at startup when progressive loading is possible.
- Do not declare success because a button or panel exists; verify the behavior end-to-end.

## Procedure

### Phase 0 — Parse the user's intention

Extract or ask for:
- subject/domain;
- intended learner/user;
- learning or operational objective;
- desired visual style and realism;
- exploration metaphor (ship, microscope, body scan, map, exploded machine, etc.);
- expected scale changes;
- interaction expectations;
- time/history requirements;
- target platform;
- known constraints.

If critical ambiguity remains, ask the smallest set of questions needed. Otherwise infer conservatively and record assumptions.

Completion criterion: an `experience-brief` exists with explicit assumptions and open questions.

Load `references/experience-brief.md`.

### Phase 1 — Audit the existing project

If code already exists:
1. inspect directory structure;
2. inspect package/config files;
3. identify rendering engine/framework;
4. identify camera/navigation architecture;
5. identify data sources and hard-coded data;
6. identify asset pipeline;
7. identify build/deploy path;
8. identify current performance bottlenecks;
9. identify reusable pieces;
10. identify architectural blockers.

Do not rewrite the project from scratch merely because the current visual result is weak.

Completion criterion: every relevant existing subsystem is classified as `keep`, `refactor`, `replace`, or `unknown`.

### Phase 2 — Research the domain and the tool landscape

Use available research/browser tools. Prefer primary sources, authoritative datasets, academic institutions, museums, public archives, standards bodies, and official asset repositories.

For the technical stack, investigate only what affects the actual project. Compare options instead of blindly choosing the newest library.

Research questions:
- What must be factually correct?
- What data changes over time?
- What coordinate system/space model is needed?
- What assets exist?
- What licenses apply?
- What level of detail is required at each zoom level?
- What existing engines/tools already solve part of this problem?
- What can be integrated instead of reinvented?

Use `references/evidence-and-provenance.md` and the relevant domain pack under `domains/`.

Completion criterion: a source/evidence matrix and a technology decision record exist for the material decisions.

### Phase 3 — Feasibility and scope control

Identify hard constraints before implementation:
- browser/GPU limits;
- data/API availability;
- asset resolution and licensing;
- precision/coordinate limitations;
- expected object count;
- mobile/desktop constraints;
- network dependence;
- offline requirements;
- accessibility requirements.

Explicitly separate:
- physically/scientifically true;
- historically reconstructed;
- pedagogically transformed;
- purely visual/fictional.

Any non-real scale or transformation must be documented in the UI and/or metadata when relevant.

Completion criterion: a feasible scope and a list of deferred items exists.

### Phase 4 — Design the Explorer Model

Define:
- scene/world graph;
- objects/entities;
- relationships;
- measurements;
- layers;
- annotations;
- landmarks;
- timelines;
- missions/lessons;
- interaction states;
- representations (external, cutaway, exploded, x-ray, timeline, map, etc.).

The reusable interaction vocabulary is:
`SELECT, FOCUS, FOLLOW, ORBIT, APPROACH, INSPECT, MEASURE, COMPARE, ISOLATE, HIDE, SHOW, CUTAWAY, EXPLODE, ANIMATE, ANNOTATE`.

Completion criterion: the core entities and interaction verbs are defined independently of UI components.

Load `references/explorer-model.md`.

### Phase 5 — Design scale and navigation

If the project spans orders of magnitude, define a multiscale architecture before building visuals.

Possible techniques:
- hierarchical coordinate spaces;
- local reference frames;
- floating origin/origin rebasing;
- relative coordinates;
- double precision where appropriate;
- logarithmic depth where appropriate;
- LOD;
- asset streaming;
- texture streaming;
- frustum/occlusion culling;
- camera-aware level selection.

Never assume one raw world coordinate system is adequate for astronomical, anatomical, microscopic, or city-to-building scales.

Completion criterion: a scale ladder and camera/reference-frame strategy are documented.

Load `references/scale-engine.md`.

### Phase 6 — Choose architecture

Prefer a reusable engine plus domain data/configuration over one-off pages.

Typical web architecture when appropriate:
- TypeScript application;
- rendering layer (Three.js/WebGL/WebGPU or another justified choice);
- simulation/time layer;
- spatial/coordinate layer;
- data/provenance layer;
- asset layer;
- experience/education layer;
- UI layer;
- backend/API layer only when required.

Do not force React, Three.js, WebGPU, GIS, physics, or a backend into projects that do not need them.

For large projects, keep domain content data-driven so a second experience can reuse the same engine.

Completion criterion: architecture decision record names components, interfaces, ownership, and trade-offs.

Load `references/architecture-patterns.md`.

### Phase 7 — Build a tracer bullet

Before a large build, implement the smallest vertical slice that proves the hardest technical risk.

Examples:
- Space: System → Earth → Moon → spacecraft without precision/camera failure.
- World map: globe → region → city with historical date switching.
- Anatomy: body → organ → tissue → cell-layer visualization.
- Engine: exterior → exploded view → selected moving component.

A tracer bullet must test real data flow and real interaction, not a fake visual mockup.

Completion criterion: the riskiest technical assumption is empirically tested.

### Phase 8 — Build iteratively

Work in small, verifiable increments.

After each increment:
1. run the app/checks;
2. inspect the visual result when applicable;
3. verify the data path;
4. record what changed;
5. identify regressions;
6. only then continue.

Do not make giant batches of unrelated changes.

### Phase 9 — Verify

Verification must cover:
- functional interaction;
- visual hierarchy;
- factual/data correctness;
- scale/coordinate behavior;
- camera behavior;
- loading/error states;
- responsive behavior;
- performance;
- accessibility;
- provenance/licensing;
- deterministic reproduction where feasible.

If browser/vision tooling is available, use it for visual verification rather than assuming the code is correct.

Completion criterion: the acceptance criteria are checked and failures are documented.

Load `references/verification.md`.

### Phase 10 — Polish without hiding defects

Only after correctness:
- improve materials;
- lighting;
- transitions;
- UI density;
- typography;
- micro-interactions;
- education narrative;
- onboarding.

Do not use visual polish to mask incorrect data, bad navigation, fake scale, or broken architecture.

### Phase 11 — Handoff

Provide:
- what was built;
- what remains;
- key architectural decisions;
- sources and licenses;
- how to run;
- how to add a new domain/entity;
- known limitations;
- recommended next step.

### Phase 12 — Learn and improve

When the project reveals a reusable insight, update the skill's project-specific notes or propose an improvement to the skill. Do not silently overwrite general guidance with a one-off workaround.

## Parallel Research / Delegation

When delegation is available, split independent work streams:

1. `domain-researcher` — authoritative facts and datasets.
2. `asset-researcher` — 3D/textures/images/licensing.
3. `architecture-researcher` — viable technical stacks and integration options.
4. `experience-designer` — interactions and educational flow.
5. `implementation-agent` — focused implementation only after architecture approval.
6. `verification-agent` — visual, functional, data, and performance checks.

Do not delegate all work to identical agents. Give each a narrow deliverable and a hard completion criterion.

Use `references/delegation-playbook.md` when parallel work is justified.

## Domain Routing

Load only the relevant domain pack(s):
- Space → `domains/space/`
- Earth/map → `domains/geography/`
- Human body/nervous system → `domains/human-anatomy/`
- Cell → `domains/cell-biology/`
- Engine/machine → `domains/machinery/`
- Historical world → `domains/historical-world/`

For mixed projects, combine packs but keep each domain's evidence separate.

## MCP / Tool Routing

Use tools because they solve a verified need, not because they exist.

Typical capabilities:
- web/browser for research and live references;
- terminal for project inspection/build/test;
- vision for screenshots/assets/visual QA;
- Git/GitHub integration for repository work;
- database/search MCPs for structured project data;
- domain-specific MCPs only when they improve retrieval, transformation, or verification.

Before adding an MCP:
1. state the required operation;
2. check whether Hermes already has the capability;
3. discover whether an existing connected MCP can satisfy it;
4. only then propose/install a new server.

Never invent MCP names, endpoints, packages, or API capabilities.

## Pitfalls

- Premature coding: stop and return to discovery/architecture.
- One giant HTML: refactor toward a reusable engine if multiple experiences are planned.
- Fake data: label uncertainty and prefer primary sources.
- Hidden scale distortion: expose educational transformations.
- Asset overload: stream and LOD heavy assets.
- UI-first development: make the hard technical loop work before building the dashboard.
- Monolithic scene: separate domain data, simulation, rendering, UI, and education.
- Unverified success: run checks and inspect the actual experience.
- MCP sprawl: use the minimum tool surface that covers the need.
- Research without synthesis: every major research pass must end in a decision or documented uncertainty.

## Verification

Run the bundled self-check:

`python ${HERMES_SKILL_DIR}/scripts/validate_skill.py`

For project work, also run the project's existing tests/build/lint and the acceptance checklist produced during Phase 9.
