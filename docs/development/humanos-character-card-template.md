# HumanOS v2 Character Card Template

Use this template when asking an LLM to produce a readable character card from sparse notes, a persona draft, a relationship sketch, or a fuller HumanOS module draft.

The goal is not to make the card longer. The goal is to make the character legible:

- one stable identity
- one clear psychological engine
- one visible presentation
- one relationship pattern
- one speech model
- one story-use overview
- no mixing runtime, world state, or lorebook depth into durable card truth

## Layer contract

The HumanOS character template is a module system. Some modules belong in the always-on character card; others are runtime, world, relationship, or arc infrastructure.

| Module | Purpose | Preferred owner |
| --- | --- | --- |
| 1. Identity | Who they are physically and socially | Character card |
| 2. Personality | Values, laws, morals, contradictions, strengths, flaws | Character card |
| 3. Cognition | How they notice, decide, learn, misread, and solve problems | Character card |
| 4. Psychology | Wound, lie, truth, defenses, shame, fear, triggers | Character card |
| 5. Relationships | Attachment pattern, intimacy style, push-away behaviors, needs | Character card plus relationship framework |
| 6. Sexuality | Adult desire style, limits, safety needs, aftermath patterns | Character card when relevant and adult-only |
| 7. Speech | Voice, language pattern, silence, pressure speech, examples | Character card |
| 8. Runtime | Current scene, mood, pressure, active memories, current relationship state | Runtime contract |
| 9. World | External reality, setting pressure, mortality, norms, consequences | World/lorebook layer |
| 10. Relational Infrastructure | Supporting cast, NPC pressure systems, lorebook NPC profiles | Lorebook plus relationship framework |
| 11. Director / Arc Engine | Arc trope, progression gates, regression, conflict engine, output logic | Narrative arc contract |
| 12. Overview | Synthesized summary generated last and placed first | Character card overview |

Modules 1-7 and 12 can be rendered into the readable card. Modules 8-11 should inform generation and downstream artifacts, but they should not be copied wholesale into durable character truth.

## Field mapping

For SillyTavern-style card export, the source module draft maps roughly as:

- `{{personaDescription}}`: Module 1, Identity
- `{{personaPersonality}}`: Modules 2-7, Personality through Speech
- `{{personaScenario}}`: Module 8, Runtime
- `{{personaBackstory}}`: Modules 9-11, World, Relational Infrastructure, and Arc Engine
- Overview: Module 12, generated last, placed first

These field names are compatibility labels. They do not change the HumanOS truth boundaries.

## Writing contract for the LLM

When filling this template, the LLM should:

- write in plain prose, not a dump of bullet points
- keep appearance, psychology, story role, relationship style, and speech separate
- generate behavior from cause, not trait labels
- describe behavior as tendencies, not guarantees
- preserve established canon and user-supplied facts
- mark uncertain facts as unknown instead of inventing them
- keep runtime state out of the durable card unless the user explicitly asks for a current-state card
- keep world facts out of the card unless they are necessary to understand the character
- use qualitative relationship language instead of a universal numeric trust gate
- treat sexual material as adult-only, optional, and bounded by the user's source material

## Module 12 overview

Generate the overview last, then place it first in the readable card.

```md
# {{character_name}}

## Overview
{{2-3 sentences: essential identity, not a trait list}}

## Core Function
{{what kind of story this character is built to tell and what they do to a narrative}}

## Arc Trope
{{named trope or "none", plus romance beat framework if relevant}}

## Dominant Wound
{{one sentence naming the psychological engine underneath everything}}

## The Lie
{{the false belief driving behavior until it is unlearned}}

## The Truth
{{what growth looks like for this character}}

## How To Use Them
{{what kind of persona, scenario, and pressure activates their best story}}

## What To Avoid
{{what interaction flattens them, collapses tension, or breaks the story they are built to tell}}

## Modular Note
{{setting-independent note: their psychology, laws, wound, and arc travel across eras, locations, and genres}}
```

## Modules 1-7 card template

The preferred durable card output is concise prose in this order.

```md
## Identity
{{full name, goes-by name, pronouns, age range, heritage if relevant, occupation or social position, and one sentence on core identity}}

## Appearance
{{height/build, face, eyes, hair, skin, distinguishing features, movement, posture, default expression, first impression, clothing style, and signature details}}

## Personality
{{values, internal laws, moral code, contradictions, flaws, and strengths. Focus on what costs them something.}}

## Cognition
{{how they think, learn, solve problems, make decisions, notice details, miss details, misread others, and behave when pressured, curious, threatened, or safe}}

## Psychology
{{core wound, lie, truth, attachment pattern, defenses, triggers, shame profile, fear profile, and what bypasses their defenses}}

## Relationships
{{how they behave when connection starts, deepens, is threatened, or ends. Include intimacy style, push-away behaviors, and what they need but cannot ask for.}}

## Sexuality
{{optional adult-only section. Orientation or desire style if relevant, safety needs, limits, physical language of desire, and aftermath pattern. Omit or mark unknown when unsupported.}}

## Speech Style
{{tone, pace, register, vocabulary, sentence structure, verbal habits, silence, pressure speech, and writing-vs-speaking differences}}

## Conditional Dialogue Examples
{{short examples from early, middle, and late arc stages that anchor voice without replacing the full prompt}}
```

