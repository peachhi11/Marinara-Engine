# HumanOS v2 Architecture Index

This index ties the main HumanOS surfaces together so contributors can find the right layer quickly.

For the repo boundary between canonical HumanOS framework material and Marinara-specific implementation, see [HumanOS v2 Integration Map for Marinara Engine](humanos-integration-map.md).

## Surfaces

### Character

Stable story identity for an AI character.

Use when you need:

- Durable character truth
- Appearance
- Personality
- Cognition and psychology
- Backstory
- Relationship tendencies
- Speech style
- Character-use overview

Reference:
- [HumanOS v2 Character Card Template](humanos-character-card-template.md)

### Persona

Stable user-controlled identity for the chat participant.

Use when you need:

- User identity
- Persona appearance
- Personality
- Social style
- Scenario context

Reference:
- [HumanOS v2 Persona Template](humanos-persona-template.md)

### Runtime

Mutable present-state truth for the active chat.

Use when you need:

- Current scene state
- Active pressure
- Recent changes
- Dynamic metrics
- Relationship stage tracking

Reference:
- [HumanOS v2 Runtime Contract](humanos-runtime-contract.md)
- [HumanOS v2 Narrative Arc Contract](humanos-narrative-arc-contract.md)

### Relationship Framework

Interpretive relationship logic for a specific character/persona pairing.

Use when you need:

- Relationship type
- Trope-coded relational language
- Qualitative trust strands
- Phase-aware plausibility checks
- Guidance for what would feel earned, premature, or divergent

Reference:
- [HumanOS v2 Relationship Framework](humanos-relationship-framework.md)

### Lorebook

Retrieval-only depth for conditional facts that shouldn't live in the always-on card.

Use when you need:

- Durable conditional depth
- Secondary relationships
- Hidden context that only matters in some scenes
- Compact retrieval entries

Reference:
- [Linking Lorebooks to Characters and Personas](../lorebooks/linking-to-characters.md)
- [HumanOS v2 Architecture](humanos-v2-architecture.md)

### Relationship Save

Chat-bound relationship history between a specific character and a specific persona.

Use when you need:

- Permanent relationship progression
- Milestones
- Checkpoint lineage
- Canonical evidence references
- Chat-local relationship continuity

Reference:
- [Generalized Proposed Patch Commit System](generalized-proposed-patch-commit-system.md)

### Narrative Arc

Readable story projection for the current character/persona pairing and runtime state.

Use when you need:

- A one-page story overview
- Five arc stages
- First-message and alternate-opening seeds
- Lorebook hooks for the arc controller
- A canon-fit default path, with `ALT` for compatible alternates and `BRANCH` only when the user chooses to diverge

Reference:
- [HumanOS v2 Narrative Arc Contract](humanos-narrative-arc-contract.md)

### Narrative Generator UI

Editable runtime projection surface for generating and revising the narrative arc.

Use when you need:

- A user-facing runtime generation tab
- Locking behavior until a persona is linked to a character
- Editable arc output before commit
- Downstream draft generation for first messages and lorebook hooks

Reference:
- [HumanOS v2 Narrative Generator UI](humanos-narrative-generator-ui.md)

## How the layers interact

1. The **character** card defines who the character is in a durable sense.
2. The **persona** card defines who the user is in the chat.
3. The **runtime** contract records what is true right now.
4. The **relationship framework** interprets what kind of relationship the current pairing can plausibly support.
5. The **lorebook** stores conditional depth that should only appear when triggered.
6. The **narrative arc** projects the current story direction from runtime and relationship context.
7. The **relationship save** preserves the evolving history between one character and one persona.
8. The **narrative generator UI** is the user-facing surface that turns runtime projection into editable deliverables.

If a fact is durable, keep it in the character or persona layer.
If it is conditional, keep it in a lorebook.
If it is temporary, keep it in runtime.
If it is relationship history, keep it in the relationship save.
If it is relationship interpretation, keep it in the relationship framework.

## Design rules

- Don't mix runtime state into card truth.
- Don't put always-active biography into lorebooks.
- Don't let story binding overwrite character truth.
- Don't make persona and character fields interchangeable.
- Don't treat the relationship save as a card replacement.
- Don't let the runtime contract become a second character card.
- Don't turn the relationship framework into a universal numeric gate.
- Don't let the narrative arc become a replacement for runtime, lorebook, or relationship save.
- Don't let the narrative generator UI become a separate truth source. It's a view and edit surface for the runtime projection.

## Code anchors

- HumanOS architecture storage: `packages/server/src/services/storage/humanos-architecture.storage.ts`
- HumanOS runtime storage: `packages/server/src/services/storage/humanos-runtime.storage.ts`
- HumanOS runtime tool callback: `packages/server/src/services/humanos/humanos-tool-runtime.ts`
- HumanOS runtime routes: `packages/server/src/routes/humanos-v2.routes.ts`
- HumanOS runtime schema and target identity: `packages/server/src/services/storage/humanos-runtime-governed.ts`
- Relationship save system: `docs/development/generalized-proposed-patch-commit-system.md`
- Relationship framework: `docs/development/humanos-relationship-framework.md`
