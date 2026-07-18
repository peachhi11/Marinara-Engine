# HumanOS v2 Narrative Generator UI

This document defines the user-facing surface for the HumanOS runtime projection flow.

The key idea is simple: runtime is still present-state truth, but the UI that users touch should feel like a narrative generator that produces a readable arc overview.

## Purpose

The narrative generator surface should:

- Turn character truth, persona truth, runtime truth, and relationship-save state into a one-page arc overview
- Apply relationship-framework interpretation without forcing a universal numeric gate
- Show the arc as five stages
- Expose the generated text for manual editing
- Try to weave the persona into existing canon first
- Offer an explicit choice between `ALT` and `BRANCH` when the user doesn't want the default canonical fit
- Let users push the result into runtime projection, a lorebook update, or a scenario route
- Support repeated regeneration after the current arc has played out

## Entry points

The same generator can be surfaced from both the character editor and the persona editor.

### Character editor entry

When the user opens runtime from a character card:

- The generator starts from the built character
- Current scenario context is folded in if available
- The result becomes a runtime scenario projection that tries to match canon
- The generator can draft first-message and alternate-first-message variants
- The generator can draft narrative-arc lorebook hooks for the arc controller
- `ALT` is the canon-compatible alternate path
- `BRANCH` is the hard divergence path when canon fit isn't the desired outcome

### Persona editor entry

When the user opens runtime from a persona card:

- The generator stays locked until a character is selected
- Once a character is linked, the generator becomes editable
- Generation blends character truth, persona truth, runtime truth, and relationship-save state
- The result should feel like a plausible present-tense narrative projection for that pair
- If the persona can't fit the canon scene cleanly, the UI should make `ALT` and `BRANCH` the explicit decision points

## Screen behavior

The UI should have three states:

1. Locked, when a persona has no linked character
2. Editable, when the pairing exists and the user can generate or regenerate the arc
3. Reviewable, when the generator has output text that the user can edit before applying it

## Output contract

The generated artifact should read like a compact document, not a prompt dump.

Required sections:

- Setup
- Escalation
- Complication
- Turning Point
- Resolution / Transition
- Current Runtime Notes
- Story Seeds

Optional downstream outputs:

- First message
- Alternate first messages
- Narrative-arc lorebook hooks
- Runtime overlay
- BRANCH path

## Locking rules

- The persona page generator is locked until a character is selected.
- The character page generator is always available, because it can seed from the character alone.
- The same generator can be revisited later to create a new arc after the previous arc has matured.
- The canonical default is always fit-first, `ALT` second, `BRANCH` only when the user explicitly chooses to depart from canon.

## Design rule

If the UI feels like "edit a blob of state", it is wrong.

If the UI feels like "generate the next readable story course, then decide what to keep", it is right.
