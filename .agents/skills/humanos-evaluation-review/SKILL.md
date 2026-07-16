---
name: humanos-evaluation-review
description: Use when the task is to review, score, debug, or diagnose HumanOS behavior rather than continue generation. Covers consistency scoring, drift detection, contradiction checks, viewpoint integrity, consent and boundary handling, pacing stability, expected-vs-actual behavior, and analysis of the most recent N roleplay turns. Use it for OOC review modes, QA passes, reviewer prompt design, and HumanOS failure diagnosis.
---

# Humanos Evaluation Review

## Overview

Use this skill when HumanOS needs a reviewer brain instead of a composer brain.

The goal is to judge what happened, name why it failed or succeeded, and recommend the smallest useful correction. Do not continue the scene while this skill is active unless the user explicitly asks to exit review mode.

## Review modes

### SCORE_SYSTEM=consistency

Score each category from 1 to 10. For each category:

- give the score
- cite one concrete example
- give one corrective instruction

Default categories:

- continuity
- viewpoint integrity
- character consistency
- consent and boundaries
- causal plausibility
- pacing stability
- tone/style stability

If a category is not applicable, say so briefly instead of faking a score.

### DEBUG_REPORT

Diagnose the full available roleplay or HumanOS context. Separate findings into:

- confirmed problems
- probable drift
- insufficient-context concerns

Do not continue the scene.

This mode is for root-cause diagnosis, not for performing in-character repair.

### ANALYZE_LAST_N

Review only the requested number of recent turns.

Report:

- concrete strengths
- drift
- contradictions
- corrections
- brief textual evidence

Respect the requested scope. Do not silently pull in older turns unless the user explicitly asks for a full-context review.

### NEXT_SCENE

When the user asks for next-scene planning, provide:

- `<world>`
- `<setting>`
- `<relationship_dynamic_update>`
- `<plot_hook>`
- `<scenario_setting>`

Keep this forward-looking and scene-usable, not essayistic.

### SUMMARISE_RP

Provide:

- major events
- character developments
- relationship developments
- emotional beats
- unresolved tensions
- active plot threads
- current scene status

## Review workflow

### Step 1: Identify the evaluation surface

Name what is being reviewed:

- prompt design
- authored card or lorebook
- live roleplay output
- recent turn sample
- full-context behavior
- HumanOS reviewer system itself

Do not mix all surfaces together unless the user explicitly wants a holistic diagnosis.

### Step 2: Lock the scope

Before scoring or diagnosing, state the scope mentally:

- full available context
- last N turns
- one response
- one subsystem

If the scope is narrow, do not overclaim broad conclusions.

### Step 3: Judge against concrete standards

When evaluating scene or roleplay behavior, prefer these standards:

- continuity takes priority over novelty
- user agency, consent, and established boundaries outrank style flourish
- viewpoint should remain stable when the system requires a locked POV
- character behavior should remain causally plausible
- response length should match dramatic weight

When evaluating HumanOS architecture, prefer these standards:

- clear layer ownership
- minimal hot-context pressure
- explicit authority boundaries
- reviewer logic separated from composer logic
- no fake certainty from underspecified data

### Step 4: Cite evidence

Every meaningful criticism should point to a concrete example:

- a contradiction
- a repeated drift pattern
- a missing expected behavior
- an overreach beyond provided user behavior
- a tone or pacing mismatch

Prefer short evidence references over long quotation blocks.

### Step 5: Give the smallest useful correction

Corrections should be actionable.

Good corrections:

- lock narration back to `{{char}}` only
- move this psychology note into lorebook instead of always-on prompt
- cut this reviewer language into one explicit scoring rule
- separate consent checking from flirtation style guidance

Weak corrections:

- make it better
- be more consistent
- write more naturally

## Anti-patterns

Avoid these reviewer failures:

- continuing the RP when the user asked for review mode
- giving style praise while ignoring contradictions
- scoring categories without evidence
- diagnosing the whole system from one turn
- treating missing context as proof of failure
- confusing “morally messy content” with “incoherent characterization”

## Output shapes

For scoring:

```text
Category: <name>
Score: <1-10>
Example: <specific evidence>
Correction: <one targeted instruction>
```

For debug reports:

```text
Confirmed problems:
- ...

Probable drift:
- ...

Insufficient-context concerns:
- ...
```

For last-N analysis:

```text
Strengths:
- ...

Drift:
- ...

Contradictions:
- ...

Corrections:
- ...
```
