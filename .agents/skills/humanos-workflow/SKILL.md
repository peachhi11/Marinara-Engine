---
name: humanos-workflow
description: Use when the task is specifically about HumanOS design, refinement, evaluation, or integration. Covers HumanOS as a character-card, persona-matching, lorebook, runtime, and reviewer system rather than just a single prompt. Use it for layer design, prompt decomposition, memory boundaries, evaluator design, context-budget decisions, HumanOS-to-Marinara mapping, and converting HumanOS ideas into usable cards, personas, lorebooks, or app workflows.
---

# Humanos Workflow

## Overview

Use this skill to route HumanOS work through the right sequence: architecture first, boundaries second, prompts third, evaluation fourth, implementation fifth.

Treat HumanOS as a system with distinct jobs. Do not collapse authoring rules, runtime rules, memory, reviewer logic, and UI workflow into one blurred instruction block unless the task explicitly calls for a minimal prototype.

## What HumanOS is in this workflow

HumanOS should usually be treated as five connected surfaces:

1. Authoring system
   - character cards
   - personas
   - lorebooks
   - relationship and world inputs

2. Runtime system
   - what the model sees during generation
   - what is mutable during play
   - what is canonical truth vs proposed state

3. Memory and retrieval system
   - what stays always on
   - what becomes retrieval
   - what becomes summary or audit history

4. Evaluation system
   - how continuity, viewpoint, consent, pacing, and character consistency are scored
   - what constitutes drift, contradiction, or failure

5. Integration system
   - how HumanOS maps into Marinara fields, lorebooks, skills, prompts, agents, and review flows

If the user is mixing these surfaces together, separate them before rewriting anything.

## Recommended skill order

Use these skills in this order unless the task is extremely narrow:

1. `$ai-agents-architect`
   - Use first for layer separation, role design, and orchestration.

2. `$agent-memory-systems`
   - Use next to decide what belongs in card, lorebook, runtime, world, summary, or private architecture.

3. `$prompt-engineering`
   - Use after the architecture exists, not before.

4. `$context-window-management`
   - Use to trim the always-on payload and decide what becomes retrieval or summary.

5. `$agent-evaluation`
   - Use to define scorecards, reviewer prompts, and failure criteria.

6. `$systematic-debugging`
   - Use when the implemented behavior does not match the intended architecture.

7. `$character-card-v3-generator`
   - Use when the outcome should become a real authoring artifact.

8. `$marinara-professor-mari-workbench`
   - Use when the HumanOS task must be implemented or debugged inside Marinara specifically.

## Workflow

### Step 1: Classify the HumanOS task

Start by naming which of these the task actually is:

- concept design
- prompt rewrite
- truth-layer design
- evaluation design
- card or lorebook authoring
- app integration
- regression or behavior bug

Do not solve an evaluation problem with prompt bloat. Do not solve a boundary problem with style edits.

### Step 2: Define the truth layers

Before editing prompts, decide:

- what is immutable canon
- what is mutable runtime state
- what is world state
- what is relationship state
- what is authoring-only private architecture
- what should never be injected raw into generation

If a piece of information does not fit a first-class field cleanly, consider whether it belongs in a linked lorebook or a reviewer-side reference instead of forcing it into the hot prompt.

### Step 3: Separate authoring from runtime

HumanOS often fails when authoring guidance is treated like generation-time instruction.

Keep separate:

- authoring guidance for building cards and personas
- runtime instructions for the active scene
- reviewer instructions for analysis or correction
- workspace or app commands

If the user is creating a persona or character, optimize for authoring clarity and provenance.
If the user is running live scene behavior, optimize for scoped runtime clarity and continuity.

### Step 4: Design the evaluation loop

HumanOS needs an explicit quality loop.

At minimum, define checks for:

- continuity
- viewpoint integrity
- character consistency
- consent and established boundaries
- causal plausibility
- pacing and scene weight
- drift between intended and actual behavior

Prefer concrete scoring and correction instructions over vague “be better” reviewer language.

### Step 5: Minimize the hot context

Use `$context-window-management` to decide:

- always-on instructions
- optional genre or style material
- retrieval-only lorebook material
- summary-only history
- hidden architecture that should stay out of prompts

HumanOS usually improves when the active prompt becomes smaller and sharper.

### Step 6: Convert to deliverables

Choose the right output surface:

- card fields for stable identity and visible canon
- lorebooks for overflow, retrieval, and secondary structures
- reviewer prompts for QC and audit modes
- runtime prompts for live play behavior
- Marinara skills or presets for reusable app behavior

Use `$character-card-v3-generator` when you need finished card, persona, or lorebook outputs.

## Anti-patterns

Avoid these failure modes:

- turning HumanOS into a single giant master prompt
- mixing authoring instructions with live runtime instructions
- storing everything in always-on context
- inventing technical layer names without assigning clear authority
- using style polish to hide structural ambiguity
- treating reviewer output as canon without a commit boundary
- assuming a lorebook is valid because the title or link looks correct

## Deliverable shapes

For analysis tasks, report:

```text
Surface: <authoring | runtime | memory | evaluation | integration>
Problem: <one sentence>
Current failure: <what is colliding or drifting>
Correction: <what to separate, move, trim, or redesign>
Output: <what artifact should be changed>
```

For build tasks, report:

```text
Layer: <what changed>
Owner: <prompt, lorebook, card, reviewer, app flow, runtime state>
Why: <what this fixes>
Verified: <what was actually tested>
Risk: <remaining gap or none>
```
