# HumanOS v2 Narrative Arc Contract

The narrative arc is the readable projection of runtime truth.

It is the artifact the app generates when a user wants to turn character truth, persona truth, relationship state, and current scene pressure into a coherent story plan.
It should first try to fit the current pairing into canon, then expose explicit routes for `ALT` or `BRANCH` when the user wants a non-default result.

## What it is

The narrative arc is a one-page overview of the current story course broken into five stages:

1. Setup
2. Escalation
3. Complication
4. Turning Point
5. Resolution / Transition

It isn't the same thing as the character card, the persona card, or the relationship save.

- The **character card** says who the other person is.
- The **persona card** says who the player is.
- The **runtime contract** says what is true right now.
- The **relationship save** says what has been earned between that pair over time.
- The **narrative arc** says where the story is going next.

## What the narrative arc should contain

A usable narrative arc should include:

- The current setup
- The active emotional or practical tension
- The likely short-term escalation
- The most plausible complication
- The likely turning point
- The current transition target
- Any first-message or alternate-opening implications
- Any lorebook-worthy durable facts that should be retained

## What it should not contain

The narrative arc shouldn't:

- Restate the full character card
- Restate the full persona card
- Duplicate the relationship save
- Replace runtime history
- Become a giant freeform story prompt
- Flatten dynamic metrics into one universal value

## How it is generated

The arc generator blends:

- Character truth
- Persona truth
- Current runtime truth
- Relationship-framework interpretation
- Relationship-save state
- Scenario context
- Active lorebook entries when relevant

That blend is what makes the arc useful. It should understand that runtime pressure changes depending on:

- The character/persona combination, current scenario, scene pressure, point in the relationship, mode of play.

Relationship interpretation should stay qualitative. The arc generator may use trope-coded relationship language such as "reluctant allies," "slow-burn friends to lovers," "rivals with unresolved respect," or "rupture and repair" when that language helps explain what is plausible next. It shouldn't require a universal numeric gate before a relationship beat can happen.

## Output shape

The preferred output is a concise structured narrative overview:

```md
# Narrative Arc Overview

## Setup
{{what is true at the start of this arc}}

## Escalation
{{what pressure is likely to grow first}}

## Complication
{{what makes the story harder or more emotionally expensive}}

## Turning Point
{{what event, realization, or choice changes the direction}}

## Resolution / Transition
{{how this arc is likely to settle or hand off to the next phase}}

## Current Runtime Notes
{{current state summary, dynamic metrics, and scene-local truths}}

## Story Seeds
{{first message ideas, alternate opening points, or lorebook hooks}}
```

## UI contract

The runtime surface should present as a narrative generator, not as a raw state editor. The same generator can be surfaced from multiple pages, but its behavior changes by entry point:

- On the character page, the generator can derive a runtime scenario from the built character plus any current scenario context.
- On the persona page, the generator is locked until a character is selected and linked.
- Once both character and persona are linked, the generator can blend character truth, persona truth, runtime truth, and relationship-save state into a plausible current narrative.

The output should be editable before it is committed back into runtime, used to update the active lorebook, or projected into a new scenario pass.
When a scene can't be expressed without breaking canon, the arc surface shouldn't silently force it. It should make the `ALT` versus `BRANCH` choice visible.

## Update contract

The narrative arc is updated when:

- The user explicitly regenerates it
- The linked character changes materially
- The linked persona changes materially
- The relationship save advances
- The runtime state changes in a way that meaningfully shifts the arc

When the user is done with one arc and wants another, the same surface can be reused to generate a new arc for the next phase. The UI should support repeated regeneration without requiring the user to abandon the page or rebuild the pairing from scratch.

## Relationship to lorebooks

The narrative arc may produce:

- A runtime scenario summary
- First message drafts
- Alternate first messages
- A narrative arc lorebook
- Updates to an existing active lorebook
- Relationship-framework notes for the active pairing

The app should treat these as downstream deliverables from the arc generator:

1. Runtime scenario overview
2. First-message seeds
3. Alternate opening seeds
4. Narrative-arc lorebook hooks
5. ALT or BRANCH managed lorebook projections for the active runtime/scenario direction

If the user wants the arc controller to remember the current direction, the lorebook is the durable retrieval surface. The narrative arc itself is the planning surface.

## Design rule

If the user can point to a narrative arc and say "this is what the current story is doing," then the contract is working.

If the user can generate it from the character page, reuse it from the persona page once linked, and regenerate a later arc after the first one has played out, the UI contract is working.

If the output becomes a giant prose dump, the contract has failed.
