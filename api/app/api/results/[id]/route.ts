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
  "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
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
    // best-effort parse; fall back to raw value
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

function parseId(value: string) {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await ensureDatabase();
  const id = parseId(params.id);
  if (!id) {
    return withCors(
      NextResponse.json({ error: "Invalid id." }, { status: 400 })
    );
  }

  const result = await Result.findByPk(id);
  if (!result) {
    return withCors(
      NextResponse.json({ error: "Result not found." }, { status: 404 })
    );
  }

  return withCors(NextResponse.json(serializeResult(result)));
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await ensureDatabase();
  const id = parseId(params.id);
  if (!id) {
    return withCors(
      NextResponse.json({ error: "Invalid id." }, { status: 400 })
    );
  }

  const result = await Result.findByPk(id);
  if (!result) {
    return withCors(
      NextResponse.json({ error: "Result not found." }, { status: 404 })
    );
  }

  try {
    const body = await request.json();
    const playerName = body.playerName ?? result.playerName;
    const stages = body?.stages ?? body?.stageData;
    const jsonInput =
      typeof body?.jsonInput === "string"
        ? body.jsonInput
        : stages
        ? JSON.stringify(stages)
        : result.jsonInput;

    let csvOutput = result.csvOutput;
    if (typeof body?.csvOutput === "string") {
      csvOutput = body.csvOutput;
    } else if (
      stages &&
      typeof stages === "object" &&
      stages.stage4 &&
      typeof stages.stage4 === "object" &&
      stages.stage4.csvOutput
    ) {
      csvOutput = String(stages.stage4.csvOutput);
    }

    await result.update({
      playerName: String(playerName).slice(0, 120),
      jsonInput: String(jsonInput),
      csvOutput: String(csvOutput),
    });

    return withCors(NextResponse.json(serializeResult(result)));
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: "Unable to update result.", details: `${error}` },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await ensureDatabase();
  const id = parseId(params.id);
  if (!id) {
    return withCors(
      NextResponse.json({ error: "Invalid id." }, { status: 400 })
    );
  }

  const result = await Result.findByPk(id);
  if (!result) {
    return withCors(
      NextResponse.json({ error: "Result not found." }, { status: 404 })
    );
  }

  await result.destroy();
  return withCors(NextResponse.json({ success: true }));
}
