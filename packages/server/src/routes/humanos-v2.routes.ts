// ──────────────────────────────────────────────
// Routes: HumanOS v2 private architecture + committed Runtime
// ──────────────────────────────────────────────
import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { characters, messages, personas } from "../db/schema/index.js";
import type { Lorebook, LorebookEntry } from "@marinara-engine/shared";
import {
  createHumanOSArchitectureStorage,
  type HumanOSSubjectType,
} from "../services/storage/humanos-architecture.storage.js";
import { createHumanOSRuntimeStorage } from "../services/storage/humanos-runtime.storage.js";
import { createRelationshipSavesStorage, relationshipSaveTargetKey } from "../services/storage/relationship-saves.storage.js";
import { createLorebooksStorage } from "../services/storage/lorebooks.storage.js";

const subjectTypeSchema = z.enum(["CHARACTER", "USER_PERSONA"]);
const architectureSchema = z
  .object({
    schemaVersion: z.literal(2),
    subjectType: subjectTypeSchema,
    subjectId: z.string().min(1),
    taskMode: z.enum(["CREATE", "REFINE", "MATCH", "COMPILE"]),
    layers: z.record(z.string(), z.unknown()),
    facts: z.record(z.string(), z.unknown()),
    provenanceByPath: z.record(z.string(), z.unknown()),
    retrievalPolicy: z.record(z.string(), z.unknown()),
    compiledArtifacts: z.record(z.string(), z.unknown()),
    audit: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const relationshipSaveSchema = z
  .object({
    state: z.record(z.string(), z.unknown()),
    activeTruthCount: z.number().int().min(0).default(0),
    milestoneCount: z.number().int().min(0).default(0),
  })
  .strict();

const narrativeArcGenerateSchema = z
  .object({
    mode: z.enum(["character", "persona"]),
    character: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        personality: z.string().optional(),
        scenario: z.string().optional(),
      })
      .optional(),
    persona: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        personality: z.string().optional(),
        scenario: z.string().optional(),
      })
      .optional(),
    runtime: z.record(z.string(), z.unknown()).optional(),
    relationshipSave: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

const narrativeArcLorebookApplySchema = z
  .object({
    mode: z.enum(["character", "persona"]),
    variant: z.enum(["ALT", "BRANCH"]).default("ALT"),
    targetLorebookId: z.string().min(1),
    subject: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    linkedCharacter: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    draft: z.string().optional(),
    firstMessage: z.string().optional(),
    alternateOpenings: z.array(z.string()).optional(),
    lorebookHook: z.string().optional(),
  })
  .strict();

