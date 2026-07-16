import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import type { DB } from "../../../db/connection.js";
import * as schema from "../../../db/schema/index.js";
import { runMigrations } from "../../../db/migrate.js";
import { personaCharacterLinks } from "../../../db/schema/index.js";
import { createCharactersStorage } from "../../storage/characters.storage.js";

async function createTestDatabase() {
  const tempDir = mkdtempSync(join(tmpdir(), "marinara-persona-character-links-"));
  const dbPath = join(tempDir, "links.db");
  const client = createClient({ url: `file:${dbPath}` });
  const db = drizzle(client, { schema }) as unknown as DB;
  await runMigrations(db);
  return {
    db,
    cleanup() {
      client.close();
      rmSync(tempDir, { recursive: true, force: true });
    },
  };
}

function sortLinks<T extends { characterId: string; role: string }>(links: T[]) {
  return [...links].sort((a, b) => a.role.localeCompare(b.role) || a.characterId.localeCompare(b.characterId));
}

test("persona editor links persist as first-class primary character pairings", async () => {
  const { db, cleanup } = await createTestDatabase();
  try {
    const storage = createCharactersStorage(db);
    const primaryCharacter = await storage.create({
      name: "Dante",
      description: "A test character.",
      personality: "Calm",
      scenario: "",
      first_mes: "",
      mes_example: "",
      creator_notes: "",
      system_prompt: "",
      post_history_instructions: "",
      tags: [],
      creator: "",
      character_version: "1.0",
      alternate_greetings: [],
      extensions: {
        talkativeness: 0.5,
        fav: false,
        world: "",
        depth_prompt: { prompt: "", depth: 4, role: "system" },
        backstory: "",
        appearance: "",
      },
      character_book: null,
    });
    assert.ok(primaryCharacter);
    const secondaryCharacter = await storage.create({
      name: "Reyna",
      description: "A linked secondary character.",
      personality: "Sharp",
      scenario: "",
      first_mes: "",
      mes_example: "",
      creator_notes: "",
      system_prompt: "",
      post_history_instructions: "",
      tags: [],
      creator: "",
      character_version: "1.0",
      alternate_greetings: [],
      extensions: {
        talkativeness: 0.5,
        fav: false,
        world: "",
        depth_prompt: { prompt: "", depth: 4, role: "system" },
        backstory: "",
        appearance: "",
      },
      character_book: null,
    });
    assert.ok(secondaryCharacter);

    const persona = await storage.createPersona("Lexi", "A test persona.", undefined, {
      characterLinks: [
        { characterId: primaryCharacter!.id, role: "primary" },
        { characterId: secondaryCharacter!.id, role: "secondary" },
      ],
    });
    assert.equal(persona?.linkedCharacterId, primaryCharacter!.id);
    assert.equal(persona?.linkedCharacter?.id, primaryCharacter!.id);
    assert.equal(persona?.characterLinks?.length, 2);
    assert.deepEqual(
      persona?.characterLinks?.map((link) => ({ characterId: link.characterId, role: link.role })),
      [
        { characterId: primaryCharacter!.id, role: "primary" },
        { characterId: secondaryCharacter!.id, role: "secondary" },
      ],
    );

    const createdLinks = await db.select().from(personaCharacterLinks);
    assert.equal(createdLinks.length, 2);
    assert.deepEqual(
      sortLinks(createdLinks.map((link) => ({ personaId: link.personaId, characterId: link.characterId, role: link.role }))),
      sortLinks([
        { personaId: persona?.id, characterId: primaryCharacter!.id, role: "primary" },
        { personaId: persona?.id, characterId: secondaryCharacter!.id, role: "secondary" },
      ]),
    );

    const clearedPrimary = await storage.updatePersona(persona!.id, {
      characterLinks: [
        { characterId: primaryCharacter!.id, role: "secondary" },
        { characterId: secondaryCharacter!.id, role: "secondary" },
      ],
    });
    assert.equal(clearedPrimary?.linkedCharacterId, null);
    assert.equal(clearedPrimary?.characterLinks?.length ?? 0, 2);
    assert.deepEqual(
      sortLinks(clearedPrimary?.characterLinks?.map((link) => ({ characterId: link.characterId, role: link.role })) ?? []),
      sortLinks([
        { characterId: primaryCharacter!.id, role: "secondary" },
        { characterId: secondaryCharacter!.id, role: "secondary" },
      ]),
    );

    const relinked = await storage.updatePersona(persona!.id, {
      characterLinks: [
        { characterId: secondaryCharacter!.id, role: "primary" },
        { characterId: primaryCharacter!.id, role: "secondary" },
      ],
    });
    assert.equal(relinked?.linkedCharacterId, secondaryCharacter!.id);
    assert.equal((await db.select().from(personaCharacterLinks)).length, 2);

    const duplicated = await storage.duplicatePersona(persona!.id);
    assert.equal(duplicated?.linkedCharacterId, secondaryCharacter!.id);
    const duplicateLinks = await db
      .select()
      .from(personaCharacterLinks)
      .where(eq(personaCharacterLinks.personaId, duplicated!.id));
    assert.equal(duplicateLinks.length, 2);
    assert.deepEqual(
      sortLinks(duplicateLinks.map((link) => ({ characterId: link.characterId, role: link.role }))),
      sortLinks([
        { characterId: primaryCharacter!.id, role: "secondary" },
        { characterId: secondaryCharacter!.id, role: "primary" },
      ]),
    );

    await storage.updatePersona(persona!.id, { characterLinks: [] });
    const versions = await storage.listPersonaVersions(persona!.id);
    assert.ok(versions.length >= 3);
    const withClearedLink = await storage.getPersona(persona!.id);
    assert.equal(withClearedLink?.linkedCharacterId, null);
    assert.equal(withClearedLink?.characterLinks?.length ?? 0, 0);

    const linkedVersion = versions.find(
      (version) =>
        version.data.linkedCharacterId === secondaryCharacter!.id &&
        version.data.characterLinks.includes(primaryCharacter!.id),
    );
    assert.ok(linkedVersion);
    const restored = await storage.restorePersonaVersion(persona!.id, linkedVersion!.id);
    assert.equal(restored?.linkedCharacterId, secondaryCharacter!.id);
    assert.equal(restored?.linkedCharacter?.id, secondaryCharacter!.id);
    assert.deepEqual(
      sortLinks(restored?.characterLinks?.map((link) => ({ characterId: link.characterId, role: link.role })) ?? []),
      sortLinks([
        { characterId: secondaryCharacter!.id, role: "primary" },
        { characterId: primaryCharacter!.id, role: "secondary" },
      ]),
    );
  } finally {
    cleanup();
  }
});
