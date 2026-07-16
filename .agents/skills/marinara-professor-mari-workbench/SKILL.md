---
name: marinara-professor-mari-workbench
description: Use when the task is specifically about Marinara Engine or Professor Mari and needs the right working lane instead of a generic coding approach. Covers Professor Mari protocol/tool-call failures, Home UI behavior, lorebook ownership or linking mistakes, character/persona/lorebook authoring flows, prompt and runtime routing, workspace-agent behavior, scene-summary quality, and Marinara-specific review or shipping passes. Use it to route the task to the best local and installed skills, inspect the real Marinara surfaces first, and keep changes narrow and validated.
---

# Marinara Professor Mari Workbench

## Overview

Use this skill as the local routing layer for Marinara Engine work, especially when the task involves Professor Mari, Home UI behavior, lorebooks, prompt/runtime wiring, or agent workflow changes.

This skill does not replace repo rules. Follow `AGENTS.md`, `CONTRIBUTING.md`, and the actual owning files first, then use the routing below to pick the right working lane.

## Start here

Before editing or claiming a fix:

1. Inspect the real Marinara surface first.
2. Name the user-facing symptom or outcome in one sentence.
3. Identify the owner before editing the nearest caller.
4. Keep changes narrow and validate the touched path.
5. Leave unrelated dirty files alone.

Prefer these repo surfaces when relevant:

- `packages/server/src/services/professor-mari/`
- `packages/server/src/services/mari-db/`
- `packages/server/data/.mari-workspace/skills/`
- `packages/client/src/` and `packages/client/.instructions.md`
- `docs/home/`
- `docs/lorebooks/`

## Routing lanes

### 1. Bugfix and regression lane

Use this when something is broken, inconsistent, looping, linking the wrong record, returning the wrong envelope, or silently falling back.

- Start with `$systematic-debugging`.
- Use `$lint-and-validate` before calling the fix done.
- If the bug is UI-visible, pair with `$browser-automation`.

Best fits:

- Professor Mari command/runtime failures
- tool-call or JSON envelope failures
- wrong lorebook linking or scope behavior
- settings toggles that do not persist
- scene-summary or workflow regressions

### 2. UI and interaction lane

Use this when the task is about Home UI, layout, form behavior, chat ergonomics, empty states, readability, or interaction quality.

- Start with repo-local `$impeccable` for frontend shaping and critique.
- Use `$ui-ux-pro-max` for secondary UX review when needed.
- Use `$frontend-design` or `$frontend-developer` only after the owning UI surface is clear.
- Read `packages/client/.instructions.md` before editing client code.

Best fits:

- Professor Mari Home UI prompt behavior
- input box growth, layout polish, chip behavior
- settings flow clarity
- conversation UI issues that affect tool reliability

### 3. Lorebook, character, and persona lane

Use this when the task is about creating, auditing, fixing, or exporting lorebooks, character cards, personas, or related prompt assets.

- Prefer the actual Marinara data and UI state over assumptions.
- Inspect ownership, IDs, linking rules, and entry content before claiming anything about a lorebook.
- Use `$character-card-v3-generator` when the deliverable is a real authoring artifact rather than a code change.

Best fits:

- character lorebook creation or audit
- persona and character matching flows
- Professor Mari content-generation skill tuning
- retrieval-facing lorebook structure decisions

### 4. Prompt, runtime, and agent architecture lane

Use this when the task is about prompt assembly, command envelopes, tool routing, context pressure, agent orchestration, memory, or Professor Mari behavior design.

- Start with `$prompt-engineering` for prompt-shape work.
- Use `$ai-agents-architect` for workflow, routing, or controller decisions.
- Use `$agent-memory-systems` for persistence and context-boundary design.
- Use `$agent-evaluation` when the question is whether the behavior is actually good, stable, or measurable.
- Use `$llm-app-patterns` and `$context-window-management` for local-model and context-budget tradeoffs.

Best fits:

- Professor Mari returning plain prose instead of a command object
- agent/prose model separation decisions
- scene-summary quality and summarization behavior
- HumanOS-style workflow integration into Marinara

### 5. Shipping and review lane

Use this when the task is to wrap up verified work cleanly.

- Use `$commit` for commit hygiene.
- Use `$create-pr` only when preparing a real PR.
- Use `$receiving-code-review` when auditing a diff or tightening a ship report.

Keep release steps separate from active debugging unless the user explicitly wants both in one pass.

## Guardrails

- Do not use generic UI polish as a substitute for fixing wrong server, data, or prompt ownership.
- Do not claim lorebook integrity from names alone. Check entries, IDs, scope, and linked records.
- Do not treat Professor Mari output style as success if the command protocol failed.
- Do not let a helper preset or roleplay tone override tool reliability requirements.
- Prefer the lowest correct owner over caller-side band-aids.
- When the task touches user data, linking, import/export, or runtime persistence, prove the exact affected path before reporting done.

## Handoff pattern

For a non-trivial Marinara task, report back in this shape:

```text
Lane: <bugfix | ui | lorebook | prompt-runtime | shipping>
Owner: <files or subsystem>
Did: <what changed or what was learned>
Verified: <commands, UI checks, or exact proof gap>
Risk: <none or remaining gap>
```
