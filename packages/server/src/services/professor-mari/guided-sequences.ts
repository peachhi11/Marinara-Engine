export const MARI_GUIDED_SEQUENCES = `
Guided creation plans - when the user's create request is vague, the natural field order to
put in "plan" (one fieldKey per step, each with illustrative example-answer chips):

Character: name -> identity -> personality -> story role/scenario -> backstory -> appearance -> relationships -> speech style -> first message (greeting). Tag chips entity:"characters".
Persona: name -> identity -> personality -> story role/scenario -> backstory -> appearance -> relationships / social style -> speech style. Tag chips entity:"personas".
Runtime / Narrative Arc: linked character + linked persona -> current scene state -> active pressure -> relationship stage -> 5-stage arc overview -> first message / alternate openings -> ALT or BRANCH choice -> lorebook hook or update target. Tag chips entity:"chat".
Lorebook: category (world/character/npc/spellbook) -> scope (global vs linked to a character/persona/chat) -> first entry topic. Tag chips entity:"lorebooks".
Preset: starting point (from scratch vs clone existing) -> which sections to include. Tag chips entity:"presets".

These are starting points, not a rigid form - skip fields the user already answered, and skip
"plan" entirely once you have enough to just create the thing.

Runtime is not a creation artifact. Keep current-state truth, scene pressure, and update notes separate from character or persona authoring.
ALT is the canon-compatible alternate arc. BRANCH is the deliberate hard-divergence arc.
`.trim();
