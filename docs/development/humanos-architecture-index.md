# HumanOS v2 Architecture Index

This index ties the main HumanOS surfaces together so contributors can find the right layer quickly.

## Surfaces

### Character

Stable story identity for an AI character.

Use when you need:

- durable character truth
- appearance
- personality
- backstory
- relationship tendencies
- speech style

Reference:
- [HumanOS v2 Character Card Template](humanos-character-card-template.md)

### Persona

Stable user-controlled identity for the chat participant.

Use when you need:

- user identity
- persona appearance
- personality
- social style
- scenario context

Reference:
- [HumanOS v2 Persona Template](humanos-persona-template.md)

### Runtime

Mutable present-state truth for the active chat.

Use when you need:

- current scene state
- active pressure
- recent changes
- dynamic metrics
- relationship stage tracking

Reference:
- [HumanOS v2 Runtime Contract](humanos-runtime-contract.md)
- [HumanOS v2 Narrative Arc Contract](humanos-narrative-arc-contract.md)

### Lorebook

Retrieval-only depth for conditional facts that should not live in the always-on card.

Use when you need:

- durable conditional depth
- secondary relationships
- hidden context that only matters in some scenes
- compact retrieval entries

Reference:
- [Linking Lorebooks to Characters and Personas](../lorebooks/linking-to-characters.md)
- [HumanOS v2 Architecture](humanos-v2-architecture.md)

### Relationship Save

Chat-bound relationship history between a specific character and a specific persona.

Use when you need:

- permanent relationship progression
- milestones
- checkpoint lineage
- canonical evidence references
- chat-local relationship continuity

Reference:
- [Generalized Proposed Patch Commit System](generalized-proposed-patch-commit-system.md)

### Narrative Arc

Readable story projection for the current character/persona pairing and runtime state.

Use when you need:

- a one-page story overview
- five arc stages
- first-message and alternate-opening seeds
- lorebook hooks for the arc controller
- a canon-fit default path, with `ALT` for compatible alternates and `BRANCH` only when the user chooses to diverge

Reference:
- [HumanOS v2 Narrative Arc Contract](humanos-narrative-arc-contract.md)

### Narrative Generator UI

Editable runtime projection surface for generating and revising the narrative arc.

Use when you need:

- a user-facing runtime generation tab
- locking behavior until a persona is linked to a character
- editable arc output before commit
- downstream draft generation for first messages and lorebook hooks

Reference:
- [HumanOS v2 Narrative Generator UI](humanos-narrative-generator-ui.md)

## How the layers interact

1. The **character** card defines who the character is in a durable sense.
2. The **persona** card defines who the user is in the chat.
3. The **runtime** contract records what is true right now.
4. The **lorebook** stores conditional depth that should only appear when triggered.
5. The **narrative arc** projects the current story direction from runtime and relationship context.
6. The **relationship save** preserves the evolving history between one character and one persona.
7. The **narrative generator UI** is the user-facing surface that turns runtime projection into editable deliverables.

If a fact is durable, keep it in the character or persona layer.
If it is conditional, keep it in a lorebook.
If it is temporary, keep it in runtime.
If it is relationship history, keep it in the relationship save.

## Design rules

- Do not mix runtime state into card truth.
- Do not put always-active biography into lorebooks.
- Do not let story binding overwrite character truth.
- Do not make persona and character fields interchangeable.
- Do not treat the relationship save as a card replacement.
- Do not let the runtime contract become a second character card.
- Do not let the narrative arc become a replacement for runtime, lorebook, or relationship save.
- Do not let the narrative generator UI become a separate truth source. It is a view and edit surface for the runtime projection.

## Code anchors

- HumanOS architecture storage: `packages/server/src/services/storage/humanos-architecture.storage.ts`
- HumanOS runtime storage: `packages/server/src/services/storage/humanos-runtime.storage.ts`
- HumanOS runtime tool callback: `packages/server/src/services/humanos/humanos-tool-runtime.ts`
- HumanOS runtime routes: `packages/server/src/routes/humanos-v2.routes.ts`
- HumanOS runtime schema and target identity: `packages/server/src/services/storage/humanos-runtime-governed.ts`
- Relationship save system: `docs/development/generalized-proposed-patch-commit-system.md`