function nonEmpty(value: string | undefined | null) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function summarizeObject(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${(v as string).trim()}`);
  return entries.length > 0 ? entries.join("; ") : null;
}

function normalizeLineList(values: string[] | undefined): string[] {
  if (!Array.isArray(values)) return [];
  return values.map((value) => value.trim()).filter((value) => value.length > 0);
}

function buildNarrativeArcLorebookContent(input: {
  lorebookHook: string | null;
  firstMessage: string | null;
  alternateOpenings: string[];
}): string {
  const parts: string[] = [];
  if (input.lorebookHook) {
    parts.push("Narrative arc direction:");
    parts.push(input.lorebookHook);
  }
  if (input.firstMessage) {
    if (parts.length > 0) parts.push("");
    parts.push("First message seed:");
    parts.push(input.firstMessage);
  }
  if (input.alternateOpenings.length > 0) {
    if (parts.length > 0) parts.push("");
    parts.push("Alternate openings:");
    for (const opening of input.alternateOpenings) parts.push(`- ${opening}`);
  }
  return parts.join("\n").trim();
}

function narrativeArcEntryKey(identity: {
  mode: "character" | "persona";
  variant?: "ALT" | "BRANCH" | null;
  subjectId: string | null;
  subjectName: string | null;
  linkedCharacterId: string | null;
  linkedCharacterName: string | null;
}) {
  return JSON.stringify({
    kind: "humanos_narrative_arc",
    mode: identity.mode,
    variant: identity.variant ?? "ALT",
    subjectId: identity.subjectId,
    subjectName: identity.subjectName?.toLowerCase() ?? null,
    linkedCharacterId: identity.linkedCharacterId,
    linkedCharacterName: identity.linkedCharacterName?.toLowerCase() ?? null,
  });
}

function matchesNarrativeArcManagedEntry(
  entry: {
    tag?: string;
    dynamicState?: Record<string, unknown>;
  },
  identity: {
    mode: "character" | "persona";
    variant?: "ALT" | "BRANCH" | null;
    subjectId: string | null;
    subjectName: string | null;
    linkedCharacterId: string | null;
    linkedCharacterName: string | null;
  },
) {
  if (entry.tag !== "humanos:narrative-arc") return false;
  const dynamicState = entry.dynamicState;
  if (!dynamicState || typeof dynamicState !== "object") return false;
  const manager = dynamicState.humanosNarrativeArc;
  if (!manager || typeof manager !== "object") return false;
  const managerRecord = manager as Record<string, unknown>;
  if (managerRecord.kind !== "narrative_arc_projection") return false;
  return narrativeArcEntryKey({
    mode: managerRecord.mode === "persona" ? "persona" : "character",
    variant: managerRecord.variant === "BRANCH" ? "BRANCH" : "ALT",
    subjectId: typeof managerRecord.subjectId === "string" ? managerRecord.subjectId : null,
    subjectName: typeof managerRecord.subjectName === "string" ? managerRecord.subjectName : null,
    linkedCharacterId: typeof managerRecord.linkedCharacterId === "string" ? managerRecord.linkedCharacterId : null,
    linkedCharacterName:
      typeof managerRecord.linkedCharacterName === "string" ? managerRecord.linkedCharacterName : null,
  }) === narrativeArcEntryKey(identity);
}

function buildNarrativeArcDraft(input: z.infer<typeof narrativeArcGenerateSchema>) {
  const characterName = nonEmpty(input.character?.name) ?? "the character";
  const personaName = nonEmpty(input.persona?.name) ?? "the persona";
  const characterDetails = [input.character?.description, input.character?.personality, input.character?.scenario]
    .map(nonEmpty)
    .filter(Boolean)
    .join(" ");
  const personaDetails = [input.persona?.description, input.persona?.personality, input.persona?.scenario]
    .map(nonEmpty)
    .filter(Boolean)
    .join(" ");
  const runtimeSummary = summarizeObject(input.runtime) ?? "current runtime state";
  const relationshipSummary = summarizeObject(input.relationshipSave) ?? "relationship-save history";

  if (input.mode === "character") {
    const draft = [
      "# Narrative Arc Overview",
      "",
      "## Setup",
      `The story opens from ${characterName}'s built identity and the current scenario context.`,
      "",
      "## Escalation",
      `Pressure grows from ${characterName}'s established motives and the scene's immediate friction.`,
      "",
      "## Complication",
      "The next step introduces a cost, conflict, or emotional snag that slows the obvious path.",
      "",
      "## Turning Point",
      "A choice, reveal, or shift in pressure changes the direction of the scene.",
      "",
      "## Resolution / Transition",
      "The arc settles into a new steady state, ready for the next regeneration.",
      "",
      "## Current Runtime Notes",
      `Runtime focus: ${runtimeSummary}. Built from: ${characterDetails || "the character card."}`,
      "",
      "## Story Seeds",
      "- First message draft",
      "- Alternate opening",
      "- Narrative arc lorebook hook",
    ].join("\n");
    return {
      draft,
      firstMessage: `Open the scene from ${characterName}'s current pressure and let the story begin in motion.`,
      alternateOpenings: [
        `Start with ${characterName} already mid-stride in the current situation.`,
        `Start with the scene's tension visible before ${characterName} speaks.`,
      ],
      lorebookHook: `Use this arc to anchor runtime notes about ${characterName}'s current scene pressure and story direction.`,
    };
  }

  const draft = [
    "# Narrative Arc Overview",
    "",
    "## Setup",
    `The story opens from ${characterName}, ${personaName}, and the current relationship state.`,
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
    `Runtime focus: ${runtimeSummary}. Linked character: ${characterDetails || "none yet"}. Persona: ${personaDetails || "the current persona."}. Relationship save: ${relationshipSummary}.`,
    "",
    "## Story Seeds",
    "- Current runtime projection",
    "- Lorebook update target",
    "- Alternate opening point",
  ].join("\n");
  return {
    draft,
    firstMessage: `Open the scene from ${characterName} and ${personaName} already in the current pressure.`,
    alternateOpenings: [
      `Start with ${personaName} noticing the current shift in ${characterName}'s mood or intent.`,
      `Start with the shared tension already in motion between ${characterName} and ${personaName}.`,
    ],
    lorebookHook: `Use this arc to update the current runtime and any lorebook hooks for ${characterName} and ${personaName}.`,
  };
}

