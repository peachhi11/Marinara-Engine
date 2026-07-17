# HumanOS v2 Integration Map for Marinara Engine

This document explains which HumanOS material is canonical in the HumanOS repo and which material is owned by Marinara Engine.

Use it before editing docs or behavior so framework concepts and app-specific implementation do not drift into each other.

## Canonical framework repo

The canonical HumanOS framework repo is:

- [peachhi11/HumanOs-CCv2](https://github.com/peachhi11/HumanOs-CCv2)

Current branch-owned framework surfaces:

- `HumanOS-main` — repo landing branch and branch map
- `docs/architecture` — architecture overview and cross-surface index
- `architecture/contracts` — runtime and narrative contracts
- `architecture/templates` — reusable character and persona templates
- `docs/memory-retrieval` — lorebook-linking and retrieval-boundary guidance
- `evaluation/scorecards` — evaluation scorecards and reviewer guidance
- `docs/relationship-memory` — relationship-save and managed-projection boundaries

## What belongs in HumanOS-CCv2

Keep these in the HumanOS repo when they are meant as canonical framework material:

- layer definitions
- truth boundaries
- reusable contracts
- reusable templates
- retrieval ownership rules
- reviewer or evaluation rules that are not specific to one app

## What belongs in Marinara

Keep these in Marinara when they are primarily about this product's implementation:

- route surfaces
- storage adapters
- governed commit implementation details
- UI tabs, buttons, and click paths
- Professor Mari tool wiring
- import and export behavior
- app-specific debugging notes

## Current mapping

| Concern | Canonical home | Marinara home |
| --- | --- | --- |
| HumanOS architecture concepts | HumanOS-CCv2 `docs/architecture` | integration examples only |
| Runtime and narrative contracts | HumanOS-CCv2 `architecture/contracts` | implementation of those contracts |
| Character and persona templates | HumanOS-CCv2 `architecture/templates` | editor fields and app flows |
| Lorebook-linking boundaries | HumanOS-CCv2 `docs/memory-retrieval` | UI guide in `docs/lorebooks/linking-to-characters.md` |
| Relationship-save boundaries and managed projection rules | HumanOS-CCv2 `docs/relationship-memory` | `docs/development/generalized-proposed-patch-commit-system.md` and server implementation |
| Evaluation scorecards and reviewer guidance | HumanOS-CCv2 `evaluation/scorecards` | ordered review wiring, reviewer agents, and product-specific prompts |
| Narrative generator UI behavior | framework implications may be documented canonically | Marinara UI and routes |
| Professor Mari behavior | only if generalized beyond Marinara | Marinara-specific docs and code |

## Editing rule of thumb

If the question is:

- **"What does HumanOS mean by this?"** edit HumanOS-CCv2.
- **"How does Marinara expose or implement this?"** edit Marinara.

## Current Marinara-owned HumanOS documents

These remain implementation-side or app-specific today:

- `docs/development/humanos-v2-architecture.md`
- `docs/development/humanos-architecture-index.md`
- `docs/development/humanos-narrative-generator-ui.md`
- `docs/development/generalized-proposed-patch-commit-system.md`
- `docs/lorebooks/linking-to-characters.md`

Some of these may later be split further as more framework-level surfaces are extracted.
