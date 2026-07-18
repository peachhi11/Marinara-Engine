# HumanOS v2 Relationship Framework

The relationship framework describes how a specific character/persona pairing should be interpreted in play.

It isn't a universal numeric matrix. It's a qualitative layer that helps the runtime and narrative arc generator understand what kind of relationship is active, what that relationship can plausibly support, and what would need to change before a different beat becomes believable.

## Purpose

The relationship framework exists so HumanOS can avoid treating every relationship like the same fixed staircase.

It should help the system answer:

- What kind of relationship this is
- What tone the relationship currently supports
- What intimacy, conflict, distance, or loyalty would feel earned
- What would be too fast, too cold, too intense, or too clean for this pair
- Which next beats fit the current story and which would require `ALT` or `BRANCH`

## Ownership

The relationship framework is an interpretive layer, not a durable truth source by itself.

It reads from:

- Character truth
- Persona truth
- Runtime truth
- Relationship-save history
- Narrative arc phase
- Active scene pressure
- Relevant lorebook context

It can inform:

- Runtime relationship state
- Narrative arc projection
- First-message and alternate-opening seeds
- Lorebook hooks
- Professor Mari guidance

It mustn't overwrite:

- Character card truth
- Persona card truth
- Canonical lorebook facts
- Committed relationship-save history
- Current runtime evidence

## Relationship type

Relationship type is the primary job of this layer.

Use readable trope-coded language instead of clinical or purely numeric labels. A relationship can be a layered blend, with one dominant type and several modifiers.

Examples:

- Strangers with spark
- Reluctant allies
- Rivals with unresolved respect
- Slow-burn friends to lovers
- Exes with unfinished business
- Protector and protected
- Mentor and protege
- Caretaker and guarded patient
- Forbidden loyalty
- Enemies forced into cooperation
- Rupture and repair
- Settled domestic trust

These labels aren't fixed routes. They are interpretive handles that tell the LLM what kind of relational logic to follow.

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

- First contact
- Recognition
- Testing
- Cooperation
- Slow burn
- Rupture
- Repair
- Confession
- Renegotiation
- Settled bond

The same phase can look different under different relationship types. A rupture between rivals may sharpen respect; a rupture in settled domestic trust may feel like grief; a rupture in a first meeting may simply end the scene.

## Trust web

Use a trust web rather than a single trust ladder.

Trust can develop unevenly across different strands:

- Practical trust: "I trust you to do the job."
- Emotional trust: "I trust you with what I feel."
- Moral trust: "I trust your values."
- Physical trust: "I feel safe near you."
- Social trust: "I trust you not to expose me."
- Romantic trust: "I trust the attraction is mutual and safe enough to act on."
- Narrative trust: "I trust this story can move forward without breaking what has been earned."

The system may describe these strands qualitatively. It shouldn't require every strand to move together.

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
