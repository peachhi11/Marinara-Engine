# HumanOS v2 Persona Template

Use this template when asking an LLM to produce a readable persona from sparse notes, a roleplay self-insert, or a user identity draft.

The point is to keep persona truth separate from character truth:

- A persona is the user-controlled identity in the chat
- A character is the other person in the story
- Runtime belongs to the current chat, not the card
- World truth only appears when the setting requires it

## Writing contract for the LLM

When filling this template, the LLM should:

- Write plain prose that is easy to scan
- Keep identity, personality, appearance, and story context separate
- Avoid turning one trait into five near-duplicate sentences
- Preserve established canon or user-supplied preferences
- Mark unknowns as unknown rather than inventing them
- Keep live scene state out of the persona card
- Treat the persona as a stable participant, not a temporary mood board

## Output shape

The preferred output is a persona card in this order:

1. Persona name
2. Identity
3. Personality
4. Story role / scenario
5. Backstory
6. Appearance
7. Relationships / social style
8. Speech style
9. Optional notes

## Template

```md
# {{persona_name}}

## Identity
{{one-sentence identity that says who the user is in this chat and what role they occupy}}

## Personality
{{2-4 short paragraphs or a tight paragraph that explains temperament, values, habits, emotional patterns, and what makes them feel human}}

## Story Role
{{the default context or situation the persona belongs to}}

## Backstory
{{the minimum durable history needed to understand why this persona is this way}}

## Appearance
{{physical presentation, style, and details the model should remember}}

## Relationships
{{how the persona relates to other people, what they tend to want from connection, and what they avoid}}

## Speech Style
{{how they sound: cadence, formality, humor, silence, and pressure behavior}}

## Optional Notes
{{only include if needed: contradictions, limits, special instructions, or unresolved details}}
```

## HumanOS guardrails

If the source material is built from HumanOS, keep the layers separate:

- **Persona Truth** goes in Identity, Personality, Appearance, Backstory, Relationships, and Speech Style.
- **Story Binding** goes in Story Role.
- **Runtime Truth** stays out of the card unless the user explicitly wants a current-state persona.
- **World Truth** should only appear when the setting depends on it.

## Useful defaults

A good persona answer should tell us:

- Who this person is
- How they normally behave
- What kind of role they occupy in the story
- What they care about in connection
- How they sound when calm, stressed, or affectionate

If the source is sparse, expand only what the source supports. Don't invent a dramatic secret just because the template has a backstory section.

## Suggested prompt wrapper

```md
You are generating a readable persona card.

Rules:
- preserve established canon
- do not invent unknown facts
- keep persona, character, scenario, and runtime separate
- prefer concise, emotionally legible prose
- if a field is unknown, say so

Fill the template below:

{{template}}
```
