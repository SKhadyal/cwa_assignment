import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { sequelize } from "@/lib/sequelize";
import Result from "@/models/Result";
import {
  GET as listResults,
  POST as createResult,
} from "@/app/api/results/route";
import {
  GET as retrieveResult,
  PUT as updateResult,
  DELETE as deleteResult,
} from "@/app/api/results/[id]/route";

const baseUrl = "http://localhost/api/results";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Results API CRUD", () => {
  it("creates a record and lists it", async () => {
    const stages = {
      stage1: {
        rawInput: "console.log('Hello World')",
        normalizedAnswer: "console.log('helloworld');",
      },
      stage4: {
        jsonInput: '[{"name":"Alice"}]',
        csvOutput: "Alice",
      },
    };
    const payload = {
      playerName: "Test Player",
      stages,
    };

    const createResponse = await createResult(
      new Request(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as Result;
    expect(created.playerName).toBe("Test Player");
    expect(created.csvOutput).toBe("Alice");
    expect((created as any).stages).toMatchObject(stages);

    const listResponse = await listResults(new Request(baseUrl));
    expect(listResponse.status).toBe(200);
    const list = (await listResponse.json()) as Array<
      Result & { stages: Record<string, unknown> }
    >;
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(created.id);
    expect(list[0].stages).toMatchObject(stages);
  });

  it("updates and deletes an existing record", async () => {
    const initialStages = {
      stage4: {
        jsonInput: '[{"name":"Bob"}]',
        csvOutput: "Bob",
      },
    };
    const result = await Result.create({
      playerName: "Initial",
      jsonInput: JSON.stringify(initialStages),
      csvOutput: "Bob",
    });

    const updateResponse = await updateResult(
      new Request(`${baseUrl}/${result.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: "Updated Name",
          stages: {
            ...initialStages,
            stage2: { fixed: true },
          },
        }),
      }),
      { params: { id: String(result.id) } }
    );

    expect(updateResponse.status).toBe(200);
    const updated = (await updateResponse.json()) as Result & {
      stages: Record<string, any>;
    };
    expect(updated.playerName).toBe("Updated Name");
    expect(updated.stages.stage2.fixed).toBe(true);

    const getResponse = await retrieveResult(
      new Request(`${baseUrl}/${result.id}`),
      { params: { id: String(result.id) } }
    );
    const fetched = (await getResponse.json()) as Result & {
      stages: Record<string, any>;
    };
    expect(fetched.playerName).toBe("Updated Name");
    expect(fetched.stages.stage2.fixed).toBe(true);

    const deleteResponse = await deleteResult(
      new Request(`${baseUrl}/${result.id}`, { method: "DELETE" }),
      { params: { id: String(result.id) } }
    );
    expect(deleteResponse.status).toBe(200);

    const remaining = await Result.count();
    expect(remaining).toBe(0);
  });
});
