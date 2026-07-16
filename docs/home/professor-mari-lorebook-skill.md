---
name: "professor-mari-skill-lorebook-architect"
description: "Use when creating, auditing, repairing, attaching, or exporting Marinara lorebooks."
---

# Professor Mari Skill: Lorebook Architect

## Identity

- **Skill ID:** `lorebook-architect`
- **Version:** 2.0
- **Purpose:** Create, audit, repair, attach, and export Marinara lorebooks as real retrieval systems instead of decorative encyclopedia dumps.

## Triggers

Invoke when the user asks to:

- create or expand a lorebook
- audit whether a lorebook is actually usable
- repair empty, placeholder, repetitive, or structurally weak entries
- move durable conditional depth out of a character or persona card
- attach or link a lorebook to a character or persona
- export a lorebook for Marinara or external use

Do not invoke for present runtime state, scene-only conditions, broad worldbuilding with no retrieval purpose, or ordinary card edits that belong in always-active fields.

## Core stance

- Treat lorebooks as retrieval systems, not decorative worldbuilding dumps.
- Prefer live Marinara editing over raw JSON export unless the user explicitly asks for a file.
- Inspect before claiming facts. Verify after changing anything.
- Existence is not completeness.

## Workflow

1. Determine the real task: brainstorm, create, audit, standardize, link, or export.
2. For an existing lorebook, read the actual lorebook and the actual entry rows before judging it.
3. If the lorebook has zero entries, say plainly that it exists but is not usable yet.
4. Distinguish active retrieval-facing entries from disabled legacy scaffolding or old category shells.
5. Group material by retrieval purpose, not just by source paragraph or HumanOS module.
6. Create or repair entries in small verified batches when the lorebook is large.
7. After each meaningful write batch, re-read the saved rows and verify the result instead of assuming success.
8. If the user asked for export, choose the format only at the end.

## Entry design rules

### Good entries

- one clear retrieval need per entry
- narrow, natural trigger keys
- concise, readable, retrieval-friendly prose
- cross-links only when they help recall related information
- priority and position chosen for actual prompt value

### Bad entries

- generic keys like `city`, `house`, `sword`, `friend`
- subject-name spam on every entry
- many unrelated facts crammed into one row
- decorative prose that burns budget without improving recall
- every entry sharing the same order and behavior
- careless cross-mentioning that creates recursion loops

## Marinara-specific guidance

### Library and attachment rules

- Marinara library categories are labels, not activation logic.
- For character or persona assignment, the lorebook should be in the **Character** category.
- Prefer linking a lorebook to a character or persona by default.
- Only embed a lorebook into a character card when the user explicitly wants it baked into the exported card.
- Do not confuse textual mentions of another character with canonical ownership; verify owner links from the lorebook itself.

### Entry behavior

Use Marinara's real controls only when they help:

- **Normal** for most entries
- **Constant** only for foundational rules or facts that break interpretation if forgotten
- **Selective** when a broad trigger needs a second condition or exclusion
- **Position** and **Order** should follow retrieval function, not habit
- **Sticky**, **Cooldown**, and **Delay** are for timing-sensitive behavior, not default decoration
- **Recursive** scanning should be deliberate and bounded
- **Vectors** and semantic search help large or concept-heavy books, but they are optional

### Semantic search

- If the user wants semantic search, remember that imported or changed entries may need vectorization.
- If the embedding model changes, recommend re-vectorizing all entries rather than only missing ones.

## Recommended content groupings

Use only the groups that the source actually supports:

- world rules and mechanics
- characters
- relationships
- locations
- items and objects
- factions and organizations
- events and history
- concepts and terms
- protocols and procedures
- active scenes only when the material is genuinely temporary or unstable

For HumanOS-heavy work, durable conditional depth often belongs in focused entries such as:

- cognition and interpretation
- psychology, defenses, and recovery
- trust, conflict, and repair
- speech under pressure
- growth and regression
- significant NPC or relational pressure systems
- formative history
- arc architecture

## Audit contract

When auditing, always report:

1. whether the lorebook exists
2. actual entry count
3. whether any entries are empty, placeholder, duplicated, overgeneric, or structurally weak
4. whether the lorebook is usable as-is
5. the smallest clean repair path

Never say "looks good" unless the entry rows actually support that verdict.

## Repair rules

- Standardize active retrieval-facing entries first.
- Leave disabled legacy scaffolding alone unless the user asks to remove or rewrite it.
- Do not silently merge distinct concepts just to reduce count.
- Do not silently split one concept into many rows unless the retrieval logic genuinely improves.

## Export rules

Use export mode only when explicitly requested.

- **Marinara Native** when the user wants a round-trip Marinara file with full field fidelity
- **Compatible JSON** when the user wants external-tool portability

If the task is normal in-app use, keep it live instead of forcing a file export workflow.

## Validation

- verify the saved row count
- verify the actual saved content, not just the existence of IDs
- check trigger quality and obvious false positives
- check for duplicate ownership with card fields or sibling entries
- verify link target and scope when attaching to a character or persona

## Failure handling

If a selective retrieval design is not defensible:

- keep it in a compact always-active card field
- move it to private architecture
- omit it

Do not bluff completion when the underlying rows do not support the claim.
