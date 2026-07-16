import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import Fastify from "fastify";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { Lorebook, LorebookEntry } from "@marinara-engine/shared";
import type { DB } from "../../../db/connection.js";
import * as schema from "../../../db/schema/index.js";
import { runMigrations } from "../../../db/migrate.js";
import { humanosV2Routes } from "../../../routes/humanos-v2.routes.js";
import { createLorebooksStorage } from "../../storage/lorebooks.storage.js";

async function createRouteFixture() {
  const tempDir = mkdtempSync(join(tmpdir(), "marinara-humanos-arc-lorebook-"));
  const client = createClient({ url: `file:${join(tempDir, "humanos-arc.db")}` });
  const db = drizzle(client, { schema }) as unknown as DB;
  await runMigrations(db);
  const app = Fastify({ logger: false });
  app.decorate("db", db);
  await app.register(humanosV2Routes, { prefix: "/api/humanos-v2" });
  await app.ready();
  return {
    app,
    db,
    client,
    lorebooks: createLorebooksStorage(db),
    async cleanup() {
      await app.close();
      client.close();
      rmSync(tempDir, { recursive: true, force: true });
    },
  };
}

function payload(overrides: Record<string, unknown> = {}) {
  return {
    mode: "character",
    targetLorebookId: "target-lorebook-id",
    subject: { id: "char-1", name: "Ava Vale" },
    draft: "# Narrative Arc Overview\n\n## Setup\nA setup draft.",
    firstMessage: "Open with Ava already under pressure.",
    alternateOpenings: ["Start with the conflict already visible.", "Start with Ava interrupting the silence."],
    lorebookHook: "Ava's current arc is defined by rising public pressure and private restraint.",
    ...overrides,
  };
}

test("narrative arc apply creates a managed active-lorebook entry with durable metadata", async () => {
  const fixture = await createRouteFixture();
  try {
    const lorebook = (await fixture.lorebooks.create({
      name: "Runtime Notes",
      description: "Active runtime projections",
      category: "character",
      enabled: true,
    })) as Lorebook | null;
    assert.ok(lorebook);

    const response = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({ targetLorebookId: lorebook!.id }),
    });
    assert.equal(response.statusCode, 200, response.body);
    assert.equal(response.json().action, "created");

    const entries = (await fixture.lorebooks.listEntries(lorebook!.id)) as LorebookEntry[];
    assert.equal(entries.length, 1);
    const entry = entries[0]!;
    const manager = (entry.dynamicState.humanosNarrativeArc ?? {}) as Record<string, unknown>;
    assert.equal(entry.name, "ALT Runtime Arc Projection");
    assert.equal(entry.tag, "humanos:narrative-arc");
    assert.match(entry.content, /Narrative arc direction:/);
    assert.match(entry.content, /First message seed:/);
    assert.match(entry.content, /Alternate openings:/);
    assert.equal(manager.kind, "narrative_arc_projection");
    assert.equal(manager.variant, "ALT");
    assert.equal(manager.subjectId, "char-1");
    assert.equal(manager.subjectName, "Ava Vale");
    assert.equal(
      manager.lorebookHook,
      "Ava's current arc is defined by rising public pressure and private restraint.",
    );
  } finally {
    await fixture.cleanup();
  }
});

