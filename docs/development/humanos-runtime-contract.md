# HumanOS v2 Runtime Contract

HumanOS runtime describes the present state of a chat. It is the mutable layer that changes during play, not the durable card layer that defines who the person is.

Runtime is also the source layer for the narrative arc generator. The runtime contract provides the present-state inputs that become a one-page arc overview, first-message drafts, alternate openings, and lorebook updates.

## Runtime is not character truth

Runtime holds the things that are true right now:

- current scene
- immediate goal
- mood
- stress
- fatigue
- recent pressure
- active relationship state
- unresolved commitments
- temporary status markers

Runtime must not overwrite:

- character truth
- persona truth
- world truth
- lorebook truth
- relationship-save history

## What runtime should answer

Runtime should let the system say:

- what is happening now
- what has just changed
- what pressure is active
- what the current state means for the next reply
- what should be updated after the scene advances

## Dynamic metrics

Not every runtime metric is universal. A metric may change depending on:

- the character/persona combination
- the current story premise
- the immediate scene
- the relationship stage
- the mode of play
- the point in the scene arc

Examples:

- a trust value may rise faster in a slow-burn romance than in a hostile rivalry
- a fatigue value may matter more in a survival scenario than in a casual conversation
- a romance pressure meter may be irrelevant in a platonic route
- a focus or attention metric may matter more for an ADHD-flavored persona than for a disciplined warrior

The runtime contract should therefore describe metrics as scoped, not universal. Each metric needs a clear owner, a clear interpretation, and a clear update rule.

## Update contract

Runtime should be updated when canonical evidence changes. That means:

1. capture the current scene state
2. compare it against the current runtime snapshot
3. update only the fields that actually changed
4. keep a commit boundary tied to canonical evidence
5. preserve history so later changes can be explained

Do not rewrite runtime just because a new reply exists. Update it when the reply actually changes the current state.

## Suggested runtime shape

```md
# Runtime

## Scene State
{{where we are, what is happening, and what is immediately true}}

## Active Pressure
{{the strongest present tensions, needs, or risks}}

## Relationship State
{{current interpersonal state, trust, distance, attraction, conflict, or repair}}

## Temporary Conditions
{{fatigue, injuries, hunger, distraction, mood, or other scene-local conditions}}

## Relevant Recent Changes
{{what changed since the last committed runtime snapshot}}

## Update Notes
{{what should be refreshed after the next canonical turn}}
```

## HumanOS guardrails

- Runtime is chat-scoped.
- Runtime is mutable.
- Runtime is evidence-linked.
- Runtime is rebuilt from canonical turns, not guessed from vibe.
- Runtime should be compact enough to stay useful.
- Runtime may be projected into a narrative arc overview, but that projection is not the same thing as runtime truth itself.

## Relationship-aware guidance

The runtime layer should understand that dynamic metrics vary with:

- the pair or group involved
- the current trust level
- whether the scene is intimate, tense, casual, or procedural
- whether the persona is emotionally open or guarded
- whether the current scene is a first meeting, a slow burn, a rupture, a repair, or a settled phase

That keeps the system from acting like every relationship follows the same fixed staircase.
