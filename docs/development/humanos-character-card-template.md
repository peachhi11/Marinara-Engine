# HumanOS v2 Character Card Template

Use this template when asking an LLM to produce a readable character card from sparse notes, a persona draft, or a relationship sketch.

The goal is not to make the card longer. The goal is to make it more legible:

- one stable identity
- one clear role in the story
- one psychological engine
- one visible presentation
- one relationship pattern
- no mixing runtime with durable truth

## Writing contract for the LLM

When filling this template, the LLM should:

- write in plain prose, not a dump of bullet points
- keep appearance, psychology, and story role separate
- avoid repeating the same idea in multiple sections
- mark uncertain facts as unknown instead of inventing them
- describe behavior as tendencies, not guarantees
- keep runtime state out of the card unless the user explicitly asks for it
- preserve any established canon from the source material

## Output shape

The preferred output is a character card in this order:

1. Character name
2. Short identity description
3. Personality / psychological engine
4. Story role / scenario
5. Backstory / formative history
6. Appearance
7. Relationships
8. Speech style
9. Optional notes

## Template

```md
# {{character_name}}

## Identity
{{one-sentence identity that says who this person is and what function they serve in the story}}

## Personality
{{2-4 short paragraphs or a tight paragraph that explains temperament, emotional habits, defense style, decision style, and what makes them feel human}}

## Story Role
{{what role they play in the current story, setting, or premise}}

## Backstory
{{the minimum durable history needed to understand why they are this way}}

## Appearance
{{physical presentation, style, movement, and any details that matter for recognition}}

## Relationships
{{who matters to them, how they usually treat others, what they want from connection, and what they fear in connection}}

## Speech Style
{{how they sound: cadence, formality, humor, silence, and pressure behavior}}

## Optional Notes
{{only include if needed: contradictions, secrets, limits, or special prompts for future refinement}}
```

## HumanOS guardrails

If the source material is built from HumanOS, keep the layers separate:

- **Character Truth** goes in Identity, Personality, Appearance, Backstory, Relationships, and Speech Style.
- **Story Binding** goes in Story Role.
- **Runtime Truth** stays out of the card unless the user explicitly wants a current-state card.
- **World Truth** should only appear when the setting depends on it.

## Good example behavior

A good character card answer should feel like a person a reader can recognize immediately. It should tell us:

- what this person looks like
- what this person tends to do under pressure
- what this person believes about themselves
- how they move through relationships
- what kind of scene they belong in

It should not:

- restate the same trait in three different sections
- overexplain the writing process
- sound like a wiki entry with no emotional center
- force a dramatic arc that the source did not establish

## Suggested prompt wrapper

If you want to ask an LLM to fill the template, use a wrapper like this:

```md
You are generating a readable character card.

Rules:
- preserve established canon
- do not invent unknown facts
- keep identity, story, personality, appearance, and relationships distinct
- do not mix runtime scene details into the card
- prefer concise, emotionally legible prose
- if a field is unknown, say so

Fill the template below:

{{template}}
```

## If the source is sparse

When the source is thin, the LLM should only expand what is justified by the input.

Allowed expansion:

- consolidate overlapping traits
- infer likely emotional style from repeated behavior
- turn vague notes into readable prose

Not allowed:

- inventing a secret trauma to make the card sound deeper
- adding a backstory because the template has a backstory section
- turning a roleplay premise into permanent biography