test("narrative arc apply keeps ALT and BRANCH as separate managed entries", async () => {
  const fixture = await createRouteFixture();
  try {
    const lorebook = (await fixture.lorebooks.create({
      name: "Runtime Notes",
      description: "Active runtime projections",
      category: "character",
      enabled: true,
    })) as Lorebook | null;
    assert.ok(lorebook);

    const alt = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({ targetLorebookId: lorebook!.id, variant: "ALT" }),
    });
    assert.equal(alt.statusCode, 200, alt.body);
    assert.equal(alt.json().action, "created");

    const branch = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({
        targetLorebookId: lorebook!.id,
        variant: "BRANCH",
        lorebookHook: "Ava's branch arc deliberately leaves the canon-fit setup.",
      }),
    });
    assert.equal(branch.statusCode, 200, branch.body);
    assert.equal(branch.json().action, "created");
    assert.notEqual(branch.json().entry.id, alt.json().entry.id);

    const entries = (await fixture.lorebooks.listEntries(lorebook!.id)) as LorebookEntry[];
    assert.equal(entries.length, 2);
    assert.ok(entries.some((entry) => entry.name === "ALT Runtime Arc Projection"));
    assert.ok(entries.some((entry) => entry.name === "BRANCH Runtime Arc Projection"));
    const branchEntry = entries.find((entry) => entry.name === "BRANCH Runtime Arc Projection");
    assert.ok(branchEntry);
    const manager = (branchEntry!.dynamicState.humanosNarrativeArc ?? {}) as Record<string, unknown>;
    assert.equal(manager.variant, "BRANCH");
    assert.match(branchEntry!.content, /deliberately leaves the canon-fit setup/);
  } finally {
    await fixture.cleanup();
  }
});

test("narrative arc apply updates the existing managed entry instead of duplicating it", async () => {
  const fixture = await createRouteFixture();
  try {
    const lorebook = (await fixture.lorebooks.create({
      name: "Runtime Notes",
      description: "Active runtime projections",
      category: "character",
      enabled: true,
    })) as Lorebook | null;
    assert.ok(lorebook);

    const first = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({ targetLorebookId: lorebook!.id }),
    });
    assert.equal(first.statusCode, 200, first.body);
    const originalEntryId = first.json().entry.id;

    const second = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({
        targetLorebookId: lorebook!.id,
        firstMessage: "Open with Ava choosing the harder path on purpose.",
        lorebookHook: "Ava's arc now tilts toward self-exposure instead of concealment.",
      }),
    });
    assert.equal(second.statusCode, 200, second.body);
    assert.equal(second.json().action, "updated");
    assert.equal(second.json().entry.id, originalEntryId);

    const entries = (await fixture.lorebooks.listEntries(lorebook!.id)) as LorebookEntry[];
    assert.equal(entries.length, 1);
    assert.equal(entries[0]!.id, originalEntryId);
    assert.match(entries[0]!.content, /self-exposure instead of concealment/);
    const manager = (entries[0]!.dynamicState.humanosNarrativeArc ?? {}) as Record<string, unknown>;
    assert.equal(
      manager.firstMessage,
      "Open with Ava choosing the harder path on purpose.",
    );
  } finally {
    await fixture.cleanup();
  }
});

test("narrative arc apply fails closed when the managed active-lorebook entry is locked", async () => {
  const fixture = await createRouteFixture();
  try {
    const lorebook = (await fixture.lorebooks.create({
      name: "Runtime Notes",
      description: "Active runtime projections",
      category: "character",
      enabled: true,
    })) as Lorebook | null;
    assert.ok(lorebook);

    const created = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({ targetLorebookId: lorebook!.id }),
    });
    assert.equal(created.statusCode, 200, created.body);
    const createdEntryId = created.json().entry.id as string;
    await fixture.lorebooks.updateEntry(createdEntryId, { locked: true });

    const response = await fixture.app.inject({
      method: "POST",
      url: "/api/humanos-v2/narrative-arc/apply-lorebook",
      payload: payload({
        targetLorebookId: lorebook!.id,
        lorebookHook: "This overwrite should be rejected.",
      }),
    });
    assert.equal(response.statusCode, 409, response.body);
    assert.equal(response.json().error, "NARRATIVE_ARC_TARGET_ENTRY_LOCKED");

    const entry = (await fixture.lorebooks.getEntry(createdEntryId)) as LorebookEntry | null;
    assert.ok(entry);
    assert.equal(entry?.locked, true);
    assert.doesNotMatch(entry?.content ?? "", /This overwrite should be rejected/);
  } finally {
    await fixture.cleanup();
  }
});