## Module 8 runtime boundary

Runtime is mutable story truth. It answers what is true right now, not who the character permanently is.

Runtime may include:

- active arc and phase
- rhythm state
- current scene
- immediate goal
- current mood, stress, fatigue, and hope
- wound, lie, defense, vulnerability, and arousal phase as current-state labels
- active memories from the current scene
- current relationship state for the active pairing

Runtime must not overwrite Modules 1-7. If a scene changes the character permanently, record the evidence through the governed runtime and relationship-save paths before changing durable architecture.

See [HumanOS v2 Runtime Contract](humanos-runtime-contract.md).

## Module 9 world boundary

World is external pressure. It is not the character.

World material may define:

- setting environment
- time period and current events
- primary location
- genre and tone
- technology baseline
- socioeconomic climate
- politics and power systems
- social norms
- mortality rules
- behavioral constraints such as travel time, exhaustion, law, money, and consequence

World details belong in scenario, world-state, or lorebook surfaces unless a detail is necessary to understand the character's durable identity.

## Module 10 relational infrastructure boundary

Supporting cast and NPCs are relational pressure systems. They should exist because they activate something in the character, create conflict, or enable growth.

Use tiers:

- **Tier 1, in-card**: name and role only for main supporting cast
- **Tier 2, lorebook**: full NPC profile for significant recurring characters
- **Tier 3, lorebook note**: one or two sentences for mentioned or minor recurring characters
- **Tier 4, no file**: background people who do not need durable state

Relationship dynamics between the character and NPCs should be compact in the card and deeper in lorebooks or relationship framework notes.

See [HumanOS v2 Relationship Framework](humanos-relationship-framework.md) and [Linking Lorebooks to Characters and Personas](../lorebooks/linking-to-characters.md).

## Module 11 director / arc engine boundary

The arc engine describes how the character changes, bends, breaks, and recovers.

It should follow these principles:

- behavior is generated from cause, not traits
- character laws remain active
- story truth cannot overwrite immutable character truth
- setting applies pressure but does not define personality
- the arc moves because something was earned, not because time passed
- growth expands available behaviors without erasing defenses
- regression can happen, but it must not erase earned development

Arc control may include:

- arc trope and romance beat framework
- staged relationship or character progression
- progression gates such as safety, specific attention, repair, mutual exposure, and choice
- regression rules
- sexual arc axes when relevant and adult-only
- conflict from law collision
- setting pressure against character laws
- anti-loop rules that force consequence after repeated patterns
- silent output logic for what the character wants, fears, defends, and risks right now

This belongs primarily to the narrative arc system, not the always-on card.

See [HumanOS v2 Narrative Arc Contract](humanos-narrative-arc-contract.md).

## Relationship progression rule

Do not treat trust as one universal ladder.

For a character card, it is useful to describe how trust is usually earned with this character. For runtime and narrative projection, use the relationship framework's qualitative trust web instead:

- practical trust
- emotional trust
- moral trust
- physical trust
- social trust
- romantic trust
- narrative trust

This lets a character trust someone in one strand while remaining guarded in another. It also prevents every romance, rivalry, friendship, alliance, or rupture from following the same fixed staircase.

## Good example behavior

A good character card answer should feel like a person a reader can recognize immediately. It should tell us:

- what this person looks like
- what this person values
- what this person does under pressure
- what wound and false belief shape them
- how they move through relationships
- how they speak when calm, threatened, hurt, or softening
- what kind of story pressure reveals who they really are

It should not:

- restate the same trait in three different sections
- overexplain the writing process
- sound like a wiki entry with no emotional center
- invent a dramatic trauma to fill a section
- force a romantic or sexual arc when the source does not support one
- turn runtime scene details into permanent biography
- copy world, NPC, or arc infrastructure wholesale into the card

## Suggested prompt wrapper

```md
You are generating a readable HumanOS v2 character card.

Rules:
- preserve established canon and user-supplied facts
- do not invent unknown facts
- keep character truth, story binding, runtime, world, lorebook, relationship framework, and narrative arc separate
- write concise, emotionally legible prose
- generate behavior from laws, wounds, defenses, context, and pressure
- describe relationship progression qualitatively, not as a universal numeric gate
- omit unsupported sexual material; only include adult sexuality when the source supports it
- if a field is unknown, say so

Fill the durable card from Modules 1-7.
Generate Module 12 last and place it first.
Use Modules 8-11 only as downstream runtime, world, lorebook, relationship, or arc guidance.

{{template}}
```

## If the source is sparse

When the source is thin, the LLM should only expand what is justified by the input.

Allowed expansion:

- consolidate overlapping traits
- infer likely emotional style from repeated behavior
- turn vague notes into readable prose
- name plausible contradictions when the source already implies them

Not allowed:

- inventing a secret trauma to make the card sound deeper
- adding a backstory because the template has a backstory section
- turning a roleplay premise into permanent biography
- turning a current relationship beat into permanent relationship history
