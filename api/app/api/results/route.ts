import { NextResponse } from "next/server";
import Result from "@/models/Result";
import { ensureDatabase } from "@/lib/sequelize";

export const runtime = "nodejs";

const allowedOrigin =
  process.env.ALLOWED_ORIGIN ||
  process.env.NEXT_PUBLIC_FRONTEND_ORIGIN ||
  "*";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) =>
    response.headers.set(key, value)
  );
  return response;
}

function serializeResult(entry: Result) {
  let stages: unknown = entry.jsonInput;
  try {
    stages = JSON.parse(entry.jsonInput);
  } catch {
    // fall back to raw string if parsing fails
  }

  return {
    id: entry.id,
    playerName: entry.playerName,
    stages,
    csvOutput: entry.csvOutput,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

export function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  await ensureDatabase();
  const results = await Result.findAll({
    order: [["createdAt", "DESC"]],
  });
  return withCors(NextResponse.json(results.map((result) => serializeResult(result))));
}

export async function POST(request: Request) {
  await ensureDatabase();

  try {
    const body = await request.json();
    const playerName = body?.playerName;
    const stages = body?.stages ?? body?.stageData;

    const computedJsonInput =
      typeof body?.jsonInput === "string"
        ? body.jsonInput
        : stages
        ? JSON.stringify(stages)
        : null;

    let computedCsv = "";
    if (typeof body?.csvOutput === "string") {
      computedCsv = body.csvOutput;
    } else if (
      stages &&
      typeof stages === "object" &&
      stages.stage4 &&
      typeof stages.stage4 === "object" &&
      stages.stage4.csvOutput
    ) {
      computedCsv = String(stages.stage4.csvOutput);
    }

    if (!playerName || !computedJsonInput) {
      return withCors(
        NextResponse.json(
          { error: "playerName and at least one stage result are required." },
          { status: 400 }
        )
      );
    }

    const result = await Result.create({
      playerName: String(playerName).slice(0, 120),
      jsonInput: String(computedJsonInput),
      csvOutput: computedCsv,
    });

    return withCors(NextResponse.json(serializeResult(result), { status: 201 }));
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: "Unable to save result.", details: `${error}` },
        { status: 500 }
      )
    );
  }
}