async function subjectExists(app: FastifyInstance, subjectType: HumanOSSubjectType, subjectId: string) {
  if (subjectType === "CHARACTER") {
    const rows = await app.db.select({ id: characters.id }).from(characters).where(eq(characters.id, subjectId)).limit(1);
    return Boolean(rows[0]);
  }
  const rows = await app.db.select({ id: personas.id }).from(personas).where(eq(personas.id, subjectId)).limit(1);
  return Boolean(rows[0]);
}

export async function humanosV2Routes(app: FastifyInstance) {
  const architectures = createHumanOSArchitectureStorage(app.db);
  const runtime = createHumanOSRuntimeStorage(app.db);
  const relationshipSaves = createRelationshipSavesStorage(app.db);
  const lorebooks = createLorebooksStorage(app.db);

  app.get("/architecture/:subjectType/:subjectId", async (req, reply) => {
    const params = z
      .object({ subjectType: subjectTypeSchema, subjectId: z.string().min(1) })
      .safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid subject" });
    const row = await architectures.get(params.data.subjectType, params.data.subjectId);
    if (!row) return reply.status(404).send({ error: "HumanOS architecture not found" });
    return { ...row, architecture: JSON.parse(row.architecture) as unknown };
  });

  app.put("/architecture/:subjectType/:subjectId", async (req, reply) => {
    const params = z
      .object({ subjectType: subjectTypeSchema, subjectId: z.string().min(1) })
      .safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid subject" });
    const parsed = architectureSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: "Invalid HumanOS architecture", details: parsed.error.flatten() });
    if (parsed.data.subjectType !== params.data.subjectType || parsed.data.subjectId !== params.data.subjectId) {
      return reply.status(409).send({ error: "Architecture subject does not match route subject" });
    }
    if (!(await subjectExists(app, params.data.subjectType, params.data.subjectId))) {
      return reply.status(404).send({ error: "Subject not found" });
    }
    const conflicted = Object.values(parsed.data.provenanceByPath).some(
      (value) => typeof value === "object" && value !== null && (value as { status?: unknown }).status === "CONFLICTED",
    );
    const row = await architectures.upsert({
      subjectType: params.data.subjectType,
      subjectId: params.data.subjectId,
      schemaVersion: 2,
      architecture: JSON.stringify(parsed.data),
    });
    return { ...row, architecture: parsed.data, compilationBlocked: conflicted };
  });

  app.delete("/architecture/:subjectType/:subjectId", async (req, reply) => {
    const params = z
      .object({ subjectType: subjectTypeSchema, subjectId: z.string().min(1) })
      .safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid subject" });
    await architectures.remove(params.data.subjectType, params.data.subjectId);
    return reply.status(204).send();
  });

  app.get("/runtime/:chatId", async (req, reply) => {
    const params = z.object({ chatId: z.string().min(1) }).safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid chat" });
    const row = await runtime.getLatestCommitted(params.data.chatId);
    if (!row) return reply.status(404).send({ error: "HumanOS Runtime not found" });
    return { ...row, state: JSON.parse(row.state) as unknown };
  });

  app.post("/narrative-arc/generate", async (req, reply) => {
    const parsed = narrativeArcGenerateSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid narrative arc payload", details: parsed.error.flatten() });
    }
    return buildNarrativeArcDraft(parsed.data);
  });

  app.post("/narrative-arc/apply-lorebook", async (req, reply) => {
    const parsed = narrativeArcLorebookApplySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid narrative arc lorebook payload", details: parsed.error.flatten() });
    }

    const targetLorebook = (await lorebooks.getById(parsed.data.targetLorebookId)) as Lorebook | null;
    if (!targetLorebook) {
      return reply.status(404).send({ error: "Target lorebook not found" });
    }

    const subjectName = nonEmpty(parsed.data.subject?.name);
    const linkedCharacterName = nonEmpty(parsed.data.linkedCharacter?.name);
    const firstMessage = nonEmpty(parsed.data.firstMessage);
    const lorebookHook = nonEmpty(parsed.data.lorebookHook);
    const alternateOpenings = normalizeLineList(parsed.data.alternateOpenings);
    const content = buildNarrativeArcLorebookContent({
      lorebookHook,
      firstMessage,
      alternateOpenings,
    });
    if (!content) {
      return reply.status(400).send({ error: "Narrative arc apply requires lorebook-ready content" });
    }

    const identity = {
      mode: parsed.data.mode,
      variant: parsed.data.variant,
      subjectId: nonEmpty(parsed.data.subject?.id),
      subjectName,
      linkedCharacterId: nonEmpty(parsed.data.linkedCharacter?.id),
      linkedCharacterName,
    };
    const description =
      parsed.data.mode === "character"
        ? `Managed HumanOS narrative arc projection (${parsed.data.variant}) for ${subjectName ?? "the character"}. Full draft stored in entry metadata.`
        : `Managed HumanOS narrative arc projection (${parsed.data.variant}) for ${subjectName ?? "the persona"} and ${linkedCharacterName ?? "the linked character"}. Full draft stored in entry metadata.`;
    const keys = Array.from(
      new Set(
        [
          subjectName,
          linkedCharacterName,
          "runtime arc",
          "narrative arc",
          `narrative arc ${parsed.data.variant.toLowerCase()}`,
          parsed.data.mode === "persona" ? "persona runtime arc" : "character runtime arc",
        ].filter((value): value is string => typeof value === "string" && value.trim().length > 0),
      ),
    );
    const managedState = {
      humanosNarrativeArc: {
        kind: "narrative_arc_projection",
        schemaVersion: 1,
        mode: parsed.data.mode,
        variant: parsed.data.variant,
        subjectId: identity.subjectId,
        subjectName,
        linkedCharacterId: identity.linkedCharacterId,
        linkedCharacterName,
        draft: parsed.data.draft ?? "",
        firstMessage: firstMessage ?? "",
        alternateOpenings,
        lorebookHook: lorebookHook ?? "",
        appliedAt: new Date().toISOString(),
      },
    };

    const existingEntries = (await lorebooks.listEntries(parsed.data.targetLorebookId)) as LorebookEntry[];
    const existing = existingEntries.find((entry) => matchesNarrativeArcManagedEntry(entry, identity)) ?? null;
    if (existing?.locked) {
      return reply.status(409).send({
        error: "NARRATIVE_ARC_TARGET_ENTRY_LOCKED",
        entryId: existing.id,
      });
    }

    const name =
      parsed.data.mode === "character"
        ? `${parsed.data.variant} Runtime Arc Projection`
        : `${parsed.data.variant} Persona Runtime Arc Projection`;

    if (existing) {
      const updated = await lorebooks.updateEntry(existing.id, {
        name,
        content,
        description,
        keys,
        enabled: true,
        constant: false,
        tag: "humanos:narrative-arc",
        dynamicState: managedState,
      });
      return {
        action: "updated" as const,
        lorebookId: parsed.data.targetLorebookId,
        lorebookName: targetLorebook.name,
        entry: updated,
      };
    }

    const created = await lorebooks.createEntry({
      lorebookId: parsed.data.targetLorebookId,
      name,
      content,
      description,
      keys,
      enabled: true,
      constant: false,
      tag: "humanos:narrative-arc",
      dynamicState: managedState,
    });
    return {
      action: "created" as const,
      lorebookId: parsed.data.targetLorebookId,
      lorebookName: targetLorebook.name,
      entry: created,
    };
  });

  // Runtime commits are agent-authored, post-canonical writes. The public HTTP
  // surface cannot supply their canonical coordinates or canonical-tool
  // authority. Keep reads public, but fail closed until a distinct manual-write
  // flow has explicit server-owned authority records.
  app.put("/runtime/:chatId", async (_req, reply) => {
    return reply.status(403).send({
      error: "HUMANOS_RUNTIME_SERVER_AUTHORITY_REQUIRED",
    });
  });

  app.get("/relationship-save/:chatId/:characterId/:personaId", async (req, reply) => {
    const params = z
      .object({ chatId: z.string().min(1), characterId: z.string().min(1), personaId: z.string().min(1) })
      .safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid relationship save identity" });
    const row = await relationshipSaves.get(params.data.chatId, params.data.characterId, params.data.personaId);
    if (!row) return reply.status(404).send({ error: "Relationship Save not found" });
    return { ...row, state: JSON.parse(row.state) as unknown };
  });

  app.put("/relationship-save/:chatId/:characterId/:personaId", async (req, reply) => {
    const params = z
      .object({ chatId: z.string().min(1), characterId: z.string().min(1), personaId: z.string().min(1) })
      .safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid relationship save identity" });
    const parsed = relationshipSaveSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: "Invalid Relationship Save payload", details: parsed.error.flatten() });
    const anchors = await app.db
      .select({ id: messages.id, content: messages.content, activeSwipeIndex: messages.activeSwipeIndex })
      .from(messages)
      .where(
        and(
          eq(messages.chatId, params.data.chatId),
          eq(messages.role, "assistant"),
          eq(messages.publicationStatus, "canonical"),
        ),
      )
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(1);
    const anchor = anchors[0];
    if (!anchor) return reply.status(409).send({ error: "RELATIONSHIP_SAVE_CANONICAL_EVIDENCE_UNAVAILABLE" });

    const current = await relationshipSaves.get(params.data.chatId, params.data.characterId, params.data.personaId);
    const state = JSON.stringify(parsed.data.state);
    const evidenceContentHash = createHash("sha256").update(anchor.content).digest("hex");
    const idempotencyKey = createHash("sha256")
      .update(
        JSON.stringify({
          schemaVersion: 1,
          target: [params.data.chatId, params.data.characterId, params.data.personaId],
          logicalPatchSlot: "relationship-save:manual",
          state: parsed.data.state,
          activeTruthCount: parsed.data.activeTruthCount,
          milestoneCount: parsed.data.milestoneCount,
          evidenceMessageId: anchor.id,
          evidenceSwipeIndex: anchor.activeSwipeIndex,
          evidenceContentHash,
          actorType: "user",
          actorId: "local-user",
          authorityPath: "manual_edit",
        }),
      )
      .digest("hex");
    const targetKey = relationshipSaveTargetKey(params.data.chatId, params.data.characterId, params.data.personaId);
    const committedBaseRevision = await relationshipSaves.getCommittedBaseRevision(idempotencyKey);
    const result = await relationshipSaves.commit({
      chatId: params.data.chatId,
      characterId: params.data.characterId,
      personaId: params.data.personaId,
      state,
      activeTruthCount: parsed.data.activeTruthCount,
      milestoneCount: parsed.data.milestoneCount,
      baseRevision: committedBaseRevision ?? current?.revision ?? 0,
      evidenceMessageId: anchor.id,
      evidenceSwipeIndex: anchor.activeSwipeIndex,
      evidenceContentHash,
      actorType: "user",
      actorId: "local-user",
      authorityPath: "manual_edit",
      explicitAuthority: {
        actorType: "user",
        actorId: "local-user",
        authorityPath: "manual_edit",
        targetKey,
        reason: "Manual Relationship Save update",
        issuedBy: "humanos-v2-http",
        authorizationKey: idempotencyKey,
      },
      idempotencyKey,
    });
    if (result.status === "revision_conflict") {
      return reply.status(409).send({
        error: "RELATIONSHIP_SAVE_REVISION_CONFLICT",
        expectedRevision: result.expectedRevision,
        currentRevision: result.currentRevision,
      });
    }
    if (result.status === "idempotency_conflict") return reply.status(409).send({ error: "RELATIONSHIP_SAVE_IDEMPOTENCY_CONFLICT" });
    const persisted = await relationshipSaves.get(params.data.chatId, params.data.characterId, params.data.personaId);
    if (!persisted) {
      throw new Error("Relationship Save projection missing after successful commit");
    }
    return {
      ...persisted,
      state: JSON.parse(persisted.state) as unknown,
      idempotentReplay: result.status === "replayed",
    };
  });

  app.get("/relationship-save/:chatId/:characterId/:personaId/checkpoints", async (req, reply) => {
    const params = z
      .object({ chatId: z.string().min(1), characterId: z.string().min(1), personaId: z.string().min(1) })
      .safeParse(req.params);
    if (!params.success) return reply.status(400).send({ error: "Invalid relationship save identity" });
    const rows = await relationshipSaves.listCheckpoints(params.data.chatId, params.data.characterId, params.data.personaId);
    return rows.map((row) => ({
      ...row,
      activeState: JSON.parse(row.activeState) as unknown,
      classifications: JSON.parse(row.classifications) as unknown,
      sourceCommitIds: JSON.parse(row.sourceCommitIds) as unknown,
      messageHashes: JSON.parse(row.messageHashes) as unknown,
    }));
  });

  app.post("/relationship-save/:chatId/:characterId/:personaId/checkpoint", async (_req, reply) => {
    return reply.status(403).send({
      error: "RELATIONSHIP_CHECKPOINT_SERVER_AUTHORITY_REQUIRED",
    });
  });
}
