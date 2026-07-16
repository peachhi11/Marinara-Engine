import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, PencilLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { api } from "../../lib/api-client";

export function NarrativeGeneratorTab({
  mode,
  locked,
  subjectId,
  subjectName,
  subjectDescription,
  subjectPersonality,
  subjectScenario,
  linkedCharacterId,
  linkedCharacterName,
  linkedCharacterDescription,
  linkedCharacterPersonality,
  linkedCharacterScenario,
  runtime,
  relationshipSave,
  targetLorebookId,
}: {
  mode: "character" | "persona";
  locked: boolean;
  subjectId?: string | null;
  subjectName?: string | null;
  subjectDescription?: string | null;
  subjectPersonality?: string | null;
  subjectScenario?: string | null;
  linkedCharacterId?: string | null;
  linkedCharacterName?: string | null;
  linkedCharacterDescription?: string | null;
  linkedCharacterPersonality?: string | null;
  linkedCharacterScenario?: string | null;
  runtime?: Record<string, unknown> | null;
  relationshipSave?: Record<string, unknown> | null;
  targetLorebookId?: string | null;
}) {
  const title = mode === "character" ? "Runtime Narrative Generator" : "Persona Narrative Generator";
  const storageKey = useMemo(
    () =>
      [
        "humanos-narrative-arc-draft",
        mode,
        subjectName?.trim() || "",
        linkedCharacterName?.trim() || "",
      ].join(":"),
    [linkedCharacterName, mode, subjectName],
  );
  const seed = useMemo(() => {
    const subjectLine = subjectName?.trim() || (mode === "character" ? "the character" : "the persona");
    const characterLine = linkedCharacterName?.trim() || "the linked character";
    const characterDetails = [linkedCharacterDescription, linkedCharacterPersonality, linkedCharacterScenario]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ");
    const subjectDetails = [subjectDescription, subjectPersonality, subjectScenario]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ");

    if (mode === "character") {
      return [
        "# Narrative Arc Overview",
        "",
        "## Setup",
        `The story opens from ${subjectLine}'s built identity and the current scenario context.`,
        "",
        "## Escalation",
        `Pressure grows from ${subjectLine}'s established motives and the scene's immediate friction.`,
        "",
        "## Complication",
        "The next step introduces a cost, conflict, or emotional snag that slows the obvious path.",
        "",
        "## Turning Point",
        "A choice, reveal, or shift in pressure changes the direction of the scene.",
        "",
        "## Resolution / Transition",
        "The arc resolves into a new steady state, ready for the next regeneration.",
        "",
        "## Current Runtime Notes",
        `Track present-state truth here, not durable card truth. Built from: ${subjectDetails || "the character card."}`,
        "",
        "## Story Seeds",
        "- First message draft",
        "- Alternate opening",
        "- Narrative arc lorebook hook",
      ].join("\n");
    }

    return [
      "# Narrative Arc Overview",
      "",
      "## Setup",
      `The story opens from ${characterLine}, ${subjectLine}, and the current relationship state.`,
      "",
      "## Escalation",
      "The shared scene pressure begins to sharpen around the current pairing.",
      "",
      "## Complication",
      "A meaningful obstacle, misunderstanding, or emotional cost enters the arc.",
      "",
      "## Turning Point",
      "The pairing changes direction through a choice, reveal, or decisive beat.",
      "",
      "## Resolution / Transition",
      "The arc settles into a new phase and can be regenerated later.",
        "",
        "## Current Runtime Notes",
        `Blend character truth, persona truth, runtime truth, and relationship-save state here. Linked character: ${characterDetails || "none yet"}. Persona: ${subjectDetails || "the current persona."}`,
        "",
        "## Story Seeds",
        "- Current runtime projection",
      "- Lorebook update target",
      "- Alternate opening point",
    ].join("\n");
  }, [
    linkedCharacterDescription,
    linkedCharacterName,
    linkedCharacterPersonality,
    linkedCharacterScenario,
    mode,
    subjectDescription,
    subjectName,
    subjectPersonality,
    subjectScenario,
  ]);
  const [draft, setDraft] = useState(seed);
  const [firstMessage, setFirstMessage] = useState<string>("");
  const [alternateOpenings, setAlternateOpenings] = useState<string[]>([]);
  const [lorebookHook, setLorebookHook] = useState<string>("");
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [applyingLorebook, setApplyingLorebook] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved) setDraft(saved);
    } catch {
      // Ignore storage failures and fall back to the live seed.
    }
  }, [storageKey]);

  const handleGenerate = async () => {
    if (locked || generating) return;
    setGenerating(true);
    try {
      const result = await api.post<{
        draft: string;
        firstMessage: string;
        alternateOpenings: string[];
        lorebookHook: string;
      }>("/humanos-v2/narrative-arc/generate", {
        mode,
        character:
          mode === "character"
            ? {
                name: subjectName ?? undefined,
                description: subjectDescription ?? undefined,
                personality: subjectPersonality ?? undefined,
                scenario: subjectScenario ?? undefined,
              }
            : {
                name: linkedCharacterName ?? undefined,
                description: linkedCharacterDescription ?? undefined,
                personality: linkedCharacterPersonality ?? undefined,
                scenario: linkedCharacterScenario ?? undefined,
              },
        persona:
          mode === "persona"
            ? {
                name: subjectName ?? undefined,
                description: subjectDescription ?? undefined,
                personality: subjectPersonality ?? undefined,
                scenario: subjectScenario ?? undefined,
              }
            : undefined,
        runtime: runtime ?? undefined,
        relationshipSave: relationshipSave ?? undefined,
      });
      setDraft(result.draft);
      setFirstMessage(result.firstMessage);
      setAlternateOpenings(Array.isArray(result.alternateOpenings) ? result.alternateOpenings : []);
      setLorebookHook(result.lorebookHook);
      try {
        window.sessionStorage.setItem(storageKey, result.draft);
      } catch {
        // Ignore storage failures.
      }
      setLastGeneratedAt(new Date().toLocaleString());
      toast.success("Generated narrative arc draft.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePersistDraft = () => {
    if (locked) return;
    try {
      window.sessionStorage.setItem(storageKey, draft);
      toast.success("Saved the current draft for this editor session.");
    } catch {
      toast.error("Could not save the draft in this browser session.");
    }
  };

  const handleApplyToActiveLorebook = async (variant: "ALT" | "BRANCH") => {
    if (locked || !targetLorebookId || generating || applyingLorebook) return;
    setApplyingLorebook(true);
    try {
      const result = await api.post<{
        action: "created" | "updated";
        lorebookId: string;
        lorebookName?: string | null;
        entry?: { id?: string };
      }>("/humanos-v2/narrative-arc/apply-lorebook", {
        mode,
        variant,
        targetLorebookId,
        subject: {
          ...(subjectId ? { id: subjectId } : {}),
          ...(subjectName?.trim() ? { name: subjectName.trim() } : {}),
        },
        linkedCharacter: {
          ...(linkedCharacterId ? { id: linkedCharacterId } : {}),
          ...(linkedCharacterName?.trim() ? { name: linkedCharacterName.trim() } : {}),
        },
        draft,
        firstMessage,
        alternateOpenings,
        lorebookHook,
      });
      const targetName = result.lorebookName?.trim() || "the active lorebook";
      toast.success(
        result.action === "updated"
          ? `Updated the narrative arc entry in ${targetName}.`
          : `Applied the narrative arc to ${targetName}.`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not apply the narrative arc to the active lorebook.");
    } finally {
      setApplyingLorebook(false);
    }
  };

  const copyText = async (value: string, label: string) => {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard.`);
    } catch {
      toast.error(`Could not copy the ${label.toLowerCase()}.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="max-w-3xl text-sm text-[var(--muted-foreground)]">
          Runtime now acts as the story projection layer. This surface turns character truth, persona truth,
          relationship state, and current scene pressure into a readable 5-stage arc instead of a raw state dump.
        </p>
      </div>

      <div
        className={cn(
          "rounded-2xl border p-4 shadow-sm",
          locked
            ? "border-amber-500/25 bg-amber-500/8"
            : "border-[var(--border)] bg-[var(--card)]",
        )}
      >
        {locked ? (
          <div className="flex items-start gap-3">
            <AlertTriangle size="1rem" className="mt-0.5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <div className="text-sm font-semibold text-amber-500">Locked until a character is selected</div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Pick a character first, then the generator can blend the pairing into a usable runtime arc.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size="0.95rem" className="text-[var(--primary)]" />
              <span>Ready to generate</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {mode === "character"
                ? "Generate runtime from the built character plus scenario context, then draft first-message seeds, alternate openings, and narrative-arc lorebook hooks."
                : `Generate a blended runtime arc from the selected character${linkedCharacterName ? ` (${linkedCharacterName})` : ""}, your persona, and the current relationship save.`}
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Output</div>
                <div className="mt-1 text-sm font-medium">1-page 5-stage arc overview</div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Downstream</div>
                <div className="mt-1 text-sm font-medium">First messages and lorebook hooks</div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Loop</div>
                <div className="mt-1 text-sm font-medium">Regenerate after the arc advances</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={locked || generating}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size="0.9rem" />
            <span>{generating ? "Generating..." : "Generate runtime arc"}</span>
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 text-sm">
            <PencilLine size="0.875rem" className="text-[var(--primary)]" />
            <span>Editable before commit</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 text-sm">
            <ArrowRight size="0.875rem" className="text-[var(--primary)]" />
            <span>Feeds ALT, BRANCH, runtime, and lorebook updates</span>
          </div>
        </div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={locked}
          className="min-h-[24rem] w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Narrative arc draft"
          placeholder="Generate a runtime arc to edit it here."
        />

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                First Message
              </div>
              <button
                type="button"
                onClick={() => void copyText(firstMessage, "First message")}
                disabled={!firstMessage.trim() || locked}
                className="text-xs font-medium text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
              {firstMessage || "Generate to see a first-message draft."}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Alternate Openings
              </div>
              <button
                type="button"
                onClick={() => void copyText(alternateOpenings.join("\n"), "Alternate openings")}
                disabled={alternateOpenings.length === 0 || locked}
                className="text-xs font-medium text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy
              </button>
            </div>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--foreground)]">
              {alternateOpenings.length > 0 ? (
                alternateOpenings.map((opening) => <li key={opening}>• {opening}</li>)
              ) : (
                <li>Generate to see alternate opening points.</li>
              )}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Lorebook Hook
              </div>
              <button
                type="button"
                onClick={() => void copyText(lorebookHook, "Lorebook hook")}
                disabled={!lorebookHook.trim() || locked}
                className="text-xs font-medium text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
              {lorebookHook || "Generate to see a lorebook-ready hook."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span>Five-stage arc overview</span>
          <span>•</span>
          <span>First-message seeds</span>
          <span>•</span>
          <span>Lorebook hooks</span>
          {lastGeneratedAt ? (
            <>
              <span>•</span>
              <span>Last generated {lastGeneratedAt}</span>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={locked || generating || applyingLorebook || !targetLorebookId}
            onClick={() => void handleApplyToActiveLorebook("ALT")}
            title={targetLorebookId ? "Apply the canon-compatible ALT arc to the active lorebook" : "No lorebook target"}
            className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applyingLorebook ? "Applying..." : "Apply ALT"}
          </button>
          <button
            type="button"
            disabled={locked || generating || applyingLorebook || !targetLorebookId}
            onClick={() => void handleApplyToActiveLorebook("BRANCH")}
            title={targetLorebookId ? "Apply the hard-divergence BRANCH arc to the active lorebook" : "No lorebook target"}
            className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applyingLorebook ? "Applying..." : "Apply BRANCH"}
          </button>
          <button
            type="button"
            disabled={locked || generating}
            onClick={handlePersistDraft}
            className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save session draft
          </button>
        </div>
      </div>
    </div>
  );
}
