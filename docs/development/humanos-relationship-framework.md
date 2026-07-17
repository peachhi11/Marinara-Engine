# HumanOS v2 Relationship Framework

The relationship framework describes how a specific character/persona pairing should be interpreted in play.

It is not a universal numeric matrix. It is a qualitative layer that helps the runtime and narrative arc generator understand what kind of relationship is active, what that relationship can plausibly support, and what would need to change before a different beat becomes believable.

## Purpose

The relationship framework exists so HumanOS can avoid treating every relationship like the same fixed staircase.

It should help the system answer:

- what kind of relationship this is
- what tone the relationship currently supports
- what intimacy, conflict, distance, or loyalty would feel earned
- what would be too fast, too cold, too intense, or too clean for this pair
- which next beats fit the current story and which would require `ALT` or `BRANCH`

## Ownership

The relationship framework is an interpretive layer, not a durable truth source by itself.

It reads from:

- character truth
- persona truth
- runtime truth
- relationship-save history
- narrative arc phase
- active scene pressure
- relevant lorebook context

It can inform:

- runtime relationship state
- narrative arc projection
- first-message and alternate-opening seeds
- lorebook hooks
- Professor Mari guidance

It must not overwrite:

- character card truth
- persona card truth
- canonical lorebook facts
- committed relationship-save history
- current runtime evidence

## Relationship type

Relationship type is the primary job of this layer.

Use readable trope-coded language instead of clinical or purely numeric labels. A relationship can be a layered blend, with one dominant type and several modifiers.

Examples:

- strangers with spark
- reluctant allies
- rivals with unresolved respect
- slow-burn friends to lovers
- exes with unfinished business
- protector and protected
- mentor and protege
- caretaker and guarded patient
- forbidden loyalty
- enemies forced into cooperation
- rupture and repair
- settled domestic trust

These labels are not fixed routes. They are interpretive handles that tell the LLM what kind of relational logic to follow.

## Modifiers

Modifiers explain why the relationship type behaves differently for this pair.

Useful modifier families:

- **Openness**: guarded, curious, emotionally available, avoidant, testing the waters
- **Power**: equal footing, protective imbalance, social rank gap, professional boundary, dependency
- **History**: first meeting, shared past, betrayal, debt, promise, unfinished confession
- **Pressure**: danger, secrecy, public scrutiny, grief, survival, competition, forced proximity
- **Attachment tone**: slow trust, anxious pursuit, wary loyalty, teasing distance, quiet devotion
- **Conflict tone**: principled disagreement, personal resentment, misread intentions, moral incompatibility

Modifiers should explain behavior, not become new meters.

## Relationship phase

Relationship phase is separate from relationship type.

The narrative arc controller owns story phase. Runtime owns present tension. The relationship framework describes the relational mode that makes those phases feel plausible.

Common relationship phases:

- first contact
- recognition
- testing
- cooperation
- slow burn
- rupture
- repair
- confession
- renegotiation
- settled bond

The same phase can look different under different relationship types. A rupture between rivals may sharpen respect; a rupture in settled domestic trust may feel like grief; a rupture in a first meeting may simply end the scene.

## Trust web

Use a trust web rather than a single trust ladder.

Trust can develop unevenly across different strands:

- practical trust: "I trust you to do the job."
- emotional trust: "I trust you with what I feel."
- moral trust: "I trust your values."
- physical trust: "I feel safe near you."
- social trust: "I trust you not to expose me."
- romantic trust: "I trust the attraction is mutual and safe enough to act on."
- narrative trust: "I trust this story can move forward without breaking what has been earned."

The system may describe these strands qualitatively. It should not require every strand to move together.

## Plausibility checks

Before projecting a relationship beat, ask:

1. Does this beat match the dominant relationship type?
2. Do the modifiers explain why it happens now?
3. Does runtime evidence support the current emotional temperature?
4. Does the relationship save show that this level of trust, conflict, intimacy, or loyalty has been earned?
5. Does the narrative arc phase support this beat, or would it need a setup stage first?
6. Does canon allow this path?

If the beat fits canon, prefer canon-fit.
If the beat needs a compatible alternate route, label it `ALT`.
If the beat requires hard divergence from canon or established history, label it `BRANCH`.

## Output shape

When the app asks an LLM to describe the current relationship framework, use a compact shape:

```md
# Relationship Framework

## Dominant Type
{{trope-coded relationship type}}

## Modifiers
{{qualitative modifiers that explain this pair}}

## Current Phase
{{relationship phase and why it is earned}}

## Trust Web
{{which trust strands are strong, weak, damaged, emerging, or unavailable}}

## Plausible Next Beats
{{beats that fit without forcing the relationship}}

## Blocked or Premature Beats
{{beats that would need setup, repair, ALT, or BRANCH}}
```

## Design rule

If the framework helps the model understand what this relationship can plausibly do next, it is working.

If it turns into a universal scoring table, it has failed.
