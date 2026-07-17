# HumanOS v2 Architecture

This document describes Marinara Engine's current HumanOS integration. For canonical framework docs, templates, contracts, and retrieval-boundary guidance, see [HumanOS v2 Integration Map for Marinara Engine](humanos-integration-map.md).

HumanOS v2 is Marinara Engine's architecture for behaviorally coherent characters and user personas. It keeps durable identity, story context, and mutable runtime state separate so the app can reason about each layer without collapsing them into one blob of prompt text.

## What HumanOS v2 is for

HumanOS v2 does four jobs:

1. store a private architecture for an active `CHARACTER` or `USER_PERSONA`
2. maintain a committed runtime snapshot for the current chat
3. sequence deterministic HumanOS agents by dependency wave
4. publish only after ordered review and canonical-turn checks pass

The implementation is split across the private architecture storage, runtime storage, dependency planner, ordered review policy, and server-owned tool callbacks.

## The core separation

HumanOS keeps four kinds of truth apart:

- **Character Truth**: durable facts and behavioral architecture that travel with a specific character or persona
- **Story Binding**: the current scenario, cast, social pressure, and setting-specific role
- **Runtime Truth**: what is true right now in the active chat
- **World Truth**: external constraints such as physics, culture, technology, and platform rules

This separation matters because the same person can appear in different stories, under different pressures, with different runtime state. If those layers are merged, the system starts confusing stable identity with temporary scene conditions.

## Why the layers are separate

### Character vs story

Character architecture answers "who is this person in a durable sense?"
Story binding answers "what story are they in right now?"

Keeping them separate prevents the app from overwriting a reusable character with one scenario's temporary details. A backstory, a relationship setup, or a current scene can change without rewriting the character itself.

### Character vs world

World truth is not a character property. If the setting changes, the character should react to it rather than become it. That keeps the same person usable in different worlds and modes.

### Character vs persona

Characters are people in the story. Personas are the user's identity in the chat. Marinara stores both as first-class subjects, but they are not interchangeable:

- a character is the person the AI interacts with
- a persona is the user-controlled identity the AI addresses as "you"

That distinction is reflected in the subject types accepted by the HumanOS API and tools: `CHARACTER` and `USER_PERSONA`.

### Character vs runtime

Runtime is mutable. It captures what is true now in the active chat and can be committed after canonical evidence is available.

Character architecture is durable. It should not be rewritten every time the scene changes. Runtime commit is therefore gated by the server-selected canonical assistant message and swipe, plus a fingerprinted turn snapshot.

The runtime surface is also allowed to act as a narrative generator surface. In that mode it should produce a one-page story projection, not a raw state dump. On the character page it can seed a runtime arc from character truth and scenario context. On the persona page it stays locked until a character is linked, then blends character truth, persona truth, runtime truth, relationship-framework interpretation, and relationship-save state into a reusable arc overview. The default path is canon-fit first; ALT is the canon-compatible alternate arc, and BRANCH is the deliberate hard-divergence arc.

Relationship interpretation sits beside runtime as a qualitative framework, not as another durable card. It describes the current relationship type, modifiers, trust strands, and plausible next beats for one character/persona pairing. Runtime records present-state evidence; the relationship framework explains what that evidence means for relational plausibility.

## Psychological underpinnings

HumanOS models behavior as something that emerges from stable architecture plus context, not from one-off prompts alone.

In practice, the architecture gives the system places to store:

- values and priorities
- wounds and defenses
- relational expectations
- relationship type and trust strands
- speech style
- growth and regression tendencies
- current pressure and recent state

That is why the docs for character and persona work should talk about psychology, not just appearance or biography. The model needs the internal mechanics that make a person readable under stress.

This is also why lorebooks matter. Durable conditional depth belongs in retrieval when it only matters in some scenes, instead of inflating the always-active card fields.

## Semantic links between modules

HumanOS uses a few linked modules that work together:

- `packages/server/src/routes/humanos-v2.routes.ts` exposes the public HTTP surface
- `packages/server/src/services/storage/humanos-architecture.storage.ts` stores private architecture rows
- `packages/server/src/services/storage/humanos-runtime.storage.ts` stores committed runtime snapshots
- `packages/server/src/services/humanos/humanos-tool-runtime.ts` validates subject scope, reads and writes architecture, and commits runtime
- `packages/server/src/services/agents/humanos-dependency-graph.ts` plans deterministic agent dependency waves
- `packages/server/src/services/generation/humanos-publication-policy.ts` enforces ordered review and supported publication modes
- `packages/server/src/services/generation/humanos-turn-snapshot.ts` fingerprints the canonical turn context used for runtime commits
- `docs/development/humanos-relationship-framework.md` defines the qualitative relationship layer that runtime and narrative projection can consult

These pieces are intentionally linked by authority:

1. the route layer exposes read and write entry points
2. the tool runtime verifies the active subject before allowing edits
3. the turn snapshot records the evidence boundary for a generation turn
4. the runtime storage layer commits only against canonical evidence
5. the publication policy blocks unsupported or incomplete reviewer configurations

## Flow on effect

The architecture affects how Marinara behaves end to end:

- persona and character content can be refined without mutating runtime state
- runtime state can be committed without overwriting reusable architecture
- relationship type can guide projection without becoming a universal numeric gate
- deterministic agents can depend on earlier agent outputs without forming cycles
- publication can be held back when review is incomplete or a canonical anchor is missing
- docs for characters, personas, and lorebooks can describe the right layer instead of forcing everything into card fields

This reduces accidental bleed between:

- reusable identity
- scenario-specific premise
- live chat state
- private authoring notes

## Operational boundaries

The current route surface reflects those boundaries:

- `GET /api/humanos-v2/architecture/:subjectType/:subjectId`
- `PUT /api/humanos-v2/architecture/:subjectType/:subjectId`
- `DELETE /api/humanos-v2/architecture/:subjectType/:subjectId`
- `GET /api/humanos-v2/runtime/:chatId`
- `PUT /api/humanos-v2/runtime/:chatId` is blocked on the public HTTP surface
- `GET /api/humanos-v2/relationship-save/:chatId/:characterId/:personaId`
- `PUT /api/humanos-v2/relationship-save/:chatId/:characterId/:personaId`
- `GET /api/humanos-v2/relationship-save/:chatId/:characterId/:personaId/checkpoints`
- `POST /api/humanos-v2/relationship-save/:chatId/:characterId/:personaId/checkpoint` is blocked on the public HTTP surface

HumanOS v2 tools are also scoped to active subjects and current generation context:

- `humanos_get_architecture`
- `humanos_save_architecture`
- `humanos_get_runtime`
- `humanos_commit_runtime`

The runtime commit tool requires a server-owned canonical assistant anchor and will fail closed when one is unavailable.

## What to read next

- [HumanOS v2 Integration Map for Marinara Engine](humanos-integration-map.md)
- [Architecture Map (Developers)](architecture-map.md)
- [HumanOS v2 Character Card Template](humanos-character-card-template.md)
- [HumanOS v2 Persona Template](humanos-persona-template.md)
- [HumanOS v2 Runtime Contract](humanos-runtime-contract.md)
- [HumanOS v2 Relationship Framework](humanos-relationship-framework.md)
- [HumanOS v2 Narrative Arc Contract](humanos-narrative-arc-contract.md)
- [HumanOS v2 Architecture Index](humanos-architecture-index.md)
- [Generalized Proposed Patch Commit System](generalized-proposed-patch-commit-system.md)
- [Professor Mari, Your In-App Assistant](../home/professor-mari.md)
- [Linking Lorebooks to Characters and Personas](../lorebooks/linking-to-characters.md)
